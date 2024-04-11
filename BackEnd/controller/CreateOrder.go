package controller

import (
	"capstone-project-9900h14atiktokk/Models"
	"gorm.io/gorm"
)

func CreateReport(db *gorm.DB, userID uint, spotID uint, reason string) error {
	user := Models.UserBasic{}
	spot := Models.SpotBasic{}
	// 创建举报
	report := Models.ReportBasic{
		ReporterID: userID,
		SpotID:     spotID,
		Reason:     reason,
		Reporter:   user,
		Spot:       spot,
	}

	if err := db.Create(&report).Error; err != nil {
		return err
	}

	return nil
}
