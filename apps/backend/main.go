package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/yizumi/upsider-commander/apps/backend/controllers"
	"github.com/yizumi/upsider-commander/apps/backend/models"
	"github.com/yizumi/upsider-commander/apps/backend/services"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	db.AutoMigrate(&models.Member{})

	memberService := services.NewMemberService(db)
	memberController := controllers.NewMemberController(memberService)

	r := mux.NewRouter()
	memberController.RegisterRoutes(r)

	fmt.Println("Server started on :8080")
	http.ListenAndServe(":8080", r)
}