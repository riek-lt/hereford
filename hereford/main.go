package main

import (
	_ "embed"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/wailsapp/wails"
)

func basic() string {
	return "World!"
}

func fetchApi(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		log.Fatalln(err)
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		log.Fatal(err)
	}

	return string(body)
}

// func fetchUrl(url string) string {
// 	url += "aaa"
// 	return url
// }

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
	app.Bind(fetchApi)
	app.Run()
}
