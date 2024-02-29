package Order

import "gorm.io/gorm"

type Basic struct {
	gorm.Model
	id uint `gorm:"primaryKey; autoIncrement"`
	// 一个订单只能属于一个用户
	OwnerID uint `gorm:"type:int;not null"`
	// 一个订单只能属于一个车位
	SpotID uint `gorm:"type:int;not null"`
	// Cost = Price * Time
	Cost float64 `gorm:"type:float;not null"`
	// Status = "Pending" or "Paid" or "Refund" or "Canceled"
	Status string `gorm:"type:varchar(255);not null"`
}

func (Basic) TableName() string {
	return "order"
}
