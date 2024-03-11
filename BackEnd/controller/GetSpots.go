package controller

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"gorm.io/gorm"
)

// GetSpotDetails 从数据库中获取当前的车位数据
func GetSpotDetails(spotID string, db *gorm.DB) (Spot.Basic, error) {
	var spot Spot.Basic
	if err := db.First(&spot, spotID).Error; err != nil {
		return spot, err
	}
	return spot, nil
}
