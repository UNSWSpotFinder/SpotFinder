package Models

import (
	"gorm.io/gorm"
	"time"
)

type DailyOrderCost struct {
	gorm.Model
	Date          time.Time `gorm:"type:date;unique"` // 日期，确保唯一
	TotalCost     float64   `gorm:"type:float"`       // 当天的总成本
	CostChangePct float64   `gorm:"type:float"`       // 与前一天比的成本变动百分比
}
