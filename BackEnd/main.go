package main

import "capstone-project-9900h14atiktokk/util"

func main() {
	srv := util.InitConfig()
	db := util.InitMySQL()
	redisCli := util.InitRedis()
	// 全局数据库链接
	service.DB = db
	r := router.Router(srv, redisCli)
	err := r.Run(":8080")
	if err != nil {
		return
	}
}
