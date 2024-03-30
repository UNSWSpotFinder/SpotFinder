package Manager

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
)

// ApproveSpotHandler 审核车位
// @Summary 审核车位
// @Description 审核车位
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
	err := controller.ApproveSpot(spotId, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot approve spot",
		})
		return
	}
}
