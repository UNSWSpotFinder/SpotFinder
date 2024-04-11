package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"gorm.io/gorm"
)

func GetVehicleOfUser(userID string, db *gorm.DB) (cars []Models.CarBasic, err error) {
	if result := db.Where("owner_id = ?", userID).Find(&cars); result.Error != nil {
		return nil, result.Error
	}
	return cars, nil
}

func GetVehicleByCarID(carID string, db *gorm.DB) (car Models.CarBasic, err error) {
	if result := db.Where("id = ?", carID).First(&car); result.Error != nil {
		return car, result.Error
	}
	return car, nil
}
