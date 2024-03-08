package Manager

import (
	"gorm.io/gorm"
	"time"
)

type Basic struct {
	gorm.Model
	Name       string     `gorm:"type:varchar(255);not null"`
	Password   string     `gorm:"type:varchar(255);not null"`
	Phone      string     `gorm:"type:varchar(20);not null"`
	DateBirth  string     `gorm:"type:varchar(20);not null"`
	Avatar     string     `gorm:"type:mediumtext;not null"`
	AdminID    string     `gorm:"type:varchar(100);not null"`
	CreateTime time.Time  `gorm:"type:datetime;null"`
	DeleteTime *time.Time `gorm:"type:datetime;null"`
}

func (Basic) TableName() string {
	return "manager"
}
