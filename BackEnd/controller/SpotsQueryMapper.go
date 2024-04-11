package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"encoding/json"
	"errors"
	"gorm.io/gorm"
)

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

// GetSpotList 从数据库中获取所有车位数据
func GetSpotList(db *gorm.DB, isVisible bool, page int, pageSize int) ([]*tempSpotBasic, error) {
	if db == nil {
		return nil, errors.New("db is nil")
	}

	var allSpots []*Models.SpotBasic
	offset := (page - 1) * pageSize // 根据当前页计算偏移量
	query := db.Model(&Models.SpotBasic{}).Where("is_visible = ?", isVisible)
	if !isVisible {
		// If isVisible is false, also check that is_blocked is false
		query = query.Where("is_blocked = ?", false)
	}
	// 构建查询并进行分页

	err := query.Select(
		"id, spot_name, spot_addr, spot_type, rate, size, is_blocked," +
			"is_day_rent, is_week_rent, is_hour_rent, price_per_day, price_per_week, " +
			"price_per_hour, order_num, pictures, available_time").
		Offset(offset).Limit(pageSize).
		Find(&allSpots).Error
	if err != nil {
		return nil, err
	}

	// 将 *Spot.UserBasic 类型转换为 *tempSpotBasic 类型
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

func CreateSpot(spot *Models.SpotBasic, userEmail string, db *gorm.DB) error {
	var user Models.UserBasic

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
