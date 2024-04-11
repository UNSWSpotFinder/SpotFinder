package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"errors"
	"gorm.io/gorm"
)

// ApproveSpotOrNot 审核车位
func ApproveSpotOrNot(spotId string, db *gorm.DB, isVisible bool) error {
	var spot Models.SpotBasic
	err := db.Where("id = ?", spotId).First(&spot).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 处理未找到记录的情况
			return nil // 或返回一个自定义错误
		}
		// 处理查询过程中的其他错误
		return err
	}
	if spot.IsVisible == isVisible {
		return nil
	}
	// 审核车位
	result := db.Model(&spot).Update("is_visible", isVisible)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// BlockSpot ban掉车位
func BlockSpot(spotId string, db *gorm.DB) error {
	var spot Models.SpotBasic
	if err := db.Where("id = ?", spotId).First(&spot).Error; err != nil {
		return err
	}

	// 如果车位已经被ban过了
	if !spot.IsVisible && spot.IsBlocked {
		return nil
	}

	// ban掉车位
	if err := db.Model(&spot).Updates(map[string]interface{}{
		"is_visible": false,
		"is_blocked": true,
	}).Error; err != nil {
		return err
	}
	return nil
}

// UnBlockSpot 解除ban车位
func UnBlockSpot(spotId string, db *gorm.DB) error {
	var spot Models.SpotBasic
	if err := db.Where("id = ?", spotId).First(&spot).Error; err != nil {
		return err
	}

	// 如果车位没有被ban过
	if !spot.IsBlocked {
		return nil
	}

	// 解除ban车位
	if err := db.Model(&spot).Updates(map[string]interface{}{
		"is_blocked": false,
	}).Error; err != nil {
		return err
	}
	return nil
}
