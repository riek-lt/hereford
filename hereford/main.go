package main

import (
	_ "embed"

	"github.com/wailsapp/wails"
)

func basic() string {
	return "World!"
}

//go:embed frontend/public/build/bundle.js
var js string

//go:embed frontend/public/build/bundle.css
var css string

func main() {

	app := wails.CreateApp(&wails.AppConfig{
		MinWidth:  480,
		MinHeight: 340,
		Resizable: true,
		Title:     "hereford",
		JS:        js,
		CSS:       css,
		Colour:    "#131313",
	})

	app.Bind(basic)
	app.Run()
}
