package controller

import (
	"capstone-project-9900h14atiktokk/Models/Order"
	"gorm.io/gorm"
)

func CreateOrder(db *gorm.DB, order *Order.Basic) error {
	// 开始事务
	tx := db.Begin()

	// 创建订单
	if result := tx.Create(&order); result.Error != nil {
		tx.Rollback() // 创建失败，回滚事务
		return result.Error
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return err
	}
	return nil
}
