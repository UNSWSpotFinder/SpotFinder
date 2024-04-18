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
	// Email cannot be modified
	Email     string `json:"email" example:"longsizhuo@gmail.com"`
	Name      string `json:"name" example:"longsizhuo"`
	Phone     string `json:"phone" example:"123456"`
	DateBirth string `json:"dateBirth" example:"25/02/1999"`
	Avatar    string `json:"avata" example:"avata"`
	Address   string `json:"address" example:"address"`
}

// ModifyPasswdHandler Modify password
// @Summary Modify password
// @Description Modify password
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

	// Check if the password and repassword are the same
	if request.Password != request.Repasswd {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password not same"})
		return
	}

	// Generate hashed password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}

	// Update password
	newUserData := Models.UserBasic{Email: request.Email, Password: string(hashedPassword)}
	err = User.ModifyPasswd(Service.DB, &newUserData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated"})
}

// ModifyUserInfoHandler Modify user information
// @Summary Modify user information
// @Description modify user information
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
	// Get user email and role from JWT
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

	// If the user is not an admin, they can only modify their own information
	if role != "admin" && emailFromToken != request.Email {
		c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden to change other user's information"})
		return

	}
	// Update user information
	err = User.ModifyUserInfo(Service.DB, &user)
	if err != nil {
		c.JSON(500, err)
		return
	}
	c.JSON(200, "User information updated")
	return
}
