package Models

import (
	"gorm.io/gorm"
)

type Voucher struct {
	gorm.Model
	Code  string  `gorm:"type:varchar(8);unique"` // 确保Code是唯一的
	Used  bool    `gorm:"default:false"`          // 是否已使用
	Value float64 `gorm:"type:float"`             // 价值，介于50%到90%之间
	Sent  bool    `gorm:"default:false"`          // 是否已发放
}
