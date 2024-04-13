package Report

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
)

// GetReportInfoHandler 获取举报信息
// @Summary 获取举报信息
// @Description 获取举报信息
// @Tags Report
// @Accept json
// @Produce json
// @Success 200 {string} string "Report info"
// @Failure 500 {string} string "Unable to get report info"
// @Router /manager/report [get]
// @Security BearerAuth
func GetReportInfoHandler(c *gin.Context) {
	var report []Models.ReportBasic
	var db = Service.DB
	if err := db.Preload("Reporter").Preload("Spot").Find(&report).Error; err != nil {
		c.JSON(500, gin.H{"error": "Unable to get report info"})
		return
	}

	c.JSON(200, gin.H{"report": report})

}
