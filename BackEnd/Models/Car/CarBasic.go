package Car

import (
	"gorm.io/gorm"
)

type Basic struct {
	gorm.Model
	OwnerId uint   `gorm:"type:int;not null"`
	Picture string `json:"picture" example:"picture"`
	Brand   string `json:"brand" example:"brand"`
	Plate   string `json:"plate" example:"plate"`
	Type    string `json:"type" example:"type"`
	Size    string `json:"size" example:"size"`
	Charge  string `json:"charge" example:"charge"`
}

func (Basic) TableName() string {
	return "car"
}
