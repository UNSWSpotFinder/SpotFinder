package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"gorm.io/gorm"
)

// GetSpotDetails Get the details of the spot
func GetSpotDetails(spotID string, db *gorm.DB) (Models.SpotBasic, error) {
	var spot Models.SpotBasic
	if err := db.First(&spot, spotID).Error; err != nil {
		return spot, err
	}
	return spot, nil
}

func GetUserIDBySpotID(spotID uint, db *gorm.DB) uint {
	var spot Models.SpotBasic
	if err := db.First(&spot, spotID).Error; err != nil {
		return 0
	}
	return spot.OwnerID
}

func ModifySpotDetails(spot *Models.SpotBasic, db *gorm.DB) error {
	if err := db.Model(&Models.SpotBasic{}).Where("id=?", spot.ID).Updates(spot).Error; err != nil {
		return err
	}
	return nil

}
