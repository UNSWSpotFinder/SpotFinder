package Models

import (
	"gorm.io/gorm"
)

type CarBasic struct {
	gorm.Model
	OwnerId uint   `gorm:"type:int4;not null"`
	Picture string `gorm:"type:longtext;not null"`
	Brand   string `gorm:"type:varchar(255);not null"`
	Plate   string `gorm:"type:varchar(255);not null"`
	Type    string `gorm:"type:varchar(255);not null"`
	Size    string `gorm:"type:varchar(255);not null"`
	Charge  string `gorm:"type:varchar(255);"`

	// Car refers to a User
	Owner UserBasic `gorm:"foreignKey:OwnerId"`
}

func (CarBasic) TableName() string {
	return "car"
}
