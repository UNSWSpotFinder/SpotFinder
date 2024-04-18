package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"fmt"
	"gorm.io/gorm"
)

func TopUp(db *gorm.DB, userID string, amount float64) error {
	var user Models.UserBasic

	// Query the user's information
	if err := db.First(&user, userID).Error; err != nil {
		fmt.Println("Error finding user:", err)
		return err
	}

	// Print the original user information
	//fmt.Printf("Original user data: %+v\n", user)

	// Update the user's account balance and top-up amount
	user.Account += amount
	user.TopUp += amount

	// Print the updated user information
	//fmt.Printf("Updated user data: %+v\n", user)

	// Update the user information in the database
	if err := db.Model(&user).Where("id=?", userID).Updates(Models.UserBasic{Account: user.Account, TopUp: user.TopUp}).Error; err != nil {
		fmt.Println("Error updating user:", err)
		return err
	}

	// Print the updated user information queried from the database
	var updatedUser Models.UserBasic
	if err := db.First(&updatedUser, userID).Error; err != nil {
		fmt.Println("Error finding updated user:", err)
		return err
	}
	fmt.Printf("Updated user data from database: %+v\n", updatedUser)

	return nil
}

func Withdraw(db *gorm.DB, userID string, amount float64) error {
	var user Models.UserBasic

	// Query the user's information
	if err := db.First(&user, userID).Error; err != nil {
		fmt.Println("Error finding user:", err)
		return err
	}

	//fmt.Printf("Original user data: %+v\n", user)

	// Update the user's account balance and withdrawal amount
	user.Account += amount

	//fmt.Printf("Updated user data: %+v\n", user)

	// Update the user information in the database
	if err := db.Model(&user).Where("id=?", userID).Updates(Models.UserBasic{Account: user.Account}).Error; err != nil {
		fmt.Println("Error updating user:", err)
		return err
	}

	// Print the updated user information queried from the database
	var updatedUser Models.UserBasic
	if err := db.First(&updatedUser, userID).Error; err != nil {
		fmt.Println("Error finding updated user:", err)
		return err
	}
	//fmt.Printf("Updated user data from database: %+v\n", updatedUser)

	return nil
}
