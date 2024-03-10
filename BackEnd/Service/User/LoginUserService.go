package User

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"net/http"
)

type loginRequestData struct {
	Email  string `json:"email" example:"longsizhuo@gmail.com"`
	Passwd string `json:"password" example:"123456"`
}

// LoginHandler 登陆
// @Summary 登陆
// @Description 登陆
// @Tags User
// @Accept json
// @Produce json
// @Param user body loginRequestData true "User"
// @Success 200 {string} string "Login Success"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /login [post]
func LoginHandler(c *gin.Context) {
	var newData loginRequestData
	var user User.Basic
	err := c.ShouldBindJSON(&newData)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data binding error"})
		return
	}
	user.Email = newData.Email
	user.Password = newData.Passwd
	JWT, err := User.Login(Service.DB, &user)
	if err != nil {
		// 根据错误类型返回不同的HTTP状态码
		if err.Error() == "user not found" || err.Error() == "password mismatch" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		}
		return
	}
	// 如果一切正常，将JWT令牌发送给客户端
	c.JSON(http.StatusOK, gin.H{"token": JWT})
	return
}
