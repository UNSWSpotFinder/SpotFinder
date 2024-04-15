package Review

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
	"strconv"
)

// GetReviewsBySpotID 获取车位ID对应的评论
// @Summary 获取车位ID对应的评论
// @Description 获取车位ID对应的评论
// @Tags Review
// @Accept json
// @Produce json
// @Param spotID path int true "Spot ID"
// @Success 200 {string} string "Reviews fetched successfully"
// @Failure 500 {string} string "Failed to fetch reviews"
// @Router /spots/{spotID}/reviews [get]
func GetReviewsBySpotID(c *gin.Context) {
	// 从URL路径中获取车位ID
	spotIDStr := c.Param("spotID")
	spotID, err := strconv.ParseUint(spotIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spot ID"})
		return
	}

	var reviews []Models.Review
	fmt.Println("spotID:", spotID)
	// 查询数据库中所有与该车位ID关联的评论
	if err := Service.DB.Preload("Rater").Preload("Order").Where("spot_id = ?", spotID).Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reviews": reviews})
}

// GetReviewByIDHandler 获取单个评论的详情
// @Summary 获取单个评论的详情
// @Description 获取单个评论的详情
// @Tags Review
// @Accept json
// @Produce json
// @Param reviewID path int true "Review ID"
// @Success 200 {string} string "Review fetched successfully"
// @Failure 404 {string} string "Review not found"
// @Failure 500 {string} string "Failed to fetch review"
// @Router /reviews/{reviewID} [get]
func GetReviewByIDHandler(c *gin.Context) {
	// 从URL路径中获取评论ID
	reviewIDStr := c.Param("reviewID")
	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var review Models.Review
	// 查询数据库中的这个评论详情
	if err := Service.DB.Preload("Rater").Preload("Order").
		First(&review, reviewID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Review not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"review": review})
}
