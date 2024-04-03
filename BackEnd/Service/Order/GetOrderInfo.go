package Order

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

// GetOrderInfoHandler 获取订单信息
// @Summary 获取订单信息
// @Description 获取订单信息
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

	// 查找订单
	if err := Service.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"order": order})

}

// GetUserAllOrdersHandler 获取用户所有订单
// @Summary 获取用户所有订单
// @Description 获取用户所有订单
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

	// 查找订单
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
// @Summary 获取车位主所有订单
// @Description 获取指定车位主的所有订单
// @Tags Order
// @Accept json
// @Produce json
// @Success 200 {string} string "Orders"
// @Failure 404 {string} string "No orders found for the owner"
// @Failure 500 {string} string "Database error"
// @Router /user/orders/asOwner [get]
// @Security BearerAuth
func GetOwnerAllOrdersHandler(c *gin.Context) {
	ownerID := c.GetString("ownerID") // 从 URL 路径中获取车位主的 Owner ID
	var orders []Models.OrderBasic

	// 查询所有该车位主的订单
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

	// 返回所有找到的订单
	c.JSON(http.StatusOK, gin.H{"orders": orders})
}
