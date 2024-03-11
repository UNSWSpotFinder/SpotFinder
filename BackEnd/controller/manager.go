package controller

import (
	"capstone-project-9900h14atiktokk/Models/Manager"
	"capstone-project-9900h14atiktokk/Models/User"
	"errors"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
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

// Login 管理员登录
func Login(db *gorm.DB, admin *Manager.Basic) (string, error) {
	var tempAdmin Manager.Basic
	err := db.Where("admin_id = ?", admin.AdminID).Take(&tempAdmin).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，管理员未被注册
			return "", errors.New("manager not found")
		}
		// 查询过程中发生错误
		return "", err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(tempAdmin.Password), []byte(admin.Password)); err != nil {
		// 密码不匹配
		return "", errors.New("password mismatch")
	}
	// 生成JWT
	return User.GenerateToken(tempAdmin.AdminID, "admin")
}

// GetManagerByAdminID 通过邮箱获取管理员
func GetManagerByAdminID(db *gorm.DB, adminID string) (*Manager.Basic, error) {
	var admin Manager.Basic
	err := db.Where("admin_id = ?", adminID).Take(&admin).Error
	if err != nil {
		return nil, err
	}
	return &admin, nil
}
