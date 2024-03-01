package main

import (
	"capstone-project-9900h14atiktokk/Router"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/util"
)

func main() {
	srv := util.InitConfig()
	db := util.InitMySQL()
	redisCli := util.InitRedis()
	// 全局数据库链接
	Service.DB = db
	r := Router.Router(srv, redisCli)
	err := r.Run(":8080")
	if err != nil {
		return
	}
}
