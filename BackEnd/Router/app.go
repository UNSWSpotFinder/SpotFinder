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
	"github.com/spf13/viper"
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

	// Public routes
	public := r.Group("/")
	public.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	public.GET("/authorization", Service.GetAuthorization)
	public.GET("/index", Service.GetIndexHandler)
	public.GET("/user/list", User.GetUserList)
	public.POST("/user/create", User.CreateUser)
	public.GET("/spot/ownedList/:ownerId", Spots.ShowAllOwnedSpotHandler)
	public.GET("/spot/list", Spots.GetSpotListHandler)
	public.GET("/spot/ownedCar/choseSize/:plateNumber", Spots.ChoseSizeWithMyCarHandler)
	public.PUT("/spot/delete/:id", Spots.DeleteSpotController)
	public.PUT("/spot/update", Spots.UpdateSpotController)
	public.PUT("/spot/update/spotPrice", Spots.UpdateSpotPriceHandler)
	public.POST("/user/create/verifyEmail", func(c *gin.Context) {
		User.VerifiedCodeHandler(c, redisCli)
	})
	public.POST("/user/create/sendEmail", func(c *gin.Context) {
		User.SendCodeHandler(srv, c, redisCli)
	})
	public.POST("/login", User.LoginHandler) // Login might typically be public
	public.POST("/manager/create", Manager.CreateManagerHandler)
	public.POST("/manager/login", Manager.LoginHandler)
	public.GET("/spot/:spotId", Spots.GetSpotDetailsHandler)
	// Private (authenticated) routes
	private := r.Group("/")
	SecreteKey := viper.GetString("secrete.key")
	private.Use(Service.AuthMiddleware(SecreteKey)) // Use your actual secret key here, not "BearerAuth"
	private.POST("/user/modifyPasswd", User.ModifyPasswdHandler)
	private.POST("/user/modifyUserInfo", User.ModifyUserInfoHandler)
	private.GET("/user/info", User.GetUserInfoHandler)
	private.POST("/spot/create", Spots.CreateSpotController)
	private.POST("/user/topUp", User.TopUpHandler)
	private.POST("/user/withdraw", User.WithdrawHandler)
	return r

}
