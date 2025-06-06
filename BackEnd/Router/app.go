package Router

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/Service/Manager"
	"capstone-project-9900h14atiktokk/Service/Message"
	"capstone-project-9900h14atiktokk/Service/Order"
	"capstone-project-9900h14atiktokk/Service/Report"
	"capstone-project-9900h14atiktokk/Service/Review"
	"capstone-project-9900h14atiktokk/Service/Spots"
	"capstone-project-9900h14atiktokk/Service/User"
	"capstone-project-9900h14atiktokk/Service/Vehicle"
	"capstone-project-9900h14atiktokk/Service/Voucher"
	"capstone-project-9900h14atiktokk/docs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"github.com/spf13/viper"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func Router(redisCli *redis.Client) *gin.Engine {
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
	docs.SwaggerInfo.Schemes = []string{"http", "https", "ws"}

	SecreteKey := viper.GetString("secrete.key")

	// webSocket route
	r.GET("/ws", Message.WebsocketHandler)

	// Public routes
	public := r.Group("/")
	public.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	public.GET("/authorization", Service.GetAuthorization)
	public.GET("/index", Service.GetIndexHandler)
	public.GET("/user/list", User.GetUserList)
	public.POST("/user/create", User.CreateUser)
	public.GET("/spot/list/", Spots.GetSpotListHandler)
	public.POST("/user/create/verifyEmail", func(c *gin.Context) {
		User.VerifiedCodeHandler(c, redisCli)
	})
	public.POST("/user/create/sendEmail", func(c *gin.Context) {
		User.SendCodeHandler(c, redisCli)
	})
	public.POST("/login", User.LoginHandler) // Login might typically be public
	public.POST("/manager/create", Manager.CreateManagerHandler)
	public.POST("/manager/login", Manager.LoginHandler)
	public.GET("/spot/:spotId", Spots.GetSpotDetailsHandler)
	public.GET("/user/simpleInfo/:id", User.GetSimpleUserInfoHandler)
	public.GET("/spots/:spotID/reviews", Review.GetReviewsBySpotID)
	public.GET("/reviews/:reviewID", Review.GetReviewByIDHandler)
	public.POST("/user/modifyPasswd", User.ModifyPasswdHandler)

	// Private (authenticated) routes
	private := r.Group("/")
	private.Use(Service.AuthMiddleware(SecreteKey)) // Use your actual secret key here, not "BearerAuth"
	private.POST("/user/modifyUserInfo", User.ModifyUserInfoHandler)
	private.GET("/user/info", User.GetUserInfoHandler)
	private.POST("/spot/create", Spots.CreateSpotController)
	private.POST("/user/topUp", User.TopUpHandler)
	private.POST("/user/withdraw", User.WithdrawHandler)
	private.POST("spot/modifySpotInfo/:spotId", Spots.ModifySpotInfoHandler)
	private.POST("car/create", Vehicle.AddVehicleHandler)
	private.GET("car/getMyCar", Vehicle.GetVehicleOfUserHandler)
	private.POST("car/modifyCarInfo/:carID", Vehicle.ModifyVehicleInfoHandler)
	private.PUT("/manager/invisible/:spotId", Manager.InvisibleSpotHandler)
	private.POST("/spots/:spotID/orders", Order.CreateOrderHandler)
	private.PUT("/order/:orderID/cancel", Order.CanceledOrderHandler)
	private.PUT("/order/:orderID/refund", Order.RefundOrderHandler)
	private.GET("/order/:orderID", Order.GetOrderInfoHandler)
	private.GET("/user/orders/asUser", Order.GetUserAllOrdersHandler)
	private.GET("/user/orders/asOwner", Order.GetOwnerAllOrdersHandler)
	private.GET("/car/getCar/:carID", Vehicle.GetVehicleByCarIDHandler)
	private.DELETE("/car/deleteCar/:carID", Vehicle.DeleteVehicleHandler)
	private.POST("/spots/:spotID/report", Report.CreateReportHandler)
	private.POST("/order/:orderID/reviews", Review.CreateReviewHandler)
	manager := r.Group("/")
	manager.Use(Service.AuthMiddleware(SecreteKey))
	manager.POST("/manager/approve/:spotId", Manager.ApproveSpotHandler)
	manager.PUT("/manager/block/:spotId", Manager.BlockSpotHandler)
	manager.PUT("/manager/unblock/:spotId", Manager.UnblockSpotHandler)
	manager.GET("/manager/report", Report.GetReportInfoHandler)
	manager.POST("/manager/report/solve", Report.SolveReportHandler)
	manager.GET("/manager/statistics", Manager.GetMoneyOfOrdersHandler)
	manager.POST("/manager/populate-daily-costs", Manager.PopulateDailyOrderCosts)
	manager.GET("/manager/users", Manager.GetLengthOfUsersHandler)
	manager.GET("/manager/spots", Manager.GetLengthOfSpotsHandler)
	manager.GET("/manager/orders", Manager.GetLengthOfOrdersHandler)
	manager.GET("/manager/managers", Manager.GetLengthOfManagerHandler)
	manager.POST("/vouchers/generate", Voucher.GenerateAndInsertVouchers)
	manager.GET("/vouchers/random", Voucher.GetVoucherHandler)
	manager.PUT("/vouchers/use/:code", Voucher.UseVoucherHandler)
	manager.GET("/vouchers/info/:code", Voucher.GetInfoOfVoucherHandler)
	return r

}
