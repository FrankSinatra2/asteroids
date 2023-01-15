package main

import (
	"app/util"
	"fmt"
	"log"
	"net/http"
)

func main() {
	config, err := util.LoadConfig(".")

	if err != nil {
		log.Fatal("cannot load config:", err)
	}

	fmt.Println("config: ", config)
	http.Handle("/asteroids/", http.StripPrefix("/asteroids/", http.FileServer(http.Dir("./public"))))

	http.ListenAndServe(config.ServerAddress, nil)
}
