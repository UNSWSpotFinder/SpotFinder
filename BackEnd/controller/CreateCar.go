package controller

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/Models/Vehicle"
	"encoding/json"
	"fmt"
	"gorm.io/gorm"
)

type CreateCarRequestData struct {
	Picture string `json:"picture" example:"Please use https://tool.jisuapi.com/pic2base64.html to convert the picture to base64 and then paste it here"`
	Brand   string `json:"brand" example:"Toyota"`
	Plate   string `json:"plate" example:"NSW123456"`
	Type    string `json:"type" example:"Bike"`
	Size    string `json:"size" example:"medium"`
	Charge  string `json:"charge" example:"No"`
}

func CreateCar(userId string, carData *CreateCarRequestData, db *gorm.DB) (err error) {
	// 1. 找到相应的用户记录
	var user User.Basic
	fmt.Println(userId)
	resultUser := db.Where("id = ?", userId).First(&user)
	if resultUser.Error != nil {
		return resultUser.Error // 如果用户不存在，返回错误
	}

	car := Vehicle.Basic{
		OwnerId: user.ID,
		Picture: carData.Picture,
		Brand:   carData.Brand,
		Plate:   carData.Plate,
		Type:    carData.Type,
		Size:    carData.Size,
		Charge:  carData.Charge,
	}

	// 2. 创建车辆

	if resultCar := db.Create(&car); resultCar.Error != nil {
		return resultCar.Error // 如果数据库更新失败，返回错误
	}

	// 3. 解析用户的车辆信息
	var cars []uint
	if user.CarInfo != "" { // 假设 CarInfo 是存储JSON数组的字段
		if err = json.Unmarshal([]byte(user.CarInfo), &cars); err != nil {
			return err // 如果解析JSON失败，返回错误
		}
	}

	// 4. 添加新车辆信息到数组中
	cars = append(cars, car.ID)
	newCarInfo, err := json.Marshal(cars)
	if err != nil {
		return err // 如果JSON编码失败，返回错误
	}
	if result := db.Model(&User.Basic{}).Where("id = ?", userId).Update("car_info", newCarInfo); result.Error != nil {
		return result.Error // 如果数据库更新失败，返回错误
	}

	return nil
}
