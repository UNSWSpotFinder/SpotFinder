package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"gorm.io/gorm"
)

func ModifyVehicleInfo(userID string, car *CreateCarRequestData, carID string, db *gorm.DB) error {
	if err := db.Model(&Models.CarBasic{}).Where("owner_id = ? AND id = ?", userID, carID).Updates(&car).Error; err != nil {
		return err
	}
	return nil
}

func GetUserIDByCarID(carID string, db *gorm.DB) (uint, error) {
	var car Models.CarBasic
	if err := db.First(&car, carID).Error; err != nil {
		return 0, err
	}

	return car.OwnerId, nil
}

func DeleteVehicle(userID string, carID string, db *gorm.DB) error {
	if err := db.Where("owner_id = ? AND id = ?", userID, carID).Delete(&Models.CarBasic{}).Error; err != nil {
		return err
	}
	return nil
}
