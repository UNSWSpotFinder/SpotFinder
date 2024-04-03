package User

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/Service/Manager"
	"capstone-project-9900h14atiktokk/controller"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/gmail/v1"
	_ "gorm.io/gorm"
	"net/http"
	"time"
)

// RequestData 从前端传回来的数据存储到这个结构体中
type RequestData struct {
	Email string `json:"to" example:"longsizhuo@gmail.com" format:"emailconfigs" binding:"required"`
}

// InfoDetail 用户详情
type InfoDetail struct {
	Name       string     `json:"name" example:"longsizhuo" binding:"required"`
	Email      string     `json:"email" example:"longsizhuo@gmail.com"`
	Phone      string     `json:"phone" example:"123456"`
	Avatar     string     `json:"avatar" example:"avata"`
	CreateTime time.Time  `json:"createTime" example:"2021-07-01 00:00:00"`
	DeleteTime *time.Time `json:"deleteTime" example:"2021-07-01 00:00:00"`
	DateBirth  string     `json:"dateBirth" example:"25/02/1999"`
	CarInfo    string     `json:"carInfo" example:"{}"`
	LeasedSpot string     `json:"leasedSpot" example:"{}"`
	Addr       string     `json:"addr" example:""`
	Account    float64    `json:"account" example:"0.0"`
	Earning    float64    `json:"earning" example:"0.0"`
	TopUp      float64    `json:"topUp" example:"0.0"`
	OwnedSpot  string     `json:"ownedSpot" example:"{}"`
}
type SimpleProfileRequest struct {
	Avatar string `json:"avatar"`
	Name   string `json:"name"`
}

// GetUserList
// @Summary 获取用户列表
// @Schemes
// @Description do ping
// @Tags User
// @Accept json
// @Produce json
// @Success 200 {string} json{"code", "message"}
// @Router /user/list [get]
func GetUserList(c *gin.Context) {
	users, err := User.GetUserList(Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": users,
	})
}

// CreateUserRequest 从前端传回来的数据存储到这个结构体中
type CreateUserRequest struct {
	Name       string `json:"name" binding:"required"`
	Password   string `json:"password" binding:"required"`
	RePassword string `json:"rePassword" binding:"required"`
	Phone      string `json:"phone" binding:"required"`
	Email      string `json:"email" binding:"required"`
	Avatar     string `json:"avatar"`
	DateBirth  string `json:"dateBirth"`
}

type TopUpRequest struct {
	Amount float64 `json:"amount" binding:"required"`
}

// CreateUser
// @Summary 创建用户
// @Schemes
// @Tags User
// @Consumes application/x-www-form-urlencoded
// @Description do ping
// @Param user body CreateUserRequest true "用户信息"
// @Success 200 {string} json{"code", "message"}
// @Fail
// @Router /user/create [post]
func CreateUser(c *gin.Context) {
	var request CreateUserRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Cannot bind JSON: " + err.Error(),
		})
		return
	}
	var user Models.UserBasic
	//fmt.Printf("Headers: %+v\n", c.Request.Header)
	//fmt.Printf("Form data: %+v\n", c.Request.PostForm)
	user.Phone = request.Phone
	user.Email = request.Email
	user.Name = request.Name
	user.CreateTime = time.Now()
	user.Avatar = request.Avatar
	user.DateBirth = request.DateBirth

	// 判断日期是否合法 DD/MM/YYYY
	_, err := time.Parse("02/01/2006", request.DateBirth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Date format error",
		})
		return
	}

	if request.Password != request.RePassword {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Password not equal",
		})
		return
	}

	// 密码加密
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}
	user.Password = string(hashedPassword)

	// 判断邮箱是否已经注册过
	isRegistry, err := User.CheckEmailAlreadyIn(Service.DB, &user)
	if isRegistry {
		c.JSON(http.StatusExpectationFailed, gin.H{
			"error": "Email is Already Registered",
		})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
	}
	//fmt.Println(user)
	if err := User.CreateUser(Service.DB, &user); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Create user success",
	})

}

// SendCodeHandler 处理发送验证码的请求
//
//	@Summary		Send code
//	@Description	发送验证码到指定邮箱，并存储验证码到Redis
//	@Tags			User
//	@Accept			json
//	@Produce		json
//	@Param			emailconfigs body RequestData	true	"Recipient emailconfigs address"	Format(emailconfigs)
//	@Success		200		{object}	RequestData	"OK"
//	@Failure		400		{object}	nil			"Bad Request"
//	@Failure		500		{object}	nil			"Internal Server Error"
//	@Router			/user/create/sendEmail [post]
func SendCodeHandler(srv *gmail.Service, c *gin.Context, redisCli *redis.Client) {
	var requestData RequestData
	err := c.ShouldBindJSON(&requestData)
	if err != nil {
		c.JSON(http.StatusBadRequest, nil)
		fmt.Println(http.StatusBadRequest)
		return
	}
	code := GenerateCode()

	err = redisCli.Set(Ctx, requestData.Email, code, 1000*time.Second).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, "Redis错误啦")
		return
	}

	err = SendEmail(srv, requestData.Email, "Credential Code", "您的验证码是 "+code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "我怀疑你断网了"})
		return
	}

}

