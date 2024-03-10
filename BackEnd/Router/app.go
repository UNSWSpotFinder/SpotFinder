package Router

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/Service/Manager"
	"capstone-project-9900h14atiktokk/Service/Spots"
	"capstone-project-9900h14atiktokk/Service/User"
	"capstone-project-9900h14atiktokk/docs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"google.golang.org/api/gmail/v1"
)

func Router(srv *gmail.Service, redisCli *redis.Client) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // 允许前端应用的源
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	docs.SwaggerInfo.Title = "SpotFinder"
	docs.SwaggerInfo.Description = "This is a server for SpotFinder, a project for 9900H14A. Maybe it could be a good memory."
	docs.SwaggerInfo.BasePath = ""
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "localhost:8080"
	// swagger init
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.GET("/index", Service.GetIndex)
	r.GET("/user/list", User.GetUserList)
	r.GET("/spot/ownedList/:ownerId", Spots.ShowAllOwnedSpotHandler)
	r.GET("/spot/list/:page/:pageSize", Spots.SpotsQueryController)
	r.GET("/spot/ownedCar/choseSize/:plateNumber", Spots.ChoseSizeWithMyCarHandler)
	r.PUT("/spot/delete/:id", Spots.DeleteSpotController)
	r.PUT("/spot/update", Spots.UpdateSpotController)
	r.PUT("/spot/update/spotPrice", Spots.UpdateSpotPriceHandler)
	r.POST("/spot/create/:ownerId", Spots.CreateSpotController)
	r.POST("/user/create", User.CreateUser)
	r.POST("/user/create/verifyEmail", func(c *gin.Context) {
		User.VerifiedCodeHandler(c, redisCli)
	})
	r.POST("/user/create/sendEmail", func(c *gin.Context) {
		User.SendCodeHandler(srv, c, redisCli)
	})
	r.POST("/user/modifyPasswd", User.ModifyPasswdHandler)
	r.POST("/login", User.LoginHandler)
	r.POST("/user/modifyUserInfo", User.ModifyUserInfoHandler)
	r.POST("/manager/create", Manager.CreateManagerHandler)
	return r

}
