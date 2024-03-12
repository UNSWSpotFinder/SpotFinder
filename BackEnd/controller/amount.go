package controller

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"fmt"
	"gorm.io/gorm"
)

func TopUp(db *gorm.DB, userID string, amount float64) error {
	var user User.Basic

	// 查询该用户的信息
	if err := db.First(&user, userID).Error; err != nil {
		fmt.Println("Error finding user:", err)
		return err
	}

	// 打印该用户的原始信息
	fmt.Printf("Original user data: %+v\n", user)

	// 更新用户的账户余额和充值金额
	user.Account += amount
	user.TopUp += amount

	// 打印更新后的用户信息
	fmt.Printf("Updated user data: %+v\n", user)

	// 更新数据库中的用户信息
	if err := db.Model(&user).Where("id=?", userID).Updates(User.Basic{Account: user.Account, TopUp: user.TopUp}).Error; err != nil {
		fmt.Println("Error updating user:", err)
		return err
	}

	// 打印更新后从数据库中查询的用户信息
	var updatedUser User.Basic
	if err := db.First(&updatedUser, userID).Error; err != nil {
		fmt.Println("Error finding updated user:", err)
		return err
	}
	fmt.Printf("Updated user data from database: %+v\n", updatedUser)

	return nil
}

func Withdraw(db *gorm.DB, userID string, amount float64) error {
	var user User.Basic

	// 查询该用户的信息
	if err := db.First(&user, userID).Error; err != nil {
		fmt.Println("Error finding user:", err)
		return err
	}

	// 打印该用户的原始信息
	fmt.Printf("Original user data: %+v\n", user)

	// 更新用户的账户余额和提现金额
	user.Account += amount

	// 打印更新后的用户信息
	fmt.Printf("Updated user data: %+v\n", user)

	// 更新数据库中的用户信息
	if err := db.Model(&user).Where("id=?", userID).Updates(User.Basic{Account: user.Account}).Error; err != nil {
		fmt.Println("Error updating user:", err)
		return err
	}

	// 打印更新后从数据库中查询的用户信息
	var updatedUser User.Basic
	if err := db.First(&updatedUser, userID).Error; err != nil {
		fmt.Println("Error finding updated user:", err)
		return err
	}
	fmt.Printf("Updated user data from database: %+v\n", updatedUser)

	return nil
}
