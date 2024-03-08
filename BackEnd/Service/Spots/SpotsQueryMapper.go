package Spots

import (
	"capstone-project-9900h14atiktokk/Models/Spot"
	"errors"
	"fmt"
	"gorm.io/gorm"
	"time"
)

func GetSpotList(db *gorm.DB) ([]*Spot.Basic, error) {

	var Spots []*Spot.Basic
	//先获取一百个
	if err := db.Limit(100).Find(&Spots).Error; err != nil {
		return nil, err
	}
	return Spots, nil
}

func deleteSpot(id int, db *gorm.DB) error {
	var singleSpot Spot.Basic
	result := db.First(&singleSpot, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {

			return nil
		}
		return result.Error
	}

	if singleSpot.IsVisible == false {

		fmt.Println("已经下架了")
		return nil

	} else {

		result := db.Model(&singleSpot).Updates(map[string]interface{}{"IsVisible": false, "DeletedAt": time.Now()})

		return result.Error
	}
}

// to be tested
func AddSpot(spot *Spot.Basic, db *gorm.DB) error {
	spot.CreatedAt = time.Now()
	spot.UpdatedAt = time.Now()
	if err := db.Create(&spot).Error; err != nil {
		return err
	}
	return nil

}

func UpdateSpot(spot *Spot.Basic, db *gorm.DB) error {
	if err := db.Model(&spot).Updates(spot).Error; err != nil {
		return err
	}
	return nil
}
