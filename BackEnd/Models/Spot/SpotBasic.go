package Spot

import "gorm.io/gorm"

type Basic struct {
	gorm.Model
	ID uint `gorm:"primaryKey; autoIncrement"`
	// 一个车位只能属于一个用户
	OwnerID  uint   `gorm:"type:int;not null"`
	SpotName string `gorm:"type:varchar(255);not null"`
	SpotAddr string `gorm:"type:text;not null"`
	SpotType string `gorm:"type:varchar(255);not null"`
	//IsOccupy  bool   `gorm:"type:boolean;not null"`
	// 先是 true
	IsVisible bool `gorm:"type:boolean;not null"`
	// TODO: 改成float
	Rate uint `gorm:"type:int"`
	//How to get here
	PassWay string `gorm:"type:text;not null"`
	// 可以被停车的车辆类型
	Size         string `gorm:"type:text;not null"`
	Charge       string `gorm:"type:text;"`
	Pictures     string `gorm:"type:mediumtext;not null"`
	MorePictures string `gorm:"type:mediumtext;not null"`
	IsDayRent    bool   `gorm:"type:boolean;not null"`
	IsWeekRent   bool   `gorm:"type:boolean;not null"`
	IsHourRent   bool   `gorm:"type:boolean;not null"`

	PricePerDay  float64 `gorm:"type:float"`
	PricePerWeek float64 `gorm:"type:float"`
	PricePerHour float64 `gorm:"type:float"`

	// 车位被占用的时间，从久远到现在，方便用二分查找算法
	AvailableTime string `gorm:"type:text"`
	OccupiedTime  string `gorm:"type:text"`

	OrderNum uint `gorm:"type:int"`
}

func (Basic) TableName() string {
	return "spot"
}
