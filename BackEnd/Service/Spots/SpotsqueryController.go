package Spots

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
)

type CreateSpotRequestData struct {
	SpotName      string  `json:"spotName"`
	SpotAddr      string  `json:"spotAddr"`
	PassWay       string  `json:"passWay"`
	SpotType      string  `json:"spotType"`
	Size          string  `json:"size"`
	Charge        string  `json:"charge"`
	Pictures      string  `json:"pictures"`
	MorePictures  string  `json:"morePictures"`
	IsHourRent    bool    `json:"isOurRent"`
	IsDayRent     bool    `json:"isDayRent"`
	IsWeekRent    bool    `json:"isWeekRent"`
	PricePerHour  float64 `json:"pricePerHour"`
	PricePerDay   float64 `json:"pricePerDay"`
	PricePerWeek  float64 `json:"pricePerWeek"`
	AvailableTime string  `json:"availableTime"`
	OrderNum      uint    `json:"orderNum"`
}

// CreateSpotController
// @Summary Create a spot
// @Description create a spot
// @Tags Spots
// @Accept  json
// @Produce  json
// @Param   spot  body CreateSpotRequestData true "spot info"
// @Success 200 {string} json{"message", "Add spot successfully"}
// @Failure 500 {string} json{"error", "unable to add spot"}
// @Router /spot/create [post]
// @Security BearerAuth
func CreateSpotController(c *gin.Context) {
	var spot *Models.SpotBasic
	var request CreateSpotRequestData
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot bind spot",
		})
		return
	}
	// 从请求中获取用户的ID
	userEmail := c.GetString("email")
	user := User.GetUserByEmail(Service.DB, userEmail)
	// 将请求数据转换为模型
	spot = &Models.SpotBasic{
		OwnerID:       user.ID,
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
		OrderNum:      0,
	}
	err := controller.CreateSpot(spot, userEmail, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "失败" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Add spot successfully",
	})

}
