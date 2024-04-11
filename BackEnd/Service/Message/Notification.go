package Message

import (
	"gorm.io/gorm"
	"time"
)

type Notification struct {
	gorm.Model
	ReceiverID uint      `gorm:"not null"`
	Content    string    `gorm:"type:text;not null"`
	SentAt     time.Time `gorm:"type:datetime;not null"`
}
