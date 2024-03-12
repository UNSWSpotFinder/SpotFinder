package User

import (
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"time"
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

// ModifyPasswd 修改密码
func ModifyPasswd(db *gorm.DB, user *Basic) error {
	if err := db.Model(&user).Where("email=?", user.Email).Update("password", user.Password).Error; err != nil {
		return err
	}
	return nil
}

// Login 登录
// 返回JWT
func Login(db *gorm.DB, user *Basic) (string, error) {
	var tempUser Basic
	err := db.Where("email = ?", user.Email).Take(&tempUser).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，电子邮件未被注册
			return "", errors.New("user not found")
		}
		// 查询过程中发生错误
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(tempUser.Password), []byte(user.Password))
	if err != nil {
		return "", errors.New("password mismatch")
	}
	// 登录成功，返回JWT
	return GenerateToken(user.Email, "user")
}

// GenerateToken 生成JWT令牌
func GenerateToken(userEmail string, userRole string) (string, error) {
	// 创建一个新的令牌对象，指定签名方法和令牌中的数据
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": userEmail,
		"exp":   time.Now().Add(time.Hour * 72).Unix(),
		"role":  userRole,
	})

	// 使用密钥签名令牌
	tokenString, err := token.SignedString([]byte(viper.GetString("secrete.key")))
	println(viper.GetString("secrete.key"))
	return tokenString, err
}

// ModifyUserInfo 修改用户信息
func ModifyUserInfo(db *gorm.DB, user *Basic) error {
	if err := db.Model(&user).Where("email=?", user.Email).Updates(&user).Error; err != nil {
		return err
	}
	return nil
}

// GetUserByEmail 通过邮箱获取用户
func GetUserByEmail(db *gorm.DB, email string) (*Basic, error) {
	var user Basic
	err := db.Where("email = ?", email).Take(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
