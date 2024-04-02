package User

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type modifyPasswordData struct {
	Email    string `json:"email" example:"longsizhuo@gmail.com"`
	Password string `json:"password"`
	Repasswd string `json:"repassword"`
}

type ModifyUserInfoData struct {
	// Email 不能被修改，不能在这里修改，是主键
	Email     string `json:"email" example:"longsizhuo@gmail.com"`
	Name      string `json:"name" example:"longsizhuo"`
	Phone     string `json:"phone" example:"123456"`
	DateBirth string `json:"dateBirth" example:"25/02/1999"`
	Avatar    string `json:"avata" example:"avata"`
	Address   string `json:"address" example:"address"`
}

// ModifyPasswdHandler 修改密码
// @Summary 修改密码
// @Description 修改密码
// @Tags User
// @Accept json
// @Produce json
// @Param email body modifyPasswordData true "User Email"
// @Success 200 {string} string "Password updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/modifyPasswd [post]
func ModifyPasswdHandler(c *gin.Context) {
	var request modifyPasswordData
	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data binding error"})
		return
	}

	// 检查新密码和确认密码是否一致
	if request.Password != request.Repasswd {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password not same"})
		return
	}

	// 生成新的哈希密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	// 更新密码
	newUserData := Models.UserBasic{Email: request.Email, Password: string(hashedPassword)}
	err = User.ModifyPasswd(Service.DB, &newUserData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated"})
}

// ModifyUserInfoHandler 修改用户信息
// @Summary 修改用户信息
// @Description 修改用户信息
// @Tags User
// @Accept json
// @Produce json
// @Param user body ModifyUserInfoData true "User"
// @Success 200 {string} string "User information updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/modifyUserInfo [post]
// @Security BearerAuth
func ModifyUserInfoHandler(c *gin.Context) {
	// 从JWT中获取的email和role
	emailFromToken, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	role, _ := c.Get("role")

	var user Models.UserBasic
	var request ModifyUserInfoData
	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(400, "Data binding error")
		return
	}

	user.Email = request.Email
	user.Name = request.Name
	user.Phone = request.Phone
	user.DateBirth = request.DateBirth
	user.Avatar = request.Avatar
	user.Addr = request.Address

	// 如果用户不是管理员，并且请求的邮箱与令牌的邮箱不匹配，则拒绝请求
	if role != "admin" && emailFromToken != request.Email {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden to change other user's information"})
		return

	}
	// 更新用户信息
	err = User.ModifyUserInfo(Service.DB, &user)
	if err != nil {
		c.JSON(500, err)
		return
	}
	c.JSON(200, "User information updated")
	return
}
