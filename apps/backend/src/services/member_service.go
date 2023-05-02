package services

import (
	"github.com/yizumi/upsider-commander/apps/backend/controllers"
	"github.com/yizumi/upsider-commander/apps/backend/models"
	"gorm.io/gorm"
)

type MemberService struct {
	db *gorm.DB
}

func NewMemberService(db *gorm.DB) *MemberService {
	return &MemberService{db: db}
}

func (s *MemberService) CreateMember(member *models.Member) error {
	return s.db.Create(member).Error
}

func (s *MemberService) ListMembers() ([]models.Member, error) {
	var members []models.Member
	err := s.db.Find(&members).Error
	return members, err
}
