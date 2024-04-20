package Order

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"time"
)

// IsOrderCompleted Check if an order is completed
func IsOrderCompleted(db *gorm.DB, orderID string, status string) (bool, error) {
	var order Models.OrderBasic
	// Firstly, find the order
	if err := db.Preload("Booker").First(&order, "id = ?", orderID).Error; err != nil {
		return false, err // 包含了记录未找到的情况
	}

	// Unmarshal booking time
	var bookingTimes []Models.TimeRange
	if err := json.Unmarshal([]byte(order.BookingTime), &bookingTimes); err != nil {
		return false, err // 解析JSON失败
	}

	// Check if the order is completed
	now := time.Now()
	for _, bt := range bookingTimes {
		startDate, err := time.Parse(time.RFC3339, bt.StartDate)
		if err != nil {
			return false, err // 解析时间失败
		}

		if now.After(startDate.Add(-time.Hour)) && status != "Completed" {
			err := db.Transaction(func(tx *gorm.DB) error {
				// Update order status to completed
				order.Status = "Completed"
				if err := tx.Save(&order).Error; err != nil {
					return err
				}

				// Get owner information
				var owner Models.UserBasic
				ownerID := controller.GetUserIDBySpotID(order.SpotID, db)
				if err := tx.First(&owner, "id = ?", ownerID).Error; err != nil {
					return err
				}

				// update account balance
				order.Booker.Account -= order.Cost
				owner.Earning += order.Cost
				owner.Account += order.Cost
				if err := tx.Save(&order.Booker).Error; err != nil {
					return err
				}
				if err := tx.Save(&owner).Error; err != nil {
					return err
				}

				return nil // tx.Commit() will be called automatically
			})
			if err != nil {
				return false, err
			}
			return true, nil
		}
	}

	if order.Status == "Completed" {
		return true, nil
	}
	return false, nil
}

// CanceledOrderHandler godoc
// @Summary Cancel an order
// @Description Cancel an order, soft delete
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
	orderID := c.Param("orderID") // Get order ID
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
	// Find the order
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
	// Delete the order by soft delete
	if err := Service.DB.Delete(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to cancel order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order canceled successfully"})
}

// RefundOrderHandler Refund an order
// @Summary Refund an order
// @Description Refund an order
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

	// Find the order
	if err := Service.DB.First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	// Update order status to refunded
	order.Status = "Refunded"
	if err := Service.DB.Save(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to refund order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order refunded successfully"})
}
