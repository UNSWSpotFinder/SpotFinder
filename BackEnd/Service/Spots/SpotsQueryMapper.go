package Spots

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Models/User"
	"encoding/json"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"log"
	"strconv"
	"time"
)

func GetSpotList(db *gorm.DB, page int, pageSize int) ([]*Spot.Basic, error) {
	var spots []*Spot.Basic
	offset := (page - 1) * pageSize
	if err := db.Offset(offset).Limit(pageSize).Find(&spots).Error; err != nil {
		return nil, err
	}
	return spots, nil
}

func deleteSpot(id int, db *gorm.DB) error {
	var singleSpot Spot.Basic
	result := db.First(&singleSpot, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {

			return nil
		}
		return result.Error
	}

	if singleSpot.IsVisible == false {

		fmt.Println("已经下架了")
		return nil

	} else {

		result := db.Model(&singleSpot).Updates(map[string]interface{}{"IsVisible": false, "DeletedAt": time.Now()})

		return result.Error
	}
}

func CreateSpot(spot *Spot.Basic, user *User.Basic, userIDInt int, db *gorm.DB) error {
	spot.CreatedAt = time.Now()
	spot.UpdatedAt = time.Now()
	//创建一个用于存放用户自己的车位ID的数组

	if err := db.Create(&spot).Error; err != nil {
		return err
	} //先创建一个车位

	//更新用户的车位列表
	//先解析用户的车位列表

	if err := db.Find(&user, "id = ?", userIDInt).Error; err != nil { //先找到用户
		return err

	}

	var spotList struct {
		SpotList []int `json:"OwnedSpot"`
	}
	//解析用户的车位列表,如果没有就不解析,创建一个新的车位列表
	if user.OwnedSpot == "" {

		spotList.SpotList = append(spotList.SpotList, int(spot.ID))

		// 更新用户的车位列表
		spotListJson, err := json.Marshal(spotList)
		if err != nil {
			return err
		}
		err = db.Model(&user).Update("OwnedSpot", string(spotListJson)).Error
		if err != nil {
			return err // 处理更新错误
		}

		return nil

	} else {
		err := json.Unmarshal([]byte(user.OwnedSpot), &spotList) //解析用户的车位列表
		if err != nil {
			return err
		}
		spotList.SpotList = append(spotList.SpotList, int(spot.ID)) //加入新的车位
		//更新用户的车位列表
		spotListJson, err := json.Marshal(spotList)
		if err != nil {
			return err

		}
		err = db.Model(&user).Update("OwnedSpot", string(spotListJson)).Error
		if err != nil {
			log.Fatal("更新数据库时出错: ", err)
		}
	}

	return nil
}

func showAllOwnedSpot(user *User.Basic, userId string, db *gorm.DB) ([]Spot.Basic, error) {

	userIdInt, _ := strconv.Atoi(userId)

	var spotList []Spot.Basic
	db.Find(&user, "id = ?", userIdInt)

	//解析用户的车位列表,如果用户没有车位则返回空
	if user.OwnedSpot == "" {
		return spotList, nil

	}

	//解析用户的车位列表
	var spotListJson struct {
		SpotList []int `json:"OwnedSpot"`
	}
	err := json.Unmarshal([]byte(user.OwnedSpot), &spotListJson)
	if err != nil {
		return nil, err
	}

	for _, id := range spotListJson.SpotList { //遍历用户的车位列表
		var spot Spot.Basic
		db.First(&spot, "id= ? AND is_visible= ?", id, true)
		spotList = append(spotList, spot)

	}

	return spotList, nil

}

func UpdateSpot(spot *Spot.Basic, db *gorm.DB) error {

	if err := db.Model(&spot).Updates(spot).Error; err != nil {
		return err
	}
	return nil
}

func ChoseSizeWithMyCar(user *User.Basic, plateNumber string, db *gorm.DB) ([]*Spot.Basic, error) {
	var spot []*Spot.Basic

	//需要拿到id，从jwt token里拿用户id

	db.First(&user, "id = ?", 18) // 找到用户的车辆大小信息,默认拿第18号用户的信息

	//用户的车辆信息是一个json的字符串集合，需要解析
	type CarInfo struct {
		CarSize     string `json:"CarSize"`
		PlateNumber string `json:"PlateNumber"`
		Pictures    string `json:"Pictures"`
	}

	//如果用户没有车辆信息，返回空
	if user.CarInfo == "" {
		return spot, nil

	}
	var cars []CarInfo
	err := json.Unmarshal([]byte(user.CarInfo), &cars)
	if err != nil {
		return nil, err
	}

	//根据车牌号来查询车位大小
	for _, car := range cars {
		if car.PlateNumber == plateNumber {
			// 根据车辆大小信息查找合适的车位
			err := db.Where("size = ?", car.CarSize).Find(&spot).Error
			if err != nil {
				return nil, err
			}
			break // 找到匹配的车辆后就可以停止查找
		}
	}

	return spot, nil
}

func UpdateSpotPrice(spot *Spot.Basic, user *User.Basic, spotID string, pricePerDay float32, pricePerWeek float32, pricePerMonth float32, db *gorm.DB) error {
	//先确认用户是否拥有这个车位

	spotIDInt, _ := strconv.Atoi(spotID)

	db.First(&user, "id = ?", 18) //先默认用第18号用户

	db.First(&spot, "id = ?", spotIDInt)

	if spot.OwnerID != user.ID {
		return errors.New("用户没有这个车位")
	}

	//用户有权限修改价格
	if pricePerDay != 0 {
		spot.PricePerDay = float64(pricePerDay)

	}
	if pricePerWeek != 0 {
		spot.PricePerWeek = float64(pricePerWeek)
	}
	if pricePerMonth != 0 {
		spot.PricePerMonth = float64(pricePerMonth)
	}

	result := db.Model(&spot).Updates(spot)

	return result.Error

}
