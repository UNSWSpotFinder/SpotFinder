package User

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Service"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"net/http"
)

type AddCreationRequest struct {
	Picture string `json:"picture" example:"picture"`
	Brand   string `json:"brand" example:"brand"`
	Plate   string `json:"plate" example:"plate"`
	Type    string `json:"type" example:"type"`
	Size    string `json:"size" example:"size"`
	Charge  string `json:"charge" example:"charge"`
}

// AddCarHandler 创建车辆
// @Summary 创建车辆
// @Schemes
// @Description do ping
// @Tags Cars
// @Accept json
// @Param carInfo body AddCreationRequest true "车辆信息"
// @Produce json
// @Success 200 {string} json{"code", "message"}
// @Fail 400 {string} json{"code", "message"}
// @Fail 500 {string} json{"code", "message"}
// @Router /car/create [post]
// @Security BearerAuth
func AddCarHandler(c *gin.Context) {
	var request AddCreationRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Cannot bind JSON: " + err.Error(),
		})
		return
	}
	userEmail := c.GetString("email")
	err := AddCar(userEmail, &request, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot add car" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Car added",
	})
	return
}

func AddCar(userEmail string, car *AddCreationRequest, db *gorm.DB) (err error) {
	// 1. 找到相应的用户记录
	var user User.Basic
	result := db.Where("email = ?", userEmail).First(&user)
	if result.Error != nil {
		return result.Error // 如果用户不存在，返回错误
	}

	// 2. 解析用户的车辆信息
	var cars []AddCreationRequest
	if user.CarInfo != "" { // 假设 CarInfo 是存储JSON数组的字段
		if err = json.Unmarshal([]byte(user.CarInfo), &cars); err != nil {
			return err // 如果解析JSON失败，返回错误
		}
	}

	// 3. 添加新车辆信息到数组中
	cars = append(cars, *car)

	// 4. 将更新后的车辆信息数组转回JSON字符串
	updatedCarInfo, err := json.Marshal(cars)
	if err != nil {
		return err // 如果JSON编码失败，返回错误
	}

	// 5. 更新数据库中的用户记录
	if result := db.Model(&User.Basic{}).Where("email = ?", userEmail).Update("car_info", updatedCarInfo); result.Error != nil {
		return result.Error // 如果数据库更新失败，返回错误
	}

	return nil
}
