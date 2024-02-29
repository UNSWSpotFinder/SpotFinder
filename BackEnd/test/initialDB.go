package main

import (
	"capstone-project-9900h14atiktokk/Models/Order"
	"capstone-project-9900h14atiktokk/Models/Spot"
	"capstone-project-9900h14atiktokk/Models/User"
	"capstone-project-9900h14atiktokk/util"
	"fmt"
	"gorm.io/gorm"
)

func deleteData(db *gorm.DB) {
	// 清空现有测试数据并生成新的测试数据
	models := []interface{}{&User.Basic{}, &Order.Basic{}, &Spot.Basic{}}
	for _, model := range models {
		// 使用 Unscoped() 来确保执行硬删除
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
