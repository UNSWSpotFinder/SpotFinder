package Vehicle

import (
	"capstone-project-9900h14atiktokk/Service"
	"capstone-project-9900h14atiktokk/controller"
	"github.com/gin-gonic/gin"
	"net/http"
)

// AddVehicleHandler Create a vehicle
// @Summary Create a vehicle
// @Schemes
// @Description do ping
// @Tags Cars
// @Accept json
// @Param carInfo body controller.CreateCarRequestData true "Information of the car"
// @Produce json
// @Success 200 {string} json{"code", "message"}
// @Fail 400 {string} json{"code", "message"}
// @Fail 500 {string} json{"code", "message"}
// @Router /car/create [post]
// @Security BearerAuth
func AddVehicleHandler(c *gin.Context) {
	var request controller.CreateCarRequestData
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Cannot bind JSON: " + err.Error(),
		})
		return
	}
	userID := c.GetString("userID")
	err := controller.CreateCar(userID, &request, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot add car" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Vehicle added",
	})
	return
}

// GetVehicleOfUserHandler Get the vehicle of the user
// @Summary Get the vehicle of the user
// @Schemes
// @Description Get the user's vehicle from the car's table, not from the user's table
// @Tags Cars
// @Accept json
// @Produce json
// @Success 200 {string} json{"cars", "cars"}
// @Fail 500 {string} json{"error", "message"}
// @Router /car/getMyCar [get]
// @Security BearerAuth
func GetVehicleOfUserHandler(c *gin.Context) {
	userID := c.GetString("userID")
	cars, err := controller.GetVehicleOfUser(userID, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot get car" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"cars": cars,
	})
	return
}

// GetVehicleByCarIDHandler Get the vehicle by carID
// @Summary Get the vehicle by carID
// @Schemes
// @Description Get the vehicle by carID
// @Tags Cars
// @Accept json
// @Produce json
// @Param carID path string true "车辆ID"
// @Success 200 {string} json{"car", "car"}
// @Fail 500 {string} json{"error", "message"}
// @Router /car/getCar/{carID} [get]
// @Security BearerAuth
func GetVehicleByCarIDHandler(c *gin.Context) {
	carID := c.Param("carID")
	car, err := controller.GetVehicleByCarID(carID, Service.DB)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Cannot get car" + err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"car": car,
	})
	return
}
