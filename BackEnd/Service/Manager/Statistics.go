package Manager

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/Service"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

// GetMoneyOfOrdersHandler Get the total cost and daily cost of orders
// @Summary Get the total cost and daily cost of orders
// @Description Get the total cost and daily cost of orders
// @Tags Manager
// @Accept json
// @Produce json
// @Success 200 {string} string "OK"
// @Failure 500 {string} string "Failed to calculate total cost"
// @Router /manager/statistics [get]
// @Security BearerAuth
func GetMoneyOfOrdersHandler(c *gin.Context) {
	db := Service.DB
	var totalCost float64
	// calculate total cost
	if err := db.Model(&Models.OrderBasic{}).Select("sum(cost)").Row().Scan(&totalCost); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total cost"})
		return
	}

	// Get the latest daily cost
	var latestDailyCost Models.DailyOrderCost
	if err := db.Order("date desc").First(&latestDailyCost).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve latest daily cost"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"totalProfit": totalCost * 0.15, // calculate profit
		"dailyCost":   latestDailyCost,
	})
}

// CalculateDailyCost 定时任务或单独调用的函数，不应该在API调用中直接使用
func CalculateDailyCost() error {
	db := Service.DB
	var todayCost, yesterdayCost float64

	today := time.Now()
	yesterday := today.AddDate(0, 0, -1)

	// 获取今天的总成本
	if err := db.Model(&Models.OrderBasic{}).Where("created_at >= ? AND created_at < ?", today.Format("2006-01-02"), today.AddDate(0, 0, 1).Format("2006-01-02")).Select("sum(cost)").Row().Scan(&todayCost); err != nil {
		todayCost = 0
	}

	// 获取昨天的总成本
	if err := db.Model(&Models.OrderBasic{}).Where("created_at >= ? AND created_at < ?", yesterday.Format("2006-01-02"), today.Format("2006-01-02")).Select("sum(cost)").Row().Scan(&yesterdayCost); err != nil {
		// 如果昨天没有成本记录，则昨天的成本为0
		yesterdayCost = 0
	}

	// 创建或更新每日成本记录
	dailyCost := Models.DailyOrderCost{
		Date:      today,
		TotalCost: todayCost,
	}
	return db.Create(&dailyCost).Error
}

// PopulateDailyOrderCosts collect daily costs from order_basics table and populate them into daily_order_costs table
// @Summary !!!DO NOT USE THIS API DIRECTLY!!!
// @Description collect daily costs from order_basics table and populate them into daily_order_costs table
// @Tags Manager
// @Accept json
// @Produce json
// @Success 200 {string} string "Daily order costs populated successfully"
// @Failure 500 {string} string "Failed to calculate daily order costs"
// @Router /manager/populate-daily-costs [post]
// @Security BearerAuth
func PopulateDailyOrderCosts(c *gin.Context) {
	db := Service.DB
	var results []struct {
		Date  time.Time
		Total float64
	}

	// 查询并汇总每日成本
	if err := db.Model(&Models.OrderBasic{}).Select("DATE(created_at) as date, SUM(cost) as total").Group("date").Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate daily order costs"})
	}

	// 遍历结果并填充到daily_order_costs表中
	for _, result := range results {
		dailyCost := Models.DailyOrderCost{
			Date:      result.Date,
			TotalCost: result.Total,
		}
		if err := db.Create(&dailyCost).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert daily order cost"})
		} else {
			c.JSON(http.StatusOK, gin.H{"message": "Daily order costs populated successfully"})
		}
	}
}

// GetLengthOfUsersHandler Get the total number of users
// @Summary Get the total number of users
// @Description Get the total number of users
// @Tags Manager
// @Accept json
// @Produce json
// @Success 200 {string} string "OK"
// @Failure 500 {string} string "Failed to calculate total users"
// @Router /manager/users [get]
// @Security BearerAuth
func GetLengthOfUsersHandler(c *gin.Context) {
	db := Service.DB
	var totalUsers int64
	// calculate total users
	if err := db.Model(&Models.UserBasic{}).Count(&totalUsers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total users"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"totalUsers": totalUsers,
	})
}

// GetLengthOfSpotsHandler Get the total number of spots with optional visibility and block status filters
// @Summary Get the total number of spots
// @Description Get the total number of spots, with optional filtering based on visibility and block status
// @Tags Manager
// @Accept json
// @Produce json
// @Param is_visible query string false "Filter spots by visibility"
// @Param is_blocked query string false "Filter spots by block status"
// @Success 200 {string} string "OK"
// @Failure 500 {string} string "Failed to calculate total spots"
// @Router /manager/spots [get]
// @Security BearerAuth
func GetLengthOfSpotsHandler(c *gin.Context) {
	db := Service.DB
	var totalSpots int64

	query := db.Model(&Models.SpotBasic{})

	// Optional visibility filter
	if isVisibleParam := c.Query("is_visible"); isVisibleParam != "" {
		isVisible, err := strconv.ParseBool(isVisibleParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid is_visible parameter"})
			return
		}
		query = query.Where("is_visible = ?", isVisible)
	}

	// Optional block status filter
	if isBlockedParam := c.Query("is_blocked"); isBlockedParam != "" {
		isBlocked, err := strconv.ParseBool(isBlockedParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid is_blocked parameter"})
			return
		}
		query = query.Where("is_blocked = ?", isBlocked)
	}

	// Calculate total spots with optional filters
	if err := query.Count(&totalSpots).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total spots"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"totalSpots": totalSpots,
	})
}

// GetLengthOfOrdersHandler Get the total number of orders with optional status filter
// @Summary Get the total number of orders
// @Description Get the total number of orders, with optional filtering based on status
// @Tags Manager
// @Accept json
// @Produce json
// @Param status query string false "Filter orders by status (Pending, Completed, Cancelled, Refund)"
// @Success 200 {string} string "OK"
// @Failure 500 {string} string "Failed to calculate total orders"
// @Router /manager/orders [get]
// @Security BearerAuth
func GetLengthOfOrdersHandler(c *gin.Context) {
	db := Service.DB
	var totalOrders int64

	query := db.Model(&Models.OrderBasic{})

	// Optional status filter
	statusParam := c.Query("status")
	if statusParam != "" {
		query = query.Where("status = ?", statusParam)
	}

	// Calculate total orders with optional filters
	if err := query.Count(&totalOrders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total orders"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":      statusParam,
		"totalOrders": totalOrders,
	})
}

// GetLengthOfManagerHandler Get the total number of managers
// @Summary Get the total number of managers
// @Description Get the total number of managers
// @Tags Manager
// @Accept json
// @Produce json
// @Success 200 {string} string "OK"
// @Failure 500 {string} string "Failed to calculate total managers"
// @Router /manager/managers [get]
// @Security BearerAuth
func GetLengthOfManagerHandler(c *gin.Context) {
	db := Service.DB
	var totalManagers int64
	// calculate total managers
	if err := db.Model(&Models.ManagerBasic{}).Count(&totalManagers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate total managers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"totalManagers": totalManagers,
	})

}
