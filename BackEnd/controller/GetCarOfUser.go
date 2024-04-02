package controller

import (
	"capstone-project-9900h14atiktokk/Models/Car"
	"gorm.io/gorm"
)

func GetCarOfUser(userID string, db *gorm.DB) (cars []Car.Basic, err error) {
	if result := db.Where("owner_id = ?", userID).Find(&cars); result.Error != nil {
		return nil, result.Error
	}
	return cars, nil
}
