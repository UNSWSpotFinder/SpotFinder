package Order

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

type CreateRequest struct {
	BookingTime []Models.TimeRange `json:"bookingTime" binding:"required"`
	Cost        float64            `json:"cost" binding:"required"`
	CarID       uint               `json:"carID" binding:"required"`
}

// CreateOrderHandler Create an order
// @Summary Create an order
// @Description Create an order
// @Tags Order
// @Accept json
// @Produce json
// @Param spotID path int true "Spot ID"
// @Param order body CreateRequest true "Order"
// @Success 200 {string} string "Order created successfully"
// @Failure 500 {string} string "unable to create order"
// @Router /spots/{spotID}/orders [post]
// @Security BearerAuth
func CreateOrderHandler(c *gin.Context) {
	// Get user ID from JWT
	userIDStr := c.GetString("userID")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get spot ID from URL
	spotIDStr := c.Param("spotID")
	spotID, err := strconv.ParseUint(spotIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spot ID"})
		return
	}

	// Bind request body to CreateRequest struct
	var request CreateRequest
	if err = c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Transform booking time to JSON
	bookingTimeJSON, err := json.Marshal(request.BookingTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode booking times"})
		return
	}

	// Create order
	var order Models.OrderBasic
	order.BookingTime = string(bookingTimeJSON) // Store booking time as JSON string
	order.BookerID = uint(userID)
	order.SpotID = uint(spotID)
	order.Cost = request.Cost
	order.CarID = request.CarID
	order.Status = "Pending"

	// atomic update order_num
	result := Service.DB.Model(&Models.SpotBasic{}).Where("id = ?", spotID).Update("order_num", gorm.Expr("order_num + ?", 1))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update spot order number"})
		return
	}

	// Save order to database
	if err = Service.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create order"})
		return
	}

	// Return success message
	c.JSON(http.StatusOK, gin.H{"message": "Order created successfully"})
}
