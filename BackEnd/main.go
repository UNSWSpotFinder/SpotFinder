// @SecurityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

package main

import (
	"capstone-project-9900h14atiktokk/Router"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/Service/Message"
	pb "capstone-project-9900h14atiktokk/Service/Message/proto"
	"capstone-project-9900h14atiktokk/util"
	"github.com/sirupsen/logrus"
	"golang.org/x/exp/rand"
	"google.golang.org/grpc"
	"io"
	"net"
	"os"
	"time"
)

var log = logrus.New()

func setupLogger() {
	// 创建日志文件
	file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		logrus.Fatal("Failed to log to file, using default stderr")
	}

	// 设置输出
	logrus.SetOutput(file)
	// 也可以同时输出到文件和控制台
	logrus.SetOutput(io.MultiWriter(file, os.Stdout))
}

func main() {
	setupLogger()
	logrus.Info("Starting the application...")
	// 设置日志格式为JSON，便于后期处理和查询
	log.Formatter = new(logrus.JSONFormatter)
	log.Level = logrus.DebugLevel // 可配置为InfoLevel或其他级别

	rand.Seed(uint64(time.Now().UnixNano()))
	srv := util.InitConfig()
	db := util.InitMySQL()
	redisCli := util.InitRedis()
	// 全局数据库链接
	Service.DB = db
	r := Router.Router(srv, redisCli)
	// 启动HTTP服务在新的goroutine中
	go func() {
		if err := r.Run(":8080"); err != nil {
			logrus.Fatalf("failed to run HTTP server: %v", err)
		}
	}()

	// Setup and start gRPC server
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}
	srvc := grpc.NewServer()
	pb.RegisterChatServiceServer(srvc, &Message.Server{})
	if err := srvc.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
