package Spot

import "gorm.io/gorm"

type Basic struct {
	gorm.Model
	ID uint `gorm:"primaryKey; autoIncrement"`
	// 一个车位只能属于一个用户
	OwnerID   uint   `gorm:"type:int;not null"`
	SpotName  string `gorm:"type:varchar(255);not null"`
	SpotAddr  string `gorm:"type:text;not null"`
	SpotType  string `gorm:"type:varchar(255);not null"`
	IsOccupy  bool   `gorm:"type:boolean;not null"`
	IsVisible bool   `gorm:"type:boolean;not null"`
	Rate      uint   `gorm:"type:int"`
	// 可以被停车的车辆类型
	Size string `gorm:"type:text;not null"`

	Pictures string `gorm:"type:mediumtext;not null"`

	PricePerDay   float64 `gorm:"type:float"`
	PricePerWeek  float64 `gorm:"type:float"`
	PricePerMonth float64 `gorm:"type:float"`

	// 车位被占用的时间，从久远到现在，方便用二分查找算法
	OccupiedTime string `gorm:"type:text;not null"`
}

func (Basic) TableName() string {
	return "spot"
}
