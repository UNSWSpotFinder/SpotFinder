package Order

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"net/http"
)

// PaidOrderHandler 付款成功的订单
// @Summary 付款成功的订单
// @Description 付款成功的订单
// @Tags Order
// @Accept json
// @Produce json
// @Param orderID path int true "Order ID"
// @Success 200 {string} string "Order paid successfully"
// @Failure 404 {string} string "Order not found"
// @Failure 500 {string} string "Unable to update order status"
// @Router /order/{orderID}/paid [put]
func PaidOrderHandler(c *gin.Context) {
	orderID := c.Param("orderID") // 获取订单ID
	var order Models.OrderBasic

	// 查找订单
	if err := Service.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// 更新订单状态为已支付
	order.Status = "Paid"
	if err := Service.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update order status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order paid successfully"})
}

// CanceledOrderHandler godoc
// @Summary 取消订单
// @Description 客户取消订单，执行软删除
// @Tags Order
// @Accept json
// @Produce json
// @Param orderID path int true "Order ID"
// @Success 200 {string} string "Order canceled successfully"
// @Failure 404 {string} string "Order not found"
// @Failure 500 {string} string "Unable to cancel order"
// @Router /order/{orderID}/cancel [put]
// @Security BearerAuth
func CanceledOrderHandler(c *gin.Context) {
	orderID := c.Param("orderID")
	var order Models.OrderBasic

	// 查找订单
	if err := Service.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// 更新订单状态为已取消
	order.Status = "Canceled"
	if err := Service.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to cancel order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order canceled successfully"})
}

// RefundOrderHandler 退款订单
// @Summary 退款订单
// @Description 退款订单
// @Tags Order
// @Accept json
// @Produce json
// @Param orderID path int true "Order ID"
// @Success 200 {string} string "Order refunded successfully"
// @Failure 404 {string} string "Order not found"
// @Failure 500 {string} string "Unable to refund order"
// @Router /order/{orderID}/refund [put]
func RefundOrderHandler(c *gin.Context) {
	orderID := c.Param("orderID")
	var order Models.OrderBasic

	// 查找订单
	if err := Service.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// 更新订单状态为已退款
	order.Status = "Refunded"
	if err := Service.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to refund order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order refunded successfully"})
}
