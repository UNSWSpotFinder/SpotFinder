package Order

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"errors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

// IsOrderCompleted 检查订单状态，如果未完成则更新订单状态为已支付
func IsOrderCompleted(orderID string, status string) (bool, error) {
	var order Models.OrderBasic

	// 查找订单的状态
	if err := Service.DB.First(&order, "id = ?", orderID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, err
		}
		return false, err
	}
	// 检查系统当前时间是否晚于订单的预订时间
	//if time.Now().After(order.BookingTime[0].EndDate) {
	//	// 更新订单状态为已支付
	//	order.Status = "Completed"
	//	if err := Service.DB.Save(&order).Error; err != nil {
	//		return false, err
	//	}
	//}
	if status == "Refunded" && order.Status == "Completed" {
		return false, errors.New("order has been Completed")
	} else if status == "Cancelled" && order.Status == "Completed" {
		return false, errors.New("order has been Completed")
	} else if order.Status != "Completed" {
		return true, nil
	}
	return false, errors.New("unknown error")
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
	orderID := c.Param("orderID") // 从 URL 路径中获取订单 ID
	var order Models.OrderBasic

	isCompleted, err := IsOrderCompleted(orderID, "Cancelled")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err})
		return
	}
	if !isCompleted {

	}
	// 查找订单
	if err := Service.DB.First(&order, "id = ?", orderID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// 执行软删除以取消订单
	if err := Service.DB.Delete(&order).Error; err != nil {
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
// @Security BearerAuth
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
