package Models

import "gorm.io/gorm"

type ReportBasic struct {
	gorm.Model

	// 一个举报只能属于一个用户
	ReporterID uint `gorm:"type:uint;not null"`
	// 一个举报只能属于一个车位
	SpotID uint `gorm:"type:uint;not null"`
	// 举报的原因
	Reason   string `gorm:"type:text;not null"`
	IsSolved bool   `gorm:"type:boolean;not null;default:false"`

	Reporter UserBasic `gorm:"foreignKey:ReporterID"`
	Spot     SpotBasic `gorm:"foreignKey:SpotID"`
}

func (ReportBasic) TableName() string {
	return "report"
}
