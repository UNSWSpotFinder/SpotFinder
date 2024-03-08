package User

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
)

type modifyRequestData struct {
	Email    string `json:"email" `
	Passwd   string `json:"password"`
	Repasswd string `json:"repassword"`
}

// ModifyPasswdHandler 修改密码
// @Summary 修改密码
// @Description 修改密码
// @Tags User
// @Accept json
// @Produce json
// @Param email body modifyRequestData true "User Email"
// @Success 200 {string} string "Password updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/modifyPasswd [post]
func ModifyPasswdHandler(c *gin.Context) {
	var newData modifyRequestData
	var newUserData User.Basic
	err := c.ShouldBindJSON(&newData)
	if err != nil {
		c.JSON(400, "Data binding error")
		return
	}
	if newData.Passwd != newData.Repasswd {
		c.JSON(400, "Password not same")
		return
	}
	newUserData.Email = newData.Email
	newUserData.Password = newData.Passwd

	err = User.ModifyPasswd(Service.DB, &newUserData)
	if err != nil {
		c.JSON(500, err)
		return
	}

	c.JSON(200, "Password updated")
	return

}
