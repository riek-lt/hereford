# Hereford

![](docs/logo_small.png)

## Speedrun marathon text-switching done easy

# Features

- Automatic Horaro and Oengus schedule import
- Output to separate text files for use in OBS or other streaming programs.
- Configurable output for the run's estimate.
- Gives you text file to show the previous and upcoming 3 runs for use in an intermission/break screen

# Install

Just download the .exe from [**releases**](https://github.com/riek-lt/hereford/releases) and open it. This will create a folder with some text-files in it that you use in OBS. Make sure that it is in a folder that doesn't need special writing permissions.

# Usage

Upon opening, the program asks you for your slug from Oengus or a full Horaro URL. For Oengus' example, if your URL is `https://oengus.io/marathon/bsgo3`, the slug would be `bsgo3`.
Afterwards, if this isn't the first start of the program, it checks if you got a marathon going on, and prompts you if you want to resume that session. Otherwise, it asks if you want to start from the beginning.

![](docs/programexample.png)

## Horaro instructions

Currently, for the columns, this program will only work if you name the columns "Game", "Category", "Console" and "Runners". Order doesn't matter, just the string needs to be precise (and case-sensitive). Doesn't work with URLs (yet).

## Main loop

In the main program, it will wait for your input before it does anything. You can use either the input, or the bolded word as input
| Input | Function |
|--|--|
| n | Continues to the **next** run |
| p | Goes back to the **previous** run |
| j | makes you **jump** and write to a certain run (more info below) |
| sj | **Silent jump**, jumps to a certain run, but doesn't write to files (more info below) |
| sn | **Silent next**, does a "next" to the next run, without writing to files |
| s | Go back to the **start** of the marathon |
| u | Makes you **reload**. Handy for when new runs got added. |
| nd | Loads in the **next deck**. |

Note to jumping: This works by inputting the number of the order it appears in the schedule. For example:

![](docs/scheduleexample.png)

Note that the first run is #0.

## Working on the project

<!-- this was a quick brain dump, update later -->

If you want to work on the project first make sure you have installed Node.js (12.x and up)

This quick setup guide is focused for windows systems, if you aren't using Windows, check out the [NodeGui docs](https://docs.nodegui.org/docs/guides/getting-started/)

For windows make sure you have the following installed:

- [Visual studio](https://visualstudio.microsoft.com/) 2017 and up.
- [Cmake](https://cmake.org/download/) 3.1 and up
- [Node.Js](https://nodejs.org/en/download/) 12.x and up

For more instructions on how to install Cmake for Windows see [this video](https://www.youtube.com/watch?v=8_X5Iq9niDE)

After having installed all this,
clone the project

```bash
git clone https://github.com/riek-lt/hereford.git
```

move into the project folder

install all dependensies

```bash
npm install
```

start the project

```bash
npm start
```

Build the project using (make sure you have run `npm start` before this)

```bash
npm run build
```

**note** that some of the commands don't work with bash, try using CMD or Powershell instead

## Future features

- A more fleshed out GUI (wip)
- Where possible automatic stream title/game changes
- Changing values live from the program

## Used in marathons

- [Italian Speedrun Marathon Online](https://oengus.io/marathon/ISMO)
- [Support Autism Speed Event (SASE)](https://www.twitch.tv/sase_marathon)

## Credits

This program was made by [Riek-lt](https://twitter.com/riek_lt)
