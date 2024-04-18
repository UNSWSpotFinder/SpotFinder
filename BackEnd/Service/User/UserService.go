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
	_ "gorm.io/gorm"
	"net/http"
	"time"
)

// RequestData Request data struct for sending email code
type RequestData struct {
	Email string `json:"to" example:"longsizhuo@gmail.com" format:"emailconfigs" binding:"required"`
}

// InfoDetail Detailed user information
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

// GetUserList Get user list
// @Summary Get user list
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

// CreateUserRequest Save user request
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

// CreateUser Create user
// @Summary Create user
// @Schemes
// @Tags User
// @Consumes application/x-www-form-urlencoded
// @Description do ping
// @Param user body CreateUserRequest true "User Info"
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

	// Check DD/MM/YYYY
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

	// Crypt password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to hash password",
		})
		return
	}
	user.Password = string(hashedPassword)

	// Check if email is already registered
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

// SendCodeHandler Process the request to send email
//
//	@Summary		Send code
//	@Description	Send code and store it in Redis
//	@Tags			User
//	@Accept			json
//	@Produce		json
//	@Param			emailconfigs body RequestData	true	"Recipient email configs address"
//	@Success		200		{object}	RequestData	"OK"
//	@Failure		400		{object}	nil			"Bad Request"
//	@Failure		500		{object}	nil			"Internal Server Error"
//	@Router			/user/create/sendEmail [post]
func SendCodeHandler(c *gin.Context, redisCli *redis.Client) {
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

	err = SendEmail(requestData.Email, code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "我怀疑你断网了"})
		return
	}

}

// GetUserInfoHandler Get user information
//
// @Summary Get user information
// @Description Get user information. If the email query parameter is not provided, the current user's information is returned. If the email query parameter is provided, only administrators can query other users' information.
// @Tags User
// @Accept json
// @Produce json
// @Param email query string false "Email of the user to query"
// @Success 200 {object} InfoDetail "Successfully get user information"
// @Success 200 {object} Manager.AdminInfo "Successfully get admin information"
// @Failure 400 {object} nil "Failed to get user information"
// @Failure 401 {object} nil "Unauthorized"
// @Failure 500 {object} nil "Failed to get admin information"
// @Router /user/info [get]
// @Security BearerAuth
func GetUserInfoHandler(c *gin.Context) {
	// Get email and role from JWT
	emailFromToken, exists := c.Get("email")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	role, roleExists := c.Get("role")

	// Query the user information
	targetEmail := emailFromToken.(string)

	// Get the email query parameter
	queryEmail := c.Query("email")
	// AdminID 在这里也是email的key
	if queryEmail != "" {
		// Authorization check
		if roleExists && role == "admin" {
			targetEmail = queryEmail
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Forbidden: only admins can query other user's information"})
			return
		}
	}
	if queryEmail == "" && role == "admin" {
		// Query admin information
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
		// Use email to query user information
		user := User.GetUserByEmail(Service.DB, targetEmail)

		// Return user information
		c.JSON(http.StatusOK, gin.H{"message": user})
	}
}

// TopUpHandler Top up
//
// @Summary Top up
// @Description Top up
// @Tags User
// @Accept json
// @Produce json
// @Param user body TopUpRequest true "Top up amount"
// @Success 200 {string} string "User information updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/topUp [post]
// @Security BearerAuth
func TopUpHandler(c *gin.Context) {
	// Get email from JWT
	userID := c.GetString("userID")

	var req TopUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update user information
	err := controller.TopUp(Service.DB, userID, req.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "User information updated")
}

// WithdrawHandler Withdraw
//
// @Summary Withdraw
// @Description Withdraw
// @Tags User
// @Accept json
// @Produce json
// @Param user body TopUpRequest true "Withdraw amount"
// @Success 200 {string} string "User information updated"
// @Error 400 {string} string "Data binding error"
// @Error 500 {string} string "SQL error message"
// @Router /user/withdraw [post]
// @Security BearerAuth
func WithdrawHandler(c *gin.Context) {
	// Get email from JWT
	userID := c.GetString("userID")

	var req TopUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.Amount > 0 {
		req.Amount = -req.Amount
	}

	// Update user information
	err := controller.Withdraw(Service.DB, userID, req.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
		return
	}

	c.JSON(http.StatusOK, "User information updated")
}

// GetSimpleUserInfoHandler Get user simple information
//
// @Summary Get user simple information
// @Description Get user simple information
// @Tags User
// @Accept json
// @Produce json
// @Param id path string true "user ID"
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
