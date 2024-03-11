package Spots

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

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
	err := controller.DeleteSpot(SpotsId, Service.DB)
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

type createSpotRequestData struct {
	SpotName      string  `json:"spotName"`
	SpotAddr      string  `json:"spotAddr"`
	PassWay       string  `json:"passWay"`
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
// @Param   spot  body createSpotRequestData true "spot info"
// @Success 200 {string} json{"message", "Add spot successfully"}
// @Failure 500 {string} json{"error", "unable to add spot"}
// @Router /spot/create [post]
// @Security BearerAuth
func CreateSpotController(c *gin.Context) {
	var spot *Spot.Basic
	var request createSpotRequestData
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot bind spot",
		})
		return
	}
	// 从请求中获取用户的ID
	userEmail := c.GetString("email")
	user, err := User.GetUserByEmail(Service.DB, userEmail)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "失败",
		})
		return
	}
	// 将请求数据转换为模型
	spot = &Spot.Basic{
		OwnerID:       user.ID,
		SpotName:      request.SpotName,
		SpotAddr:      request.SpotAddr,
		PassWay:       request.PassWay,
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
	err = controller.CreateSpot(spot, userEmail, Service.DB)
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

// ShowAllOwnedSpotHandler
// @Summary Show all owned spots
// @Description show all owned spots by User
// @Tags spots
// @Accept  json
// @Produce  json
// @Param ownerId path int true "Owner ID"
// @Success 200 {string} json{"spots", "list of spots"}
// @Failure 500 {string} json{"error", "unable to get spot list"}
// @Router /spot/ownedList/{ownerId} [get]
func ShowAllOwnedSpotHandler(c *gin.Context) { //根据用户id获取车位列表
	// 获取参数
	// 调用showAllOwnedSpot

	userID := c.Param("ownerId")

	var user *User.Basic
	spots, err := controller.ShowAllOwnedSpot(user, userID, Service.DB)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "失败",
		})
		return

	}
	c.JSON(200, gin.H{
		"spots": spots,
	})
	return

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
	err := controller.UpdateSpot(spot, Service.DB)
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

// ChoseSizeWithMyCarHandler
// @Summary Chose size with user's car plate number,param is plate number
// @Description chose size with my car, 默认用的是longsizhuo数据库的第18号用户的ID做测试
// @Tags spots
// @Accept  json
// @Produce  json
// @Param   plateNumber path string true "Plate Number"
// @Success 200 {string} json{"spots", "list of spots"}
// @Failure 500 {string} json{"error", "unable to get spot list"}
// @Router /spot/ownedCar/choseSize/{plateNumber} [get]
func ChoseSizeWithMyCarHandler(c *gin.Context) { //根据用户自己设置的车位大小，展示符合的车位信息
	// 获取query参数
	// 调用ChoseSizeWithMyCar

	var user *User.Basic

	//根据车牌号来查询车位大小
	plateNumber := c.Param("plateNumber")

	spots, err := controller.ChoseSizeWithMyCar(user, plateNumber, Service.DB)

	if err != nil {
		c.JSON(500, gin.H{
			"error": "失败",
		})
		return

	}
	c.JSON(200, gin.H{
		"spots": spots,
	})

	return

}

// UpdateSpotPriceHandler
// @Summary Update a spot's price
// @Description update a spot's price, got four query parameters by order: spotID, perDay, perNight, perMonth 。默认用的是longsizhuo数据库的第18号用户的ID做测试
// @Tags spots
// @Accept  json
// @Produce  json
// @Param   spotID query string true "Spot ID"
// @Param   perDay query string true "Price per day"
// @Param   perNight query string true "Price per night"
// @Param   perMonth query string true "Price per month"
// @Success 200 {string} json{"message", "Update spot price successfully"}
// @Failure 500 {string} json{"error", "unable to update spot price"}
// @Router /spot/update/spotPrice [put]
func UpdateSpotPriceHandler(c *gin.Context) {
	//用户自己设置每天每周每月价格
	// 获取参数
	//Setp1: 先确认用户是否拥有这个车位
	var user *User.Basic

	var spot *Spot.Basic

	spotID := c.Query("spotID")
	perDay := c.Query("perDay")
	perNight := c.Query("perNight")
	perMonth := c.Query("perMonth")

	perMonthInt, _ := strconv.Atoi(perMonth)
	perDayInt, _ := strconv.Atoi(perDay)
	perNightInt, _ := strconv.Atoi(perNight)

	err := controller.UpdateSpotPrice(
		spot, user, spotID,
		float32(perDayInt),
		float32(perNightInt),
		float32(perMonthInt),
		Service.DB)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "失败",
		})
		return
	}
	c.JSON(200, gin.H{
		"message": "成功",
	})

	return

	//Setp2: 更新价格

}
