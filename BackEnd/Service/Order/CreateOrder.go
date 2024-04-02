package Order

import (
	"capstone-project-9900h14atiktokk/Models/Order"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type CreateRequest struct {
	BookingTime string  `json:"bookingTime" example:"" binding:"required"`
	OwnerID     uint    `json:"ownerID" example:"2" binding:"required"`
	SpotID      uint    `json:"spotID" example:"3" binding:"required"`
	Cost        float64 `json:"cost" example:"100" binding:"required"`
	CarID       uint    `json:"carID" example:"4" binding:"required"`
}

// CreateOrderHandler 创建订单
// @Summary 创建订单
// @Description 创建订单
// @Tags Order
// @Accept json
// @Produce json
// @Param spotID path string true "Spot ID"
// @Param order body CreateRequest true "Order"
// @Success 200 {string} string "Order created successfully"
// @Failure 500 {string} string "unable to create order"
// @Router /spots/{spotID}/orders [post]
// @Security BearerAuth
func CreateOrderHandler(c *gin.Context) {
	// 从请求中获取用户的ID
	userID := c.GetUint("userID")
	spotIDStr := c.Param("spotID")
	spotID, err := strconv.Atoi(spotIDStr)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "Cannot bind spot",
		})
		return
	}
	var order Order.Basic
	var request CreateRequest
	if err = c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Cannot bind order",
		})
		return
	}
	order.BookingTime = request.BookingTime
	order.UserID = userID
	order.OwnerID = request.OwnerID
	order.SpotID = uint(spotID)
	order.Cost = request.Cost
	order.CarID = request.CarID
	order.Status = "Pending"
	// 将订单存入数据库
	err = controller.CreateOrder(Service.DB, &order)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "unable to create order",
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "Order created successfully",
	})

}
