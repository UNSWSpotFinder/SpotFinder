package Spots

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"strconv"
)

// SpotsQueryController
// @Summary Get the list of spots
// @Description get list of all spots(will do page query later)
// @Tags spots
// @Accept  json
// @Produce  json
// @Success 200 {object} map[string]interface{} "message: list of spots"
// @Failure 500 {object} map[string]interface{} "error: Cannot get spot list"
// @Router /spot/list [get]
func SpotsQueryController(c *gin.Context) {
	Spots, err := GetSpotList(Service.DB)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Cannot get spot list",
		})
		return

	}
	c.JSON(200, gin.H{
		"message": Spots,
	})

	return
}

// DeleteSpotController
// @Summary Delete a spot(soft delete)
// @Description delete a spot by id
// @Tags spots
// @Accept  json
// @Produce  json
// @Param id path int true "Spot ID"
// @Success 200 {string} json{"code", "message"}
// @failure 500 {string} json{"code", "message"}
// @Router /spot/delete/{id} [put]
func DeleteSpotController(c *gin.Context) {
	// 获取参数(可改query参数了）
	id := c.Param("id")
	SpotsId, _ := strconv.Atoi(id)
	err := deleteSpot(SpotsId, Service.DB)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "Cannot delete spot",
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "Delete spot successfully",
	})
	return
}

// CreateSpotController
// @Summary Create a spot
// @Description create a spot
// @Tags spots
// @Accept  json
// @Produce  json
// @Param   spot  body Spot.Basic true "spot info"
// @Success 200 {string} json{"message", "Add spot successfully"}
// @Failure 500 {string} json{"error", "unable to add spot"}
// @Router /spot/create [post]
func CreateSpotController(c *gin.Context) {
	var spot *Spot.Basic
	if err := c.ShouldBindJSON(&spot); err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot bind spot",
		})
		return
	}
	err := AddSpot(spot, Service.DB)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "失败",
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "Add spot successfully",
	})

}

// UpdateSpotController
// @Summary Update a spot
// @Description update a spot
// @Tags spots
// @Accept  json
// @Produce  json
// @Param   spot  body Spot.Basic true "spot info"
// @Success 200 {string} json{"message", "Update spot successfully"}
// @Failure 500 {string} json{"error", "unable to update spot"}
// @Router /spot/update [put]
func UpdateSpotController(c *gin.Context) {
	var spot *Spot.Basic
	if err := c.ShouldBindJSON(&spot); err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot bind spot",
		})
		return
	}
	err := UpdateSpot(spot, Service.DB)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "失败",
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "Update spot successfully",
	})

}