// GetUserInfoHandler 获取用户信息
//
// @Summary Get user information
// @Description 获取用户信息。如果未提供email查询参数，则返回当前用户的信息。如果提供了email查询参数，只有管理员可以查询其他用户的信息。
// @Tags User
// @Accept json
// @Produce json
// @Param email query string false "要查询的用户邮箱"
// @Success 200 {object} InfoDetail "成功获取用户信息"
// @Success 200 {object} Manager.AdminInfo "成功获取管理员信息"
// @Failure 400 {object} nil "错误的请求"
// @Failure 401 {object} nil "未授权或无权限"
// @Failure 500 {object} nil "内部服务器错误"
// @Router /user/info [get]
// @Security BearerAuth
func GetUserInfoHandler(c *gin.Context) {
	// 从JWT中获取的email和role
	emailFromToken, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	role, roleExists := c.Get("role")

	// 确定要查询的邮箱：默认为JWT中的邮箱
	targetEmail := emailFromToken.(string)

	// 获取查询参数中的邮箱（如果有）
	queryEmail := c.Query("email")
	// AdminID 在这里也是email的key
	if queryEmail != "" {
		// 如果提供了查询参数，则需要验证当前用户是否为管理员
		if roleExists && role == "admin" {
			targetEmail = queryEmail
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Forbidden: only admins can query other user's information"})
			return
		}
	}
	if queryEmail == "" && role == "admin" {
		// 查询管理员自己的信息
		queryAdminID := targetEmail
		admin, err := controller.GetManagerByAdminID(Service.DB, queryAdminID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get admin information" + err.Error()})
			return
		}
		infoDetail := Manager.AdminInfo{
			AdminID: admin.AdminID,
			Name:    admin.Name,
			Phone:   admin.Phone,
		}
		c.JSON(http.StatusOK, gin.H{
			"message": infoDetail,
		})
		return
	} else {
		// 使用确定的邮箱来查询用户信息
		user := User.GetUserByEmail(Service.DB, targetEmail)
		// 填充InfoDetail实例
		infoDetail := InfoDetail{
			Name:       user.Name,
			Email:      user.Email,
			Phone:      user.Phone,
			Avatar:     user.Avatar,
			CreateTime: user.CreateTime,
			DeleteTime: user.DeleteTime,
			DateBirth:  user.DateBirth,
			CarInfo:    user.CarID,
			LeasedSpot: user.LeasedSpot,
			Addr:       user.Addr,
			Account:    user.Account,
			Earning:    user.Earning,
			TopUp:      user.TopUp,
			OwnedSpot:  user.OwnedSpot,
		}

		// 返回用户信息
		c.JSON(http.StatusOK, gin.H{"message": infoDetail})
	}
}

// TopUpHandler 充值
//
// @Summary 充值
// @Description 充值
// @Tags User
// @Accept json
// @Produce json
// @Param user body TopUpRequest true "充值金额"
// @Success 200 {string} string "User information updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/topUp [post]
// @Security BearerAuth
func TopUpHandler(c *gin.Context) {
	// 从JWT中获取的email和role
	userID := c.GetString("userID")

	var req TopUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 更新用户信息
	err := controller.TopUp(Service.DB, userID, req.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "User information updated")
}

// WithdrawHandler 提现
//
// @Summary 提现
// @Description 提现
// @Tags User
// @Accept json
// @Produce json
// @Param user body TopUpRequest true "提现金额"
// @Success 200 {string} string "User information updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/withdraw [post]
// @Security BearerAuth
func WithdrawHandler(c *gin.Context) {
	// 从JWT中获取的email和role
	userID := c.GetString("userID")

	var req TopUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Amount > 0 {
		req.Amount = -req.Amount
	}

	// 更新用户信息
	err := controller.Withdraw(Service.DB, userID, req.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "User information updated")
}

// GetSimpleUserInfoHandler 获取用户简单信息
//
// @Summary 获取用户简单信息
// @Description 获取用户简单信息
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "用户ID"
// @Success 200 {string} string "User information updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/simpleInfo/{id} [get]
func GetSimpleUserInfoHandler(c *gin.Context) {
	userID := c.Param("id")
	var user SimpleProfileRequest
	queryUser := User.GetUserByID(Service.DB, userID)
	if queryUser == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	user.Avatar = queryUser.Avatar
	user.Name = queryUser.Name
	c.JSON(http.StatusOK, gin.H{
		"message": user,
	})
}
