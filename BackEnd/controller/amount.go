package controller

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"gorm.io/gorm"
)

func TopUp(db *gorm.DB, userID uint, amount float64) error {
	var user User.Basic
	if err := db.First(&user, userID).Error; err != nil {
		return err
	}
	user.Account += amount
	if err := db.Save(&user).Error; err != nil {
		return err
	}
	return nil

}
