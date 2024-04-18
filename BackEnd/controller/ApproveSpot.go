package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"errors"
	"gorm.io/gorm"
)

// ApproveSpotOrNot Approve or not approve the spot
func ApproveSpotOrNot(spotId string, db *gorm.DB, isVisible bool) error {
	var spot Models.SpotBasic
	err := db.Where("id = ?", spotId).First(&spot).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 处理未找到记录的情况
			return nil // 或返回一个自定义错误
		}
		// process other errors
		return err
	}
	if spot.IsVisible == isVisible {
		return nil
	}
	// approve or not approve the spot
	result := db.Model(&spot).Update("is_visible", isVisible)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// BlockSpot ban the spot
func BlockSpot(spotId string, db *gorm.DB) error {
	var spot Models.SpotBasic
	if err := db.Where("id = ?", spotId).First(&spot).Error; err != nil {
		return err
	}

	// if the spot has been banned
	if !spot.IsVisible && spot.IsBlocked {
		return nil
	}

	if err := db.Model(&spot).Updates(map[string]interface{}{
		"is_visible": false,
		"is_blocked": true,
	}).Error; err != nil {
		return err
	}
	return nil
}

// UnBlockSpot unban the spot
func UnBlockSpot(spotId string, db *gorm.DB) error {
	var spot Models.SpotBasic
	if err := db.Where("id = ?", spotId).First(&spot).Error; err != nil {
		return err
	}

	// If the spot is not banned
	if !spot.IsBlocked {
		return nil
	}

	// unban the spot
	if err := db.Model(&spot).Updates(map[string]interface{}{
		"is_blocked": false,
	}).Error; err != nil {
		return err
	}
	return nil
}
