package controllers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/yizumi/upsider-commander/apps/backend/src/models"
	"github.com/yizumi/upsider-commander/apps/backend/src/services"
)

type MemberController struct {
	memberService *services.MemberService
}

func NewMemberController(memberService *services.MemberService) *MemberController {
	return &MemberController{memberService: memberService}
}

func (c *MemberController) CreateMember(w http.ResponseWriter, r *http.Request) {
	var member models.Member
	err := json.NewDecoder(r.Body).Decode(&member)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	member.CreatedAt = time.Now()
	member.UpdatedAt = time.Now()

	err = c.memberService.CreateMember(&member)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(member)
}

func (c *MemberController) Pong(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	members, err := c.memberService.ListMembers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(members)
}

func (c *MemberController) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/members", c.Pong).Methods("GET")
	r.HandleFunc("/members", c.CreateMember).Methods("POST")
}
