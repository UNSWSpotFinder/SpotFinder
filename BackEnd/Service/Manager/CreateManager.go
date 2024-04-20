package Manager

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"net/http"
)

type createManagerRequestData struct {
	Name       string `json:"name" example:"longsizhuo" binding:"required"`
	AdminID    string `json:"adminID" example:"123456" binding:"required"`
	Password   string `json:"password" example:"123456"`
	RePassword string `json:"repassword" example:"123456"`
	Phone      string `json:"phone" example:"123456"`
}

// CreateManagerHandler Create Manager Handler
// @Summary Create Manager Handler
// @Description Create Manager Handler
// @Tags Manager
// @Accept json
// @Produce json
// @Param manager body createManagerRequestData true "Manager"
// @Success 200 {string} string "Manager created"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /manager/create [post]
func CreateManagerHandler(c *gin.Context) {
	var request createManagerRequestData
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Cannot bind JSON: " + err.Error(),
		})
		return
	}
	if request.Password != request.RePassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Password not equal",
		})
		return
	}
	var admin Models.ManagerBasic
	admin.Name = request.Name
	admin.AdminID = request.AdminID

	// Crypt the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}
	admin.Password = string(hashedPassword)
	admin.Phone = request.Phone
	admin.AdminID = request.AdminID

	// Check if the admin already exists
	isRegistry, err := controller.CheckAdminAlreadyIn(Service.DB, &admin)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "SQL error message",
		})
		return
	}
	if isRegistry {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Admin already exists",
		})
		return
	}

	// create the manager
	err = controller.CreateManager(&admin, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Manager created",
	})
}
