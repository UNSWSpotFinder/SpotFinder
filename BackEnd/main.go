package main

import (
	"capstone-project-9900h14atiktokk/Router"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/util"
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
	err := browser.OpenURL("http://localhost:8080/swagger/index.html")
	if err != nil {
		log.Fatal(err)
		return
	}
	err = r.Run(":8080")
	if err != nil {
		return
	}
}
