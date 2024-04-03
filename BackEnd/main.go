// @SecurityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

package main

import (
	"capstone-project-9900h14atiktokk/Router"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/util"
	"golang.org/x/exp/rand"
	"time"
)

func main() {
	rand.Seed(uint64(time.Now().UnixNano()))
	srv := util.InitConfig()
	db := util.InitMySQL()
	redisCli := util.InitRedis()
	// 全局数据库链接
	Service.DB = db
	r := Router.Router(srv, redisCli)
	//if util.BasePath == "./" {
	//	err := browser.OpenURL("http://localhost:8080/swagger/index.html")
	//	if err != nil {
	//		log.Fatal(err)
	//		return
	//	}
	//}
	err := r.Run(":8080")
	if err != nil {
		return
	}
}
