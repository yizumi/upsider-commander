package models

import (
	"time"

	"gorm.io/gorm"
)

type Member struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	OrganizationID uint           `gorm:"not null" json:"organization_id"`
	Name           string         `gorm:"not null" json:"name"`
	Email          string         `gorm:"unique;not null" json:"email"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}
