package Router

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/Service/User"
	"capstone-project-9900h14atiktokk/docs"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"google.golang.org/api/gmail/v1"
)

func Router(srv *gmail.Service, redisCli *redis.Client) *gin.Engine {
	r := gin.Default()

	docs.SwaggerInfo.Title = "TikTokk"
	docs.SwaggerInfo.BasePath = ""
	// swagger init
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/index", Service.GetIndex)
	r.GET("/user/list", User.GetUserList)
	r.POST("/user/create", User.CreateUser)
	r.POST("/user/create/sendEmail", func(c *gin.Context) {
		User.SendCodeHandler(srv, c, redisCli)
	})
	return r
}
