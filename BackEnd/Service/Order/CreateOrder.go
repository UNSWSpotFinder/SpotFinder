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

// CreateOrderHandler 创建订单
// @Summary 创建订单
// @Description 创建订单
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
	// 从请求中获取用户的 ID
	userIDStr := c.GetString("userID")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// 从请求中获取 spot ID
	spotIDStr := c.Param("spotID")
	spotID, err := strconv.ParseUint(spotIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spot ID"})
		return
	}

	// 绑定请求体到 CreateRequest 结构体
	var request CreateRequest
	if err = c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// 将 TimeRange 切片转换为 JSON 字符串以存储
	bookingTimeJSON, err := json.Marshal(request.BookingTime)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encode booking times"})
		return
	}

	// 创建订单实例
	var order Models.OrderBasic
	order.BookingTime = string(bookingTimeJSON) // 以文本形式存储 JSON 字符串
	order.BookerID = uint(userID)
	order.SpotID = uint(spotID)
	order.Cost = request.Cost
	order.CarID = request.CarID
	order.Status = "Pending"

	// 原子更新order_num
	result := Service.DB.Model(&Models.SpotBasic{}).Where("id = ?", spotID).Update("order_num", gorm.Expr("order_num + ?", 1))
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update spot order number"})
		return
	}

	// 将订单存入数据库
	if err = Service.DB.Create(&order).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create order"})
		return
	}

	// 返回成功响应
	c.JSON(http.StatusOK, gin.H{"message": "Order created successfully"})
}
