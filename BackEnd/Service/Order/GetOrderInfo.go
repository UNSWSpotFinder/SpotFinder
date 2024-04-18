package Order

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

// GetOrderInfoHandler Get order information
// @Summary Get order information
// @Description Get order information
// @Tags Order
// @Accept json
// @Produce json
// @Param orderID path int true "Order ID"
// @Success 200 {string} string "Order info"
// @Failure 404 {string} string "Order not found"
// @Failure 500 {string} string "Unable to get order info"
// @Router /order/{orderID} [get]
// @Security BearerAuth
func GetOrderInfoHandler(c *gin.Context) {
	orderID := c.Param("orderID")
	var order Models.OrderBasic
	status, err := IsOrderCompleted(Service.DB, orderID, "Cancelled")
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err})
		return
	}
	if status {
		c.JSON(http.StatusOK, gin.H{"error": "order is already completed"})
		return
	}

	// Find the order
	if err := Service.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"order": order})

}

// GetUserAllOrdersHandler Get all orders of a user
// @Summary Get user all orders
// @Description Get all orders of a user
// @Tags Order
// @Accept json
// @Produce json
// @Success 200 {string} string "Orders"
// @Failure 404 {string} string "Order not found"
// @Failure 500 {string} string "Unable to get orders"
// @Router /user/orders/asUser [get]
// @Security BearerAuth
func GetUserAllOrdersHandler(c *gin.Context) {
	userID := c.GetString("userID")
	var orders []Models.OrderBasic

	// find all orders of the user
	if err := Service.DB.Where("booker_id = ?", userID).Find(&orders).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusOK, gin.H{"orders": orders})
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"orders": orders})

}

// GetOwnerAllOrdersHandler godoc
// @Summary Find all orders of a owner
// @Description Find all orders of a owner
// @Tags Order
// @Accept json
// @Produce json
// @Success 200 {string} string "Orders"
// @Failure 404 {string} string "No orders found for the owner"
// @Failure 500 {string} string "Database error"
// @Router /user/orders/asOwner [get]
// @Security BearerAuth
func GetOwnerAllOrdersHandler(c *gin.Context) {
	ownerID := c.GetString("userID") // Get owner ID from JWT
	var orders []Models.OrderBasic

	// query all orders of the owner
	if err := Service.DB.Joins("JOIN spot ON spot.id = order.spot_id").
		Where("spot.owner_id = ?", ownerID).
		Find(&orders).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No orders found for the owner"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Return orders
	c.JSON(http.StatusOK, gin.H{"orders": orders})
}
