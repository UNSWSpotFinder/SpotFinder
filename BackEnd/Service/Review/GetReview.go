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

// GetReviewsBySpotID Get all reviews of a spot
// @Summary Get all reviews of a spot
// @Description Get all reviews of a spot
// @Tags Review
// @Accept json
// @Produce json
// @Param spotID path int true "Spot ID"
// @Success 200 {string} string "Reviews fetched successfully"
// @Failure 500 {string} string "Failed to fetch reviews"
// @Router /spots/{spotID}/reviews [get]
func GetReviewsBySpotID(c *gin.Context) {
	// Get the spot ID from the URL
	spotIDStr := c.Param("spotID")
	spotID, err := strconv.ParseUint(spotIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spot ID"})
		return
	}

	var reviews []Models.Review
	fmt.Println("spotID:", spotID)
	// Query the database for all reviews of this spot
	if err := Service.DB.Preload("Rater").Preload("Order").Where("spot_id = ?", spotID).Find(&reviews).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"reviews": reviews})
}

// GetReviewByIDHandler Get a review by its ID
// @Summary Get a review by its ID
// @Description Get a review by its ID
// @Tags Review
// @Accept json
// @Produce json
// @Param reviewID path int true "Review ID"
// @Success 200 {string} string "Review fetched successfully"
// @Failure 404 {string} string "Review not found"
// @Failure 500 {string} string "Failed to fetch review"
// @Router /reviews/{reviewID} [get]
func GetReviewByIDHandler(c *gin.Context) {
	// Get the review ID from the URL
	reviewIDStr := c.Param("reviewID")
	reviewID, err := strconv.ParseUint(reviewIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid review ID"})
		return
	}

	var review Models.Review
	// Query the database for the review
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
