package Models

import (
	"gorm.io/gorm"
)

type OrderBasic struct {
	gorm.Model
	BookingTime string `gorm:"type:text;not null"`
	// 一个订单只能属于一个用户
	BookerID uint `gorm:"type:bigint(20) unsigned;not null"`
	// 一个订单只能属于一个车位
	SpotID uint `gorm:"type:uint;not null"`
	// Cost = Price * Time
	Cost  float64 `gorm:"type:float;not null"`
	CarID uint    `gorm:"type:uint;not null"`
	// Status = "Pending" or "Paid" or "Refund" or "Canceled"
	Status string `gorm:"type:varchar(255);not null"`

	Booker UserBasic `gorm:"foreignKey:BookerID"`
}

func (OrderBasic) TableName() string {
	return "order"
}
