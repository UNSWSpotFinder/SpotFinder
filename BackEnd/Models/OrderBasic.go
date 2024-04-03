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

type TimeRange struct {
	// Distance 时间差
	Distance  string `json:"distance " binding:"required" example:"28"`
	StartDate string `json:"startDate" binding:"required" example:"2024-04-02T13:00:00.000Z"`
	EndDate   string `json:"endDate" binding:"required" example:"2024-04-02T15:00:00.000Z"`
	TID       string `json:"Tid" binding:"required" example:"1712312421231"`
}

func (OrderBasic) TableName() string {
	return "order"
}
