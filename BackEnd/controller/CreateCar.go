package controller

import (
	"capstone-project-9900h14atiktokk/Models"
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
	// 1. Find the user
	var user Models.UserBasic
	fmt.Println(userId)
	resultUser := db.Where("id = ?", userId).First(&user)
	if resultUser.Error != nil {
		return resultUser.Error // 如果用户不存在，返回错误
	}

	car := Models.CarBasic{
		OwnerId: user.ID,
		Picture: carData.Picture,
		Brand:   carData.Brand,
		Plate:   carData.Plate,
		Type:    carData.Type,
		Size:    carData.Size,
		Charge:  carData.Charge,
	}

	// 2. Create the car

	if resultCar := db.Create(&car); resultCar.Error != nil {
		return resultCar.Error // 如果数据库更新失败，返回错误
	}

	// 3. Unmarshal the car info
	var cars []uint
	if user.CarID != "" { // 假设 CarID 是存储JSON数组的字段
		if err = json.Unmarshal([]byte(user.CarID), &cars); err != nil {
			return err // 如果解析JSON失败，返回错误
		}
	}

	// 4. Add the car ID to the user's car info
	cars = append(cars, car.ID)
	newCarInfo, err := json.Marshal(cars)
	if err != nil {
		return err // 如果JSON编码失败，返回错误
	}
	if result := db.Model(&Models.UserBasic{}).Where("id = ?", userId).Update("car_info", newCarInfo); result.Error != nil {
		return result.Error
	}

	return nil
}
