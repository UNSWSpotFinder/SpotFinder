package controller

import (
	"capstone-project-9900h14atiktokk/Models/Vehicle"
	"gorm.io/gorm"
)

func ModifyVehicleInfo(userID string, car *CreateCarRequestData, carID string, db *gorm.DB) error {
	if err := db.Model(&Vehicle.Basic{}).Where("owner_id = ? AND id = ?", userID, carID).Updates(&car).Error; err != nil {
		return err
	}
	return nil
}

func GetUserIDByCarID(carID string, db *gorm.DB) (uint, error) {
	var car Vehicle.Basic
	if err := db.First(&car, carID).Error; err != nil {
		return 0, err
	}

	return car.OwnerId, nil
}
