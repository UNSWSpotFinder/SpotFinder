package main

import (
	"capstone-project-9900h14atiktokk/Router"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/util"
	"github.com/gin-contrib/cors"
	"github.com/pkg/browser"
	"log"
)

func main() {
	srv := util.InitConfig()
	db := util.InitMySQL()
	redisCli := util.InitRedis()
	// 全局数据库链接
	Service.DB = db
	r := Router.Router(srv, redisCli)
	err := r.Run(":8080")
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // 允许前端应用的源
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	if err != nil {
		return
	}
	err = browser.OpenURL("http://localhost:8080/swagger/index.html")
	if err != nil {
		log.Fatal(err)
		return
	}
}
