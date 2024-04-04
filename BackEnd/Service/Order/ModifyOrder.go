package Order

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"time"
)

// IsOrderCompleted 检查订单状态，如果未完成则更新订单状态为已支付
func IsOrderCompleted(db *gorm.DB, orderID string, status string) (bool, error) {
	var order Models.OrderBasic

	// 查找订单的状态
	if err := Service.DB.First(&order, "id = ?", orderID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, err
		}
		return false, err
	}
	var bookingTimes []Models.TimeRange
	err := json.Unmarshal([]byte(order.BookingTime), &bookingTimes)
	if err != nil {
		return false, err // 解析JSON失败
	}

	// 检查预订时间是否满足条件
	for _, bt := range bookingTimes {
		startDate, err := time.Parse(time.RFC3339, bt.StartDate)
		if err != nil {
			return false, err // 解析时间失败
		}

		// 如果当前时间晚于结束时间减去一小时，则将订单标记为完成
		if time.Now().After(startDate.Add(-time.Hour)) {
			if status == "Completed" {
				// 如果已经完成，返回错误
				return true, nil
			}

			// 更新订单状态为已完成
			order.Status = "Completed"
			if err := db.Save(&order).Error; err != nil {
				return false, err // 保存订单状态失败
			}
			break // 更新了一个订单就可以跳出循环了
		}
	}
	if order.Status == "Completed" {
		return true, nil
	}
	return false, nil
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

	isCompleted, err := IsOrderCompleted(Service.DB, orderID, "Cancelled")
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadGateway, gin.H{"error": err})
		return
	}
	if isCompleted {
		c.JSON(http.StatusOK, gin.H{"error": "order is already completed"})
		return
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
	order.Status = "Cancelled"
	Service.DB.Save(&order)
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

	isCompleted, err := IsOrderCompleted(Service.DB, orderID, "Cancelled")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err})
		return
	}
	if isCompleted {
		c.JSON(http.StatusOK, gin.H{"error": "order is already completed"})
		return
	}

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
