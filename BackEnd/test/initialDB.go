package main

import (
	"capstone-project-9900h14atiktokk/Models"
	"capstone-project-9900h14atiktokk/util"
	"fmt"
	"gorm.io/gorm"
)

func deleteData(db *gorm.DB) {
	// Define the models to be deleted
	models := []interface{}{&Models.UserBasic{}, &Models.OrderBasic{}, &Models.SpotBasic{}}
	for _, model := range models {
		// Unscoped() is used to delete the data permanently
		if err := db.Unscoped().Where("1 = 1").Delete(model).Error; err != nil {
			fmt.Println("Failed to delete data:", err)
			return
		}
	}
}

func main() {
	util.InitConfig()
	db := util.InitMySQL()
	deleteData(db)
}
