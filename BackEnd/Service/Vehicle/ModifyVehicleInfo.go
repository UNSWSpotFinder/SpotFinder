package Vehicle

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// ModifyVehicleInfoHandler 修改车辆信息
// @Summary 修改车辆信息
// @Description 修改车辆信息
// @Tags Cars
// @Accept json
// @Produce json
// @
// @Param car body controller.CreateCarRequestData true "车辆信息"
// @Success 200 {string} string "Vehicle information updated"
// @Failure 400 {string} string "Data binding error"
// @Failure 500 {string} string "SQL error message"
// @Router /car/modifyCarInfo/{carID} [post]
// @Security BearerAuth
func ModifyVehicleInfoHandler(c *gin.Context) {
	// 传入修改的数据
	var car controller.CreateCarRequestData
	userRole := c.GetString("role")
	userID := c.GetString("userID")
	carID := c.Param("carID")
	ownerID, err := controller.GetUserIDByCarID(carID, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot get user ID"})
		return
	}
	ownerIDStr := strconv.FormatUint(uint64(ownerID), 10)
	if userRole != "admin" || userID != ownerIDStr {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized to modify this car"})
		return
	}
	if err = c.ShouldBindJSON(&car); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Cannot bind JSON: " + err.Error(),
		})
		return
	}
	err = controller.ModifyVehicleInfo(userID, &car, carID, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot modify vehicle" + err.Error(),
		})
		return
	}

}
