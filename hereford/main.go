package main

import (
	_ "embed"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/wailsapp/wails"
)

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

func createFile(path string) {
	if !fileExists(path) {
		emptyFile, err := os.Create(path)
		if err != nil {
			log.Fatal(err)
		}

		emptyFile.Close()
	}
}

func writeFile(path string, content string) {
	// create file if doesn't exist
	if !fileExists(path) {
		createFile(path)
	}

	err := os.WriteFile(path, []byte(content), 0644)

	if err != nil {
		log.Fatal(err)
	}
}

func readFile(path string) string {
	content, err := ioutil.ReadFile(path)

	if err != nil {
		log.Fatal(err)
		return ""
	}

	return string(content)
}

func fileExists(path string) bool {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		// path/to/whatever does not exist
		return false
	}

	return true
}

func fileSetup() {
	createDirectory("herefordFiles")

	createFile("herefordFiles/category.txt")
	createFile("herefordFiles/console.txt")
	createFile("herefordFiles/estimate.txt")
	createFile("herefordFiles/game.txt")
	createFile("herefordFiles/runner1.txt")
	createFile("herefordFiles/runner2.txt")
	createFile("herefordFiles/runner3.txt")
	createFile("herefordFiles/runner4.txt")

	createFile("herefordFiles/settings.json")

	createDirectory("herefordFiles/upcomming")
}

func createDirectory(path string) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return os.Mkdir(path, os.ModeDir|0755)
	}
	return nil
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

	app.Bind(fetchApi)
	app.Bind(createFile)
	app.Bind(writeFile)
	app.Bind(fileSetup)
	app.Bind(readFile)
	app.Run()
}
