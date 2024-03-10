package Spots

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"strconv"
	"time"
)

// SpotsQueryController
// @Summary Get the list of spots
// @Description get list of all spots(PageQuery)
// @Tags spots
// @Accept  json
// @Produce  json
// @Success 200 {object} map[string]interface{} "message: list of spots"
// @Failure 500 {object} map[string]interface{} "error: Cannot get spot list"
// @Router /spot/list/{page}/{pageSize} [get]
func SpotsQueryController(c *gin.Context) {

	pageInt, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSizeInt, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	Spots, err := GetSpotList(Service.DB, pageInt, pageSizeInt)

	if pageInt < 1 {
		pageInt = 1
	}
	if pageSizeInt <= 0 {
		pageSizeInt = 10 // 先默认10个
	} else if pageSizeInt > 100 {
		pageSizeInt = 100 // 最大100个
	}

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

type CreateSpotSimple struct {
	OwnerId       uint64     `json:"ownerId" binding:"required"` // 使用uint64匹配原始JSON中的bigint，并修改字段名以匹配JSON键
	SpotName      string     `json:"spotName" binding:"required"`
	SpotAddr      string     `json:"spotAddr" binding:"required"`
	SpotType      string     `json:"spotType" binding:"required"`
	IsOccupied    bool       `json:"isOccupy" binding:"required"`  // 将字段名更改为驼峰式并匹配JSON键
	IsVisible     bool       `json:"isVisible" binding:"required"` // 同上
	Rate          float64    `json:"rate" binding:"omitempty"`     // 保留float64类型，omitempty表明非必需字段
	Size          string     `json:"size" binding:"required"`
	Pictures      []string   `json:"pictures" binding:"omitempty"` // 照片应为字符串切片，omitempty表明非必需字段
	PricePerDay   float64    `json:"pricePerDay" binding:"omitempty"`
	PricePerWeek  float64    `json:"pricePerWeek" binding:"omitempty"`
	PricePerMonth float64    `json:"pricePerMonth" binding:"omitempty"`
	DeletedAt     *time.Time `json:"deletedAt,omitempty"`
}

// CreateSpotController
// @Summary Create a spot
// @Description create a spot
// @Tags spots
// @Accept  json
// @Produce  json
// @Param   spot  body CreateSpotSimple true "spot info"
// @Success 200 {string} json{"message", "Add spot successfully"}
// @Failure 500 {string} json{"error", "unable to add spot"}
// @Router /spot/create/{UserID} [post]
func CreateSpotController(c *gin.Context) {
	var spot *Spot.Basic

	var user *User.Basic

	// 从请求中获取用户的ID
	userID := c.Param("ownerId")
	userIDInt, _ := strconv.Atoi(userID)

	// 从数据库中获取用户
	if err := c.ShouldBindJSON(&spot); err != nil {
		c.JSON(400, gin.H{
			"error": "Cannot bind spot",
		})
		return
	}
	err := CreateSpot(spot, user, userIDInt, Service.DB)
	if err != nil {
		c.JSON(500, gin.H{
			"error": "失败{}",
		})
		return
	}
	c.JSON(200, gin.H{
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
	spots, err := showAllOwnedSpot(user, userID, Service.DB)
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

	spots, err := ChoseSizeWithMyCar(user, plateNumber, Service.DB)

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

	err := UpdateSpotPrice(spot, user, spotID, float32(perDayInt), float32(perNightInt), float32(perMonthInt), Service.DB)
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
