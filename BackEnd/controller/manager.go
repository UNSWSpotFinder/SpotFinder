package controller

import (
	"capstone-project-9900h14atiktokk/Models/Manager"
	"errors"
	"github.com/spf13/viper"
	"gorm.io/gorm"
)

// CreateManager 创建管理员
func CreateManager(admin *Manager.Basic, db *gorm.DB) error {
	invalidManager := viper.Get("managers.manager")
	found := false
	// 如果管理员 in invalidManager列表中,则创建管理员
	for _, v := range invalidManager.([]interface{}) {
		if admin.Name == v.(string) {
			found = true
			break
		}
	}
	if found {
		if err := db.Create(&admin).Error; err != nil {
			return err
		}
	} else {
		return errors.New("invalid manager")
	}
	return nil
}

// CheckAdminAlreadyIn  检查管理员是否已被注册
func CheckAdminAlreadyIn(db *gorm.DB, admin *Manager.Basic) (bool, error) {
	var tempAdmin Manager.Basic
	err := db.Where("name = ?", admin.Name).Take(&tempAdmin).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，管理员未被注册
			return false, nil
		}
		// 查询过程中发生错误
		return false, err
	}
	// 找到了记录，管理员已被注册
	return true, nil
}
