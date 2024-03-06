package User

import (
	"gorm.io/gorm"
	"time"
)

type Basic struct {
	gorm.Model
	Name       string     `gorm:"type:varchar(255);not null"`
	Password   string     `gorm:"type:varchar(255);not null"`
	Phone      string     `gorm:"type:varchar(20);not null"`
	DateBirth  string     `gorm:"type:varchar(20);not null"`
	Avatar     string     `gorm:"type:mediumtext;not null"`
	Email      string     `gorm:"type:varchar(100);not null"`
	CreateTime time.Time  `gorm:"type:datetime;null"`
	DeleteTime *time.Time `gorm:"type:datetime;null"`

	// 用户可以有多个车辆信息，租多个车位
	CarInfo    string `gorm:"type:text;not null"` // JSON 编码的字符串
	LeasedSpot string `gorm:"type:text"`
	Addr       string `gorm:"type:text;"`

	// 账户余额
	Account float64 `gorm:"type:float;not null"`
	Earning float64 `gorm:"type:float;not null"`
	TopUp   float64 `gorm:"type:float;not null"`

	OwnedSpot string `gorm:"type:text;not null"`
}

func (Basic) TableName() string {
	return "customer"
}
