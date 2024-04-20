package Manager

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
)

type loginRequestData struct {
	AdminID  string `json:"adminID" example:"longsizhuoIsTheBest" binding:"required"`
	Password string `json:"password" example:"123456"`
}

type AdminInfo struct {
	AdminID string `json:"adminID" `
	Name    string `json:"name"`
	Phone   string `json:"phone"`
}

// LoginHandler Manager login handler
// @Summary Manager login handler
// @Description Manager login handler
// @Tags Manager
// @Accept json
// @Produce json
// @Param manager body loginRequestData true "Manager"
// @Success 200 {string} string "Login Success"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /manager/login [post]
func LoginHandler(c *gin.Context) {
	var request loginRequestData
	var manager Models.ManagerBasic
	err := c.ShouldBindJSON(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data binding error"})
		return
	}
	manager.AdminID = request.AdminID
	manager.Password = request.Password
	JWT, err := controller.Login(Service.DB, &manager)
	if err != nil {
		// Return error message
		if err.Error() == "manager not found" || err.Error() == "password mismatch" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid adminID or password" + err.Error()})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error" + err.Error()})
		}
		return
	}
	// If login success, return JWT
	c.JSON(http.StatusOK, gin.H{"token": JWT})
	return
}
