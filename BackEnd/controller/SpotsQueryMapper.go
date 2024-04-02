package controller

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Models/User"
	"encoding/json"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"time"
)

var spotIDList []uint

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
	IsBlocked    bool
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
func GetSpotList(db *gorm.DB, isVisible bool, page int, pageSize int) ([]*tempSpotBasic, error) {
	if db == nil {
		return nil, errors.New("db is nil")
	}

	var allSpots []*Spot.Basic
	offset := (page - 1) * pageSize // 根据当前页计算偏移量

	// 构建查询并进行分页
	query := db.Where("is_visible = ?", isVisible).Offset(offset).Limit(pageSize)

	if err := query.Select(
		"id, spot_name, spot_addr, spot_type, rate, size, is_blocked," +
			"is_day_rent, is_week_rent, is_hour_rent, price_per_day, price_per_week, " +
			"price_per_hour, order_num, pictures").
		Find(&allSpots).Error; err != nil {
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
			IsBlocked:    spot.IsBlocked,
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
