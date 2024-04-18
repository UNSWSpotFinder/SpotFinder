package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"gorm.io/gorm"
)

// GetOwnerFromSpot Get the owner of the spot
func GetOwnerFromSpot(db *gorm.DB, spotId uint) (uint, error) {
	var ownerId uint
	if err := db.Model(&Models.OrderBasic{}).Where("id = ?", spotId).Find(&ownerId).Error; err != nil {
		return 0, err
	}
	return ownerId, nil

}
