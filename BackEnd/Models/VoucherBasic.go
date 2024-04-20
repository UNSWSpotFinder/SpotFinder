package Models

import (
	"gorm.io/gorm"
)

type Voucher struct {
	gorm.Model
	Code  string  `gorm:"type:varchar(8);unique"` // Must be unique
	Used  bool    `gorm:"default:false"`          // Is it used
	Value float64 `gorm:"type:float"`             // $50 - $90
	Sent  bool    `gorm:"default:false"`          // Is it sent
}
