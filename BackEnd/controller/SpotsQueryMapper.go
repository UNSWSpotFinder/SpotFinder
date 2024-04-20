package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"encoding/json"
	"errors"
	"gorm.io/gorm"
)

// tempSpotBasic 临时车位基本信息，首页展示用
type tempSpotBasic struct {
	ID            uint
	SpotName      string
	SpotAddr      string
	SpotType      string
	Rate          float64
	Size          string
	AvailableTime string
	IsDayRent     bool
	IsWeekRent    bool
	IsHourRent    bool
	PricePerDay   float64
	PricePerWeek  float64
	PricePerHour  float64
	OrderNum      uint
	Picture       string
	IsBlocked     bool
}

// GetSpotList Get the list of spots
func GetSpotList(db *gorm.DB, isVisible bool, page int, pageSize int) ([]*tempSpotBasic, error) {
	if db == nil {
		return nil, errors.New("db is nil")
	}

	var allSpots []*Models.SpotBasic
	offset := (page - 1) * pageSize // Calculate the offset
	query := db.Model(&Models.SpotBasic{}).Where("is_visible = ?", isVisible)
	if !isVisible {
		// If isVisible is false, also check that is_blocked is false
		query = query.Where("is_blocked = ?", false)
	}
	// Build the query

	err := query.Select(
		"id, spot_name, spot_addr, spot_type, rate, size, available_time, is_blocked," +
			"is_day_rent, is_week_rent, is_hour_rent, price_per_day, price_per_week, " +
			"price_per_hour, order_num, pictures, available_time").
		Offset(offset).Limit(pageSize).
		Find(&allSpots).Error
	if err != nil {
		return nil, err
	}

	//  *Spot.UserBasic transform to *tempSpotBasic
	var resultSpots []*tempSpotBasic // The result to return
	for _, spot := range allSpots {
		tempSpot := &tempSpotBasic{
			ID:            spot.ID,
			SpotName:      spot.SpotName,
			SpotAddr:      spot.SpotAddr,
			SpotType:      spot.SpotType,
			Rate:          spot.Rate,
			Size:          spot.Size,
			AvailableTime: spot.AvailableTime,
			IsBlocked:     spot.IsBlocked,
			IsDayRent:     spot.IsDayRent,
			IsWeekRent:    spot.IsWeekRent,
			IsHourRent:    spot.IsHourRent,
			PricePerDay:   spot.PricePerDay,
			PricePerWeek:  spot.PricePerWeek,
			PricePerHour:  spot.PricePerHour,
			OrderNum:      spot.OrderNum,
			Picture:       spot.Pictures,
		}
		resultSpots = append(resultSpots, tempSpot)
	}

	return resultSpots, nil
}

func CreateSpot(spot *Models.SpotBasic, userEmail string, db *gorm.DB) error {
	var user Models.UserBasic

	// Create the spot
	if err := db.Create(&spot).Error; err != nil {
		return err
	}

	// Find the user
	if err := db.Where("email = ?", userEmail).First(&user).Error; err != nil {
		return err
	}

	var spotList struct {
		SpotList []int `json:"OwnedSpot"`
	}
	// Add the spot to the user's spot list
	if user.OwnedSpot == "" {
		spotList.SpotList = []int{int(spot.ID)}
	} else {
		if err := json.Unmarshal([]byte(user.OwnedSpot), &spotList); err != nil {
			return err
		}
		spotList.SpotList = append(spotList.SpotList, int(spot.ID)) // Add the spot to the list
	}

	// Update the user's spot list
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
