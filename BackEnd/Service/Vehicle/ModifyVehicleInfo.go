package Vehicle

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

// ModifyVehicleInfoHandler Modify vehicle information
// @Summary Modify vehicle information
// @Description Modify vehicle information
// @Tags Cars
// @Accept json
// @Produce json
// @Param carID path string true "CarID"
// @Param car body controller.CreateCarRequestData true "Information of the car"
// @Success 200 {string} string "Vehicle information updated"
// @Failure 400 {string} string "Data binding error"
// @Failure 500 {string} string "SQL error message"
// @Router /car/modifyCarInfo/{carID} [post]
// @Security BearerAuth
func ModifyVehicleInfoHandler(c *gin.Context) {
	// The user must be the owner of the car or an admin to modify the car
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
	//fmt.Println(ownerIDStr != userID, userRole != "admin", ownerIDStr != userID || userRole != "admin")
	if userRole != "admin" && userID != ownerIDStr {
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

// DeleteVehicleHandler Delete a vehicle
// @Summary Delete a vehicle
// @Description Delete a vehicle
// @Tags Cars
// @Accept json
// @Produce json
// @Param carID path string true "CarID"
// @Success 200 {string} string "Vehicle deleted"
// @Failure 500 {string} string "SQL error message"
// @Router /car/deleteCar/{carID} [delete]
// @Security BearerAuth
func DeleteVehicleHandler(c *gin.Context) {
	userRole := c.GetString("role")
	userID := c.GetString("userID")
	carID := c.Param("carID")
	ownerID, err := controller.GetUserIDByCarID(carID, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot get user ID"})
		return
	}
	ownerIDStr := strconv.FormatUint(uint64(ownerID), 10)
	if userRole != "admin" && userID != ownerIDStr {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "You are not authorized to delete this car"})
		return
	}
	err = controller.DeleteVehicle(userID, carID, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot delete vehicle" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Vehicle deleted",
	})
	return
}
