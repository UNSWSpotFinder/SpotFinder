package User

import (
	"capstone-project-9900h14atiktokk/Models"
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"strconv"
	"time"
)

// GetUserList Get a list of users
func GetUserList(db *gorm.DB) ([]*Models.UserBasic, error) {
	if db == nil {
		return nil, errors.New("db is nil")
	}
	var users []*Models.UserBasic
	// Randomly select 10 users
	if err := db.Order("RAND()").Limit(10).Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// CreateUser Create a user
func CreateUser(db *gorm.DB, user *Models.UserBasic) error {
	if err := db.Create(&user).Error; err != nil {
		return err
	}
	return nil
}

// CheckEmailAlreadyIn  Check if the email is already in the database
func CheckEmailAlreadyIn(db *gorm.DB, user *Models.UserBasic) (bool, error) {
	var tempUser Models.UserBasic
	err := db.Where("email = ?", user.Email).Take(&tempUser).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，电子邮件未被注册
			return false, nil
		}
		// Query error
		return false, err
	}
	// Found the record
	return true, nil
}

// ModifyPasswd Modify password
func ModifyPasswd(db *gorm.DB, user *Models.UserBasic) error {
	if err := db.Model(&user).Where("email=?", user.Email).Update("password", user.Password).Error; err != nil {
		return err
	}
	return nil
}

// Login Login return JWT
func Login(db *gorm.DB, user *Models.UserBasic) (string, error) {
	var tempUser Models.UserBasic
	err := db.Where("email = ?", user.Email).Take(&tempUser).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			// 没有找到记录，电子邮件未被注册
			return "", errors.New("user not found")
		}
		// Query error
		return "", err
	}
	err = bcrypt.CompareHashAndPassword([]byte(tempUser.Password), []byte(user.Password))
	if err != nil {
		return "", errors.New("password mismatch")
	}
	user.ID = GetUserByEmail(db, user.Email).ID
	return GenerateToken(user.ID, user.Email, "user")
}

// GenerateToken 生成JWT令牌
func GenerateToken(userID uint, userEmail string, userRole string) (string, error) {
	// 创建一个新的令牌对象，指定签名方法和令牌中的数据
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": strconv.Itoa(int(userID)),
		"email":  userEmail,
		"exp":    time.Now().Add(time.Hour * 72).Unix(),
		"role":   userRole,
	})

	// 使用密钥签名令牌
	tokenString, err := token.SignedString([]byte(viper.GetString("secrete.key")))
	//println(viper.GetString("secrete.key"))
	return tokenString, err
}

// ModifyUserInfo 修改用户信息
func ModifyUserInfo(db *gorm.DB, user *Models.UserBasic) error {
	if err := db.Model(&user).Where("email=?", user.Email).Updates(&user).Error; err != nil {
		return err
	}
	return nil
}

// GetUserByEmail 通过邮箱获取用户
func GetUserByEmail(db *gorm.DB, email string) *Models.UserBasic {
	var user Models.UserBasic
	err := db.Where("email = ?", email).Take(&user).Error
	if err != nil {
		return nil
	}
	return &user
}

// GetUserByID 通过ID获取用户
func GetUserByID(db *gorm.DB, id string) *Models.UserBasic {
	var user Models.UserBasic
	err := db.Where("id = ?", id).Take(&user).Error
	if err != nil {
		return nil
	}
	return &user
}
