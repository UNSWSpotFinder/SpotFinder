package Manager

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// ApproveSpotHandler Approve a spot
// @Summary Approve a spot
// @Description URL parameter is used to approve a spot, only one at a time
// @Tags Manager
// @Accept json
// @Produce json
// @Param spotId path string true "Spot ID"
// @Success 200 {string} string "Spot approved"
// @Failure 500 {string} string "Cannot approve spot"
// @Router /manager/approve/{spotId} [post]
// @Security BearerAuth
func ApproveSpotHandler(c *gin.Context) {
	var spotId = c.Param("spotId")
	userRole := c.GetString("role")
	if userRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized to approve this spot"})
		return
	}
	err := controller.ApproveSpotOrNot(spotId, Service.DB, true)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot approve spot",
		})
		return
	}
}

// BlockSpotHandler Ban a spot
// @Summary Ban a spot
// @Description URL parameter is used to ban a spot, only one at a time
// @Tags Manager
// @Accept json
// @Produce json
// @Param spotId path string true "Spot ID"
// @Success 200 {string} string "Spot approved"
// @Failure 500 {string} string "Cannot approve spot"
// @Router /manager/block/{spotId} [put]
// @Security BearerAuth
func BlockSpotHandler(c *gin.Context) {
	spotIDStr := c.Param("spotId")
	userRole := c.GetString("role")
	if userRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized to approve this spot"})
		return
	}
	err := controller.BlockSpot(spotIDStr, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot approve spot",
		})
		return
	}
}

// UnblockSpotHandler Unblock a spot
// @Summary Unblock a spot
// @Description URL parameter is used to unblock a spot, only one at a time
// @Tags Manager
// @Accept json
// @Produce json
// @Param spotId path string true "Spot ID"
// @Success 200 {string} string "Spot approved"
// @Failure 500 {string} string "Cannot approve spot"
// @Router /manager/unblock/{spotId} [put]
// @Security BearerAuth
func UnblockSpotHandler(c *gin.Context) {
	spotIDStr := c.Param("spotId")
	userRole := c.GetString("role")
	if userRole != "admin" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized to approve this spot"})
		return
	}
	err := controller.UnBlockSpot(spotIDStr, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot approve spot",
		})
		return
	}
}

// InvisibleSpotHandler Invisible a spot
// @Summary Invisible a spot
// @Description URL parameter is used to invisible a spot, only one at a time
// @Tags Manager
// @Accept json
// @Produce json
// @Param spotId path string true "Spot ID"
// @Success 200 {string} string "Spot approved"
// @Failure 500 {string} string "Cannot approve spot"
// @Router /manager/invisible/{spotId} [put]
// @Security BearerAuth
func InvisibleSpotHandler(c *gin.Context) {
	spotIDStr := c.Param("spotId")
	spotIDUint64, err := strconv.ParseUint(spotIDStr, 10, 64)
	spotID := uint(spotIDUint64)
	userRole := c.GetString("role")
	ownerID := controller.GetUserIDBySpotID(spotID, Service.DB)
	ownerIDString := strconv.Itoa(int(ownerID))
	if userRole != "admin" && ownerIDString != c.GetString("userID") {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized to approve this spot"})
		return
	}
	err = controller.ApproveSpotOrNot(spotIDStr, Service.DB, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot approve spot" + err.Error(),
		})
		return
	}
}
