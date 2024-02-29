package User

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
	"google.golang.org/api/gmail/v1"
	"gorm.io/gorm"
	"net/http"
	"time"
)

var DB *gorm.DB

// RequestData 从前端传回来的数据存储到这个结构体中
type RequestData struct {
	Email string `json:"to" example:"longsizhuo@gmail.com" format:"emailconfigs" binding:"required"`
}

// GetUserList
// @Summary 获取用户列表
// @Schemes
// @Description do ping
// @Tags example
// @Accept json
// @Produce json
// @Success 200 {string} json{"code", "message"}
// @Router /user/list [get]
func GetUserList(c *gin.Context) {
	users, err := User.GetUserList(DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot get user list",
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": users,
	})
}

type CreationRequest struct {
	User.Basic
	RePassword string `json:"rePassword"`
}

// CreateUser
// @Summary 创建用户
// @Consumes application/x-www-form-urlencoded
// @Description do ping
// @Param name formData string true "用户名"
// @Param password formData string true "密码"
// @Param rePassword formData string true "确认密码"
// @Param phone formData string true "手机号"
// @Param email formData string true "邮箱"
// @Success 200 {string} json{"code", "message"}
// @Fail
// @Router /user/create [post]
func CreateUser(c *gin.Context) {
	//var request UserCreationRequest
	//
	//if err := c.ShouldBindJSON(&request); err != nil {
	//	c.JSON(http.StatusBadRequest, gin.H{
	//		"error": "Cannot bind JSON: " + err.Error(),
	//	})
	//	return
	//}
	var user User.Basic
	fmt.Printf("Headers: %+v\n", c.Request.Header)
	fmt.Printf("Form data: %+v\n", c.Request.PostForm)
	var Password = c.PostForm("password")
	var RePassword = c.PostForm("rePassword")
	user.Phone = c.PostForm("phone")
	user.Email = c.PostForm("email")
	loginTime := time.Now()
	user.LoginTime = &loginTime
	user.HeartbeatTime = nil
	user.LogoutTime = nil

	if Password != RePassword {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Password not equal",
		})
		return
	}

	// 判断邮箱是否已经注册过
	isRegistry, err := User.CheckEmailAlreadyIn(DB, &user)
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
	fmt.Println(user)
	if err := User.CreateUser(DB, &user); err != nil {
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
//	@Tags			Code
//	@Accept			json
//	@Produce		json
//	@Param			emailconfigs	body		RequestData	true	"Recipient emailconfigs address"	Format(emailconfigs)
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
		c.JSON(http.StatusInternalServerError, "我怀疑你断网了")
		return
	}

}
