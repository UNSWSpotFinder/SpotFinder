package Spots

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// GetSpotListHandler 获取车位列表
// @Summary 获取车位列表
// @Description 获取车位列表
// @Tags Spots
// @Accept json
// @Produce json
// @Param isVisible query bool false "is it isVisible"
// @Success 200 {string} string "Spot list"
// @Failure 500 {string} string "Cannot get spot list"
// @Router /spot/list [get]
func GetSpotListHandler(c *gin.Context) {
	var isVisibleParam = c.Query("isVisible")
	isVisible, err := strconv.ParseBool(isVisibleParam)
	if err != nil {
		isVisible = false
	}
	spots, err := controller.GetSpotList(Service.DB, isVisible)
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

// GetSpotDetailsHandler 获取车位详情
// @Summary 获取车位详情
// @Description 获取车位详情
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
