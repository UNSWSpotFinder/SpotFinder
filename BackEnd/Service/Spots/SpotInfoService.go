package Spots

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// GetSpotListHandler Get spot list
// @Summary Get spot list
// @Description Get spot list
// @Tags Spots
// @Accept json
// @Produce json
// @Param isVisible query bool false "Is the spot visible" default(false)
// @Param page query int false "Page number for pagination" default(1)
// @Param pageSize query int false "Number of spots per page for pagination" default(15)
// @Success 200 {object} string "An example of a successful response"
// @Failure 500 {string} string "Cannot get spot list"
// @Router /spot/list [get]
func GetSpotListHandler(c *gin.Context) {
	pageParam := c.DefaultQuery("page", "1")
	page, err := strconv.Atoi(pageParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'page' parameter"})
		return
	}
	// Get the page size
	pageSizeParam := c.DefaultQuery("pageSize", "15") // If no pageSize is provided, default to 15
	pageSize, err := strconv.Atoi(pageSizeParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid 'pageSize' parameter"})
		return
	}

	var isVisibleParam = c.Query("isVisible")
	isVisible, err := strconv.ParseBool(isVisibleParam)
	if err != nil {
		isVisible = false
	}
	spots, err := controller.GetSpotList(Service.DB, isVisible, page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot get spot list",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": spots,
	})
}

// GetSpotDetailsHandler Get spot details
// @Summary Get spot details
// @Description Get spot details
// @Tags Spots
// @Accept json
// @Produce json
// @Param spotId path string true "Spot ID"
// @Success 200 {string} string "Spot details"
// @Failure 500 {string} string "Cannot get spot details"
// @Router /spot/{spotId} [get]
func GetSpotDetailsHandler(c *gin.Context) {
	spotID := c.Param("spotId")
	spot, err := controller.GetSpotDetails(spotID, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot get spot details",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": spot,
	})
}
