package Report

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// CreateReportHandler 创建举报
// @Summary 创建举报
// @Description 创建举报
// @Tags Report
// @Accept json
// @Produce json
// @Param spotID path int true "Spot ID"
// @Param message body string true "Message"
// @Success 200 {string} string "Report created successfully"
// @Failure 500 {string} string "unable to create report"
// @Router /spots/{spotID}/report [post]
// @Security BearerAuth
func CreateReportHandler(c *gin.Context) {
	// 从请求中获取用户的 ID
	userIDStr := c.GetString("userID")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// 从请求中获取 spot ID
	spotIDStr := c.Param("spotID")
	spotID, err := strconv.ParseUint(spotIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spot ID"})
		return
	}

	// 从请求体中解析 message
	var requestBody struct {
		Message string `json:"message"`
	}
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message"})
		return
	}
	message := requestBody.Message

	// 创建举报
	if err := controller.CreateReport(Service.DB, uint(userID), uint(spotID), message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report created successfully"})

}
