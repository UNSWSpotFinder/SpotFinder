package controller

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Models/User"
	"encoding/json"
	"errors"
	"fmt"
	"golang.org/x/exp/rand"
	"gorm.io/gorm"
	"strconv"
	"sync"
	"time"
)

var spotIDList []uint

// 读写锁
var spotIDMutex sync.RWMutex

// tempSpotBasic 临时车位基本信息，首页展示用
type tempSpotBasic struct {
	ID           uint
	SpotName     string
	SpotAddr     string
	SpotType     string
	Rate         float64
	Size         string
	IsDayRent    bool
	IsWeekRent   bool
	IsHourRent   bool
	PricePerDay  float64
	PricePerWeek float64
	PricePerHour float64
	OrderNum     uint
	Picture      string
}

// 初始化spotIDList
func initSpotIDList(db *gorm.DB) error {
	var ids []uint
	if err := db.Model(&Spot.Basic{}).Pluck("id", &ids).Error; err != nil {
		return err
	}

	spotIDList = ids
	return nil
}

// GetSpotList 从数据库中获取所有车位数据
func GetSpotList(db *gorm.DB) ([]*tempSpotBasic, error) {
	if db == nil {
		return nil, errors.New("db is nil")
	}

	spotIDMutex.Lock()
	defer spotIDMutex.Unlock()

	// 如果spotIDList为空，则初始化
	if len(spotIDList) == 0 {
		if err := initSpotIDList(db); err != nil {
			return nil, err
		}
	}

	var selectedIDs []uint
	if len(spotIDList) <= 50 {
		selectedIDs = append([]uint{}, spotIDList...) // 使用副本以避免更改原始列表
	} else {
		selectedIndexes := rand.Perm(len(spotIDList))[:50] // 随机选择50个不同的索引
		selectedIDs = make([]uint, 50)
		for i, idx := range selectedIndexes {
			selectedIDs[i] = spotIDList[idx]
		}
	}

	var allSpots []*Spot.Basic // 注意这里的变量声明变化
	if err := db.Where("id IN ?", selectedIDs).Select(
		"id, spot_name, spot_addr, spot_type, rate, " +
			"is_day_rent, is_week_rent, is_hour_rent, price_per_day, price_per_week, " +
							"price_per_hour, order_num, pictures").
		Find(&allSpots).Error; err != nil { // 确保这里使用&allSpots，不是&allSpot
		return nil, err
	}

	// 将 *Spot.Basic 类型转换为 *tempSpotBasic 类型
	var resultSpots []*tempSpotBasic // 这将是你的最终返回值
	for _, spot := range allSpots {
		tempSpot := &tempSpotBasic{
			ID:           spot.ID,
			SpotName:     spot.SpotName,
			SpotAddr:     spot.SpotAddr,
			SpotType:     spot.SpotType,
			Rate:         float64(spot.Rate),
			Size:         spot.Size,
			IsDayRent:    spot.IsDayRent,
			IsWeekRent:   spot.IsWeekRent,
			IsHourRent:   spot.IsHourRent,
			PricePerDay:  spot.PricePerDay,
			PricePerWeek: spot.PricePerWeek,
			PricePerHour: spot.PricePerHour,
			OrderNum:     spot.OrderNum,
			Picture:      spot.Pictures,
		}
		resultSpots = append(resultSpots, tempSpot)
	}

	return resultSpots, nil
}

func DeleteSpot(id int, db *gorm.DB) error {
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

func CreateSpot(spot *Spot.Basic, userEmail string, db *gorm.DB) error {
	var user User.Basic

	// 先创建一个车位
	if err := db.Create(&spot).Error; err != nil {
		return err
	}

	// 先找到用户
	if err := db.Where("email = ?", userEmail).First(&user).Error; err != nil {
		return err
	}

	var spotList struct {
		SpotList []int `json:"OwnedSpot"`
	}
	// 解析用户的车位列表, 如果没有就创建一个新的车位列表
	if user.OwnedSpot == "" {
		spotList.SpotList = []int{int(spot.ID)}
	} else {
		if err := json.Unmarshal([]byte(user.OwnedSpot), &spotList); err != nil {
			return err
		}
		spotList.SpotList = append(spotList.SpotList, int(spot.ID)) // 加入新的车位
	}

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
}

func ShowAllOwnedSpot(user *User.Basic, userId string, db *gorm.DB) ([]Spot.Basic, error) {

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

	//if pricePerDay < 0 || pricePerWeek < 0 || pricePerMonth < 0 {
	//	return errors.New("价格不能为负数")
	//}

	//用户有权限修改价格
	if pricePerDay != 0 {
		spot.PricePerDay = float64(pricePerDay)

	}
	if pricePerWeek != 0 {
		spot.PricePerWeek = float64(pricePerWeek)
	}
	if pricePerMonth != 0 {
		spot.PricePerHour = float64(pricePerMonth)
	}

	result := db.Model(&spot).Updates(spot)

	return result.Error

}
