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

func GetUserIDBySpotID(spotID uint, db *gorm.DB) uint {
	var spot Spot.Basic
	if err := db.First(&spot, spotID).Error; err != nil {
		return 0
	}
	return spot.OwnerID
}

func ModifySpotDetails(spot *Spot.Basic, db *gorm.DB) error {
	//fmt.Println("\n\n", spot)
	//更新数据库中的所有字段
	if err := db.Model(&spot).Where("id=?", spot.ID).Updates(spot).Error; err != nil {
		return err
	}
	return nil

}
