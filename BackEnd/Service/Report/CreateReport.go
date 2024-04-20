package Report

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// CreateReportHandler Create a report
// @Summary Create a report
// @Description Create a report
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
	// Get user ID from JWT
	userIDStr := c.GetString("userID")
	userID, err := strconv.ParseUint(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Get spot ID from URL
	spotIDStr := c.Param("spotID")
	spotID, err := strconv.ParseUint(spotIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid spot ID"})
		return
	}

	// Unmarshal request body
	var requestBody struct {
		Message string `json:"message"`
	}
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid message"})
		return
	}
	message := requestBody.Message

	// Create report
	if err := controller.CreateReport(Service.DB, uint(userID), uint(spotID), message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to create report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report created successfully"})

}
