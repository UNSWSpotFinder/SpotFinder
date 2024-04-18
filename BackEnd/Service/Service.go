package Service

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// DB Whole database connection
var DB *gorm.DB

// GetIndexHandler PingExample godoc
// @Summary ping example
// @Schemes
// @Description do ping
// @Tags example
// @Accept json
// @Produce json
// @Success 200 {string} Hello world
// @Router /index [get]
func GetIndexHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}

// GetAuthorization
// @Summary pingpong example
// @Schemes
// @Description do ping
// @Tags example
// @Accept json
// @Produce json
// @Success 200 {string} Hello world
// @Router /authorization [get]
// @Security BearerAuth
func GetAuthorization(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "pong",
	})
}
