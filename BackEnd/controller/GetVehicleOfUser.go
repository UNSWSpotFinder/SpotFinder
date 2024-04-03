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
