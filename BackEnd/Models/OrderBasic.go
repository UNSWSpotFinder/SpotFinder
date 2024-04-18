package Models

import (
	"gorm.io/gorm"
)

type OrderBasic struct {
	gorm.Model
	BookingTime string `gorm:"type:text;not null"`
	// One order belongs to one user
	BookerID uint `gorm:"type:bigint(20) unsigned;not null"`
	// One order belongs to one spot
	SpotID uint `gorm:"type:uint;not null"`
	// Cost = Price * Time
	Cost  float64 `gorm:"type:float;not null"`
	CarID uint    `gorm:"type:uint;not null"`
	// Status = "Pending" or "Paid" or "Refund" or "Canceled"
	Status string `gorm:"type:varchar(255);not null"`

	Booker UserBasic `gorm:"foreignKey:BookerID"`
	Spot   SpotBasic `gorm:"foreignKey:SpotID"`
}

type TimeRange struct {
	// Distance Time stamp
	Distance  string `json:"distance " binding:"required" example:"28"`
	StartDate string `json:"startDate" binding:"required" example:"2024-04-02T13:00:00.000Z"`
	EndDate   string `json:"endDate" binding:"required" example:"2024-04-02T15:00:00.000Z"`
	TID       string `json:"Tid" binding:"required" example:"1712312421231"`
}

func (OrderBasic) TableName() string {
	return "order"
}
