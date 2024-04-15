package Models

import "gorm.io/gorm"

type Review struct {
	gorm.Model
	RaterID uint   `gorm:"not null"`
	SpotID  uint   `gorm:"not null"`
	OrderID uint   `gorm:"not null"`
	Rating  uint   `gorm:"not null"`
	Comment string `gorm:"type:text;not null"`

	Rater UserBasic  `gorm:"foreignKey:RaterID;"`
	Spot  SpotBasic  `gorm:"foreignKey:SpotID;"`
	Order OrderBasic `gorm:"foreignKey:OrderID;"`
}

func (Review) TableName() string {
	return "review"
}
