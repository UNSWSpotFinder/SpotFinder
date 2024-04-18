package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Models/User"
	"errors"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// CreateManager Create a manager
func CreateManager(admin *Models.ManagerBasic, db *gorm.DB) error {
	invalidManager := viper.Get("managers.manager")
	found := false
	// If manager in invalidManager, create the manager
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

// CheckAdminAlreadyIn  Check if the admin is already in the database
func CheckAdminAlreadyIn(db *gorm.DB, admin *Models.ManagerBasic) (bool, error) {
	var tempAdmin Models.ManagerBasic
	err := db.Where("name = ?", admin.Name).Take(&tempAdmin).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，管理员未被注册
			return false, nil
		}
		// If an error occurs during the query
		return false, err
	}
	// Found the record
	return true, nil
}

// Login Manager login
func Login(db *gorm.DB, admin *Models.ManagerBasic) (string, error) {
	var tempAdmin Models.ManagerBasic
	err := db.Where("admin_id = ?", admin.AdminID).Take(&tempAdmin).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，管理员未被注册
			return "", errors.New("manager not found")
		}
		// If an error occurs during the query
		return "", err
	}
	if err := bcrypt.CompareHashAndPassword([]byte(tempAdmin.Password), []byte(admin.Password)); err != nil {
		// If the password does not match
		return "", errors.New("password mismatch")
	}
	// Generate token
	return User.GenerateToken(tempAdmin.ID, tempAdmin.AdminID, "admin")
}

// GetManagerByAdminID Get the manager by admin ID
func GetManagerByAdminID(db *gorm.DB, adminID string) (*Models.ManagerBasic, error) {
	var admin Models.ManagerBasic
	err := db.Where("admin_id = ?", adminID).Take(&admin).Error
	if err != nil {
		return nil, err
	}
	return &admin, nil
}
