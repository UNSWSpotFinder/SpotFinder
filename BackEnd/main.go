// @SecurityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

package main

import (
	"capstone-project-9900h14atiktokk/Router"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/Service/Manager"
	"capstone-project-9900h14atiktokk/Service/Message"
	pb "capstone-project-9900h14atiktokk/Service/Message/proto"
	"capstone-project-9900h14atiktokk/util"
	"fmt"
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
	// create a log file
	file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		logrus.Fatal("Failed to log to file, using default stderr")
	}

	// set log output
	logrus.SetOutput(file)
	// add log output to stdout
	logrus.SetOutput(io.MultiWriter(file, os.Stdout))
}

// @title           SpotFinder
// @version         1.0
// @description     This is a server for SpotFinder, a project for 9900H14A. Maybe it could be a good memory.
// @termsOfService  http://swagger.io/terms/

// @contact.name   Sizhuo Long
// @contact.url    https://www.github.com/longsizhuo
// @contact.email  longsizhuo@gmail.com

// @BasePath  /

// @securityDefinitions.basic  BasicAuth

// @externalDocs.description  Find out more about Swagger
// @externalDocs.url          http://swagger.io
func main() {
	setupLogger()
	logrus.Info("Starting the application...")
	// set log level
	log.Formatter = new(logrus.JSONFormatter)
	log.Level = logrus.DebugLevel // InfoLevel elsewhere

	rand.Seed(uint64(time.Now().UnixNano()))
	util.InitConfig()
	db := util.InitMySQL()
	redisCli := util.InitRedis()
	// database connection
	Service.DB = db
	r := Router.Router(redisCli)
	// open a goroutine to run the HTTP server
	go func() {
		if err := r.Run(":8080"); err != nil {
			logrus.Fatalf("failed to run HTTP server: %v", err)
		}
	}()
	// Schedule daily cost calculation
	ticker := time.NewTicker(24 * time.Hour) // calculate daily cost every 24 hours
	go func() {
		// calculate daily cost
		fmt.Println("Calculating daily cost...")
		for range ticker.C {
			err := Manager.CalculateDailyCost()
			if err != nil {
				fmt.Println("Error calculating daily cost:", err)
			}
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
