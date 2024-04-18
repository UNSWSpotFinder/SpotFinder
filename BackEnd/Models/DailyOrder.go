package Models

import (
	"gorm.io/gorm"
	"time"
)

type DailyOrderCost struct {
	gorm.Model
	Date          time.Time `gorm:"type:date;unique"` // Date
	TotalCost     float64   `gorm:"type:float"`       // Cost of all orders on this day
	CostChangePct float64   `gorm:"type:float"`       // Rate of change of cost
}
