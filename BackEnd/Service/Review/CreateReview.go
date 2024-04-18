package Review

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// reviewRequest The request body for creating a review
type reviewRequest struct {
	Rating  uint   `json:"rating" binding:"required"`
	Content string `json:"content" binding:"required"`
}

// CreateReviewHandler Create a review
// @Summary Create a review
// @Description Create a review
// @Tags Review
// @Accept json
// @Produce json
// @Param orderID path int true "Order ID"
// @Param review body reviewRequest true "Review"
// @Success 200 {string} string "Review created successfully"
// @Failure 400 {string} string "Invalid request body"
// @Failure 400 {string} string "Invalid user ID"
// @Failure 400 {string} string "Invalid order ID"
// @Failure 400 {string} string "Order not found"
// @Failure 500 {string} string "Failed to create review"
// @Router /order/{orderID}/reviews [post]
// @Security BearerAuth
func CreateReviewHandler(c *gin.Context) {
	var req reviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the user ID from the request
	userIDStr := c.GetString("userID")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get the order ID from the request
	orderIDStr := c.Param("orderID")
	orderID, err := strconv.ParseUint(orderIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	// Get the order from the database
	var order Models.OrderBasic
	if err := Service.DB.Preload("Spot").First(&order, orderID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Order not found"})
		return
	}

	// Create a review instance
	review := Models.Review{
		RaterID: uint(userID),
		SpotID:  order.SpotID,
		OrderID: uint(orderID),
		Rating:  req.Rating,
		Comment: req.Content,
	}

	spot := order.Spot // Preload the spot

	var totalReviews int64

	// review count
	if err := Service.DB.Model(&Models.Review{}).Where("spot_id = ?", order.SpotID).Count(&totalReviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to count reviews"})
		return
	}
	newRate := (spot.Rate*float64(spot.OrderNum) + float64(req.Rating)) / float64(spot.OrderNum+1)
	if err := Service.DB.Model(&spot).Update("rate", newRate).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update spot rating"})
		return
	}
	// Save the review to the database
	if err := Service.DB.Create(&review).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success"})
}
