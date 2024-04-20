package Models

import "gorm.io/gorm"

type ReportBasic struct {
	gorm.Model

	ReporterID uint   `gorm:"type:uint;not null"`
	SpotID     uint   `gorm:"type:uint;not null"`
	Reason     string `gorm:"type:text;not null"`
	IsSolved   bool   `gorm:"type:boolean;not null;default:false"`

	Reporter UserBasic `gorm:"foreignKey:ReporterID"`
	Spot     SpotBasic `gorm:"foreignKey:SpotID"`
}

func (ReportBasic) TableName() string {
	return "report"
}
