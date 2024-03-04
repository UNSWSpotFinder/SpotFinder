package User

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
)

// GetUserList 获取用户列表 db用Init获取
func GetUserList(db *gorm.DB) ([]*Basic, error) {
	if db == nil {
		return nil, errors.New("db is nil")
	}
	var users []*Basic
	// 随机获取10个用户
	if err := db.Order("RAND()").Limit(10).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// CreateUser 创建用户
func CreateUser(db *gorm.DB, user *Basic) error {
	if err := db.Create(&user).Error; err != nil {
		return err
	}
	return nil
}

// CheckEmailAlreadyIn  检查邮箱是否已被注册
func CheckEmailAlreadyIn(db *gorm.DB, user *Basic) (bool, error) {
	var tempUser Basic
	fmt.Println(tempUser)
	err := db.Where("email = ?", user.Email).Take(&tempUser).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，电子邮件未被注册
			return false, nil
		}
		// 查询过程中发生错误
		return false, err
	}
	// 找到了记录，电子邮件已被注册
	return true, nil
}
