package Spots

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// ModifySpotInfoHandler Modify spot information
// @Summary Modify spot information
// @Description Modify spot information
// @Tags Spots
// @Accept json
// @Produce json
// @Param spotId path string true "Spot ID"
// @Param spot body CreateSpotRequestData true "Spot information"
// @Success 200 {string} string "Spot information updated"
// @Failure 400 {string} string "Data binding error"
// @Failure 500 {string} string "SQL error message"
// @Router /spot/modifySpotInfo/{spotId} [post]
// @Security BearerAuth
func ModifySpotInfoHandler(c *gin.Context) {
	userID := c.GetString("userID")

	role, roleExists := c.Get("role")
	if !roleExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	spotIDStr := c.Param("spotId")
	spotIDUint64, err := strconv.ParseUint(spotIDStr, 10, 64)
	spotID := uint(spotIDUint64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spot ID"})
		return
	}
	ownerID := controller.GetUserIDBySpotID(spotID, Service.DB)
	ownerIDString := strconv.Itoa(int(ownerID))
	if role != "admin" && userID != ownerIDString {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized to modify this spot"})
		return
	}
	var request CreateSpotRequestData
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return

	}
	spot := Models.SpotBasic{
		ID:            spotID,
		SpotName:      request.SpotName,
		SpotAddr:      request.SpotAddr,
		PassWay:       request.PassWay,
		SpotType:      request.SpotType,
		Size:          request.Size,
		Charge:        request.Charge,
		Pictures:      request.Pictures,
		MorePictures:  request.MorePictures,
		IsHourRent:    request.IsHourRent,
		IsDayRent:     request.IsDayRent,
		IsWeekRent:    request.IsWeekRent,
		PricePerHour:  request.PricePerHour,
		PricePerDay:   request.PricePerDay,
		PricePerWeek:  request.PricePerWeek,
		AvailableTime: request.AvailableTime,
		OrderNum:      request.OrderNum,
	}

	err = controller.ModifySpotDetails(&spot, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, "Spot information updated")

}
