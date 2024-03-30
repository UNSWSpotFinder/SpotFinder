package controller

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"gorm.io/gorm"
)

// ApproveSpot 审核车位
func ApproveSpot(spotId string, db *gorm.DB) error {
	var spot Spot.Basic
	result := db.Model(&spot).Where("id = ?", spotId)
	if result.Error != nil {
		return result.Error
	}
	// 如果车位已经被审核过了
	if spot.IsVisible {
		return nil
	}
	// 审核车位
	result = result.Update("is_visible", true)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
