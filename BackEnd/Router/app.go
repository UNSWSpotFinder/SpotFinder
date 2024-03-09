package Router

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/Service/Spots"
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
	r.POST("/user/create/verifyEmail", User.VerifiedCodeHandler)
	r.POST("/user/create/sendEmail", func(c *gin.Context) {
		User.SendCodeHandler(srv, c, redisCli)
	})
	return r
}
