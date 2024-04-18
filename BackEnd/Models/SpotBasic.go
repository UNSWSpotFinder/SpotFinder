package Models

import "gorm.io/gorm"

type SpotBasic struct {
	gorm.Model
	ID       uint   `gorm:"primaryKey; autoIncrement"`
	OwnerID  uint   `gorm:"type:uint;not null"`
	SpotName string `gorm:"type:varchar(255);not null"`
	SpotAddr string `gorm:"type:text;not null"`
	SpotType string `gorm:"type:varchar(255);not null"`
	//IsOccupy  bool   `gorm:"type:boolean;not null"`
	// default true
	IsVisible bool    `gorm:"type:boolean;not null"`
	IsBlocked bool    `gorm:"type:boolean;default:false"`
	Rate      float64 `gorm:"type:float;not null"`
	//How to get here
	PassWay string `gorm:"type:text;not null"`
	// Size of the parking space
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

	// The time when the parking space is available
	AvailableTime string `gorm:"type:text"`
	OccupiedTime  string `gorm:"type:text"`

	OrderNum uint      `gorm:"type:int"`
	Owner    UserBasic `gorm:"foreignKey:OwnerID"`
}

func (SpotBasic) TableName() string {
	return "spot"
}
