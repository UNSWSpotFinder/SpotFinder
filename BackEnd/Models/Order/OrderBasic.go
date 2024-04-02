package Order

import (
	"capstone-project-9900h14atiktokk/Models/User"
	"gorm.io/gorm"
)

type Basic struct {
	gorm.Model
	BookingTime string `gorm:"type:text;not null"`
	UserID      uint   `gorm:"type:uint;not null"`
	// 一个订单只能属于一个用户
	OwnerID uint `gorm:"type:uint;not null"`
	// 一个订单只能属于一个车位
	SpotID uint `gorm:"type:uint;not null"`
	// Cost = Price * Time
	Cost  float64 `gorm:"type:float;not null"`
	CarID uint    `gorm:"type:uint;not null"`
	// Status = "Pending" or "Paid" or "Refund" or "Canceled"
	Status string `gorm:"type:varchar(255);not null"`

	Owner User.Basic `gorm:"foreignKey:OwnerID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;"`
}

func (Basic) TableName() string {
	return "order"
}
