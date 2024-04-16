package Voucher

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"errors"
	"github.com/gin-gonic/gin"
	"golang.org/x/exp/rand"
	"gorm.io/gorm"
	"net/http"
	"time"
)

// GenerateAndInsertVouchers GenerateAndInsertVouchers
// @Summary GenerateAndInsertVouchers
// @Description GenerateAndInsertVouchers
// @Tags Voucher
// @Accept json
// @Produce json
// @Success 200 {string} string "Vouchers generated and inserted successfully"
// @Failure 500 {string} string "Failed to generate and insert vouchers"
// @Router /vouchers/generate [post]
// @Security BearerAuth
func GenerateAndInsertVouchers(c *gin.Context) {
	db := Service.DB
	rand.Seed(uint64(time.Now().UnixNano())) // 初始化随机数生成器

	vouchers := make([]Models.Voucher, 1000)
	fixedValues := []float64{50, 60, 70, 80, 90} // 固定的价值选项

	for i := 0; i < 1000; i++ {
		vouchers[i] = Models.Voucher{
			Code:  generateRandomCode(8),
			Used:  false,
			Value: fixedValues[rand.Intn(len(fixedValues))], // 从固定值中随机选择一个
			Sent:  false,
		}
	}

	// 批量插入数据到数据库
	if err := db.CreateInBatches(vouchers, 100).Error; err != nil {
		c.JSON(500, gin.H{
			"message": "Failed to generate and insert vouchers",
		})
	}
	c.JSON(200, gin.H{
		"message": "Vouchers generated and inserted successfully",
	})

}

// generateRandomCode 生成指定长度的随机数作为Code
func generateRandomCode(length int) string {
	digits := "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	result := make([]byte, length)
	for i := range result {
		result[i] = digits[rand.Intn(len(digits))]
	}
	return string(result)
}

// GetVoucherHandler 随机返回一个未发放且未使用的优惠券
// @Summary 随机返回一个未发放且未使用的优惠券
// @Description 从数据库中随机选择一个未发放且未使用的优惠券
// @Tags Voucher
// @Accept json
// @Produce json
// @Success 200 {object} string "Return a voucher"
// @Failure 404 {string} string "No available voucher found"
// @Failure 500 {string} string "Internal server error"
// @Router /vouchers/random [get]
// @Security BearerAuth
func GetVoucherHandler(c *gin.Context) {
	db := Service.DB
	var voucher Models.Voucher

	// 随机选择一个未发放且未使用的优惠券
	result := db.Where("sent = ? AND used = ?", false, false).Order("RAND()").First(&voucher)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "No available voucher found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// 标记为已发放（可选）
	db.Model(&voucher).Update("sent", true)

	// 返回找到的优惠券
	c.JSON(http.StatusOK, voucher)
}

// UseVoucherHandler 使用优惠券
// @Summary 使用优惠券
// @Description 使用优惠券
// @Tags Voucher
// @Accept json
// @Produce json
// @Param code path string true "Voucher code"
// @Success 200 {string} string "Voucher used successfully"
// @Failure 404 {string} string "Voucher not found"
// @Failure 403 {string} string "Voucher has been used"
// @Failure 500 {string} string "Internal server error"
// @Router /vouchers/use/{code} [put]
// @Security BearerAuth
func UseVoucherHandler(c *gin.Context) {
	db := Service.DB
	code := c.Param("code")
	var voucher Models.Voucher
	result := db.Where("code = ?", code).First(&voucher)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	if voucher.Used {
		c.JSON(http.StatusForbidden, gin.H{"error": "Voucher has been used"})
		return
	}

	// 标记为已使用
	db.Model(&voucher).Update("used", true)

	c.JSON(http.StatusOK, gin.H{"value": voucher.Value})
}

// GetInfoOfVoucherHandler Get information of a voucher
// @Summary Get information of a voucher
// @Description Get information of a voucher
// @Tags Voucher
// @Accept json
// @Produce json
// @Param code path string true "Voucher code"
// @Success 200 {object} string "Return the value and used status of the voucher"
// @Failure 404 {string} string "Voucher not found"
// @Failure 500 {string} string "Internal server error"
// @Router /vouchers/info/{code} [get]
// @Security BearerAuth
func GetInfoOfVoucherHandler(c *gin.Context) {
	db := Service.DB
	code := c.Param("code")
	var voucher Models.Voucher
	result := db.Where("code = ? AND sent = ?", code, true).First(&voucher)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Voucher not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"value": voucher.Value, "used": voucher.Used})
}
