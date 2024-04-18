package Models

import (
	"gorm.io/gorm"
	"time"
)

type UserBasic struct {
	gorm.Model
	Name       string     `gorm:"type:varchar(255);not null"`
	Password   string     `gorm:"type:varchar(255);not null"`
	Phone      string     `gorm:"type:varchar(20);not null"`
	DateBirth  string     `gorm:"type:varchar(20);not null"`
	Avatar     string     `gorm:"type:mediumtext;not null"`
	Email      string     `gorm:"type:varchar(100);not null"`
	CreateTime time.Time  `gorm:"type:datetime;null"`
	DeleteTime *time.Time `gorm:"type:datetime;null"`

	// User can have multiple cars
	CarID      string `gorm:"type:text"` // JSON string
	LeasedSpot string `gorm:"type:text"`
	Addr       string `gorm:"type:text;"`

	// The account balance left of the user
	Account float64 `gorm:"type:float;not null"`
	Earning float64 `gorm:"type:float;not null"`
	TopUp   float64 `gorm:"type:float;not null"`

	OwnedSpot string `gorm:"type:text;not null"`

	Cars   []CarBasic   `gorm:"foreignKey:OwnerId"`
	Spots  []SpotBasic  `gorm:"foreignKey:OwnerID"`
	Orders []OrderBasic `gorm:"foreignKey:BookerID"`
}

func (UserBasic) TableName() string {
	return "customer"
}
