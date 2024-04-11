package Report

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// SolveReportHandler 处理举报结果
// @Summary 处理举报
// @Description 根据举报结果禁用相关的车位或标记报告为已解决。
// @Tags Report
// @Accept json
// @Produce json
// @Param report_id query uint true "Report ID"
// @Param result query string true "Result should be either 'success' or 'failure'"
// @Success 200 {string} string "Report processed successfully"
// @Failure 400 {string} string "Invalid report ID or result parameter"
// @Router /manager/report/solve [post]
// @Security BearerAuth
func SolveReportHandler(c *gin.Context) {
	reportID, err := strconv.ParseUint(c.Query("report_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid report ID"})
		return
	}

	result := c.Query("result") // result 应为 "success" 或 "failure"
	if result != "success" && result != "failure" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid result"})
		return
	}

	// 一次查询获取报告及相关车位
	var report Models.ReportBasic
	tx := Service.DB.Begin()
	if err := tx.Preload("Spot").First(&report, reportID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		return
	}

	if result == "success" {
		// 处理成功
		if err := tx.Model(&report).Update("is_solved", true).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update report"})
			return
		}
		if err := tx.Model(&report.Spot).Updates(map[string]interface{}{"is_blocked": true, "is_visible": false}).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update spot"})
			return
		}
	} else {
		// 处理失败，仅标记报告为已解决
		if err := tx.Model(&report).Update("is_solved", true).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update report"})
			return
		}
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"message": "Report processed successfully"})
}
