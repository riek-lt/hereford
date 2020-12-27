# Marathon-switcher
This program will load up an Oengus schedule, and writes it to different text-files for a really low-budget marathon experience

# Install

Just download the .exe from [**releases**](https://github.com/riek-lt/marathon-switcher/releases) and open it. This will create a folder with some text-files in it that you use in OBS. Make sure that it is in a folder that doesn't need special writing permissions.

# Usage
Upon opening, the program asks you for your slug from Oengus. For example, if your URL is `https://oengus.io/marathon/bsgo3`, the slug would be `bsgo3`.
Afterwards, if this isn't the first start of the program, it checks if the current value of the game file is in the "current" marathon, and prompts you if you want to resume that session. Otherwise, it asks if you want to start from the beginning.

## Main loop
In the main program, it will wait for your input before it does anything.
|  Input|Function  |
|--|--|
| n| Continues to the next run |
| p | Goes back to the previous run |
| j | Jumps and directly writes to a certain run (more info below) |
| sj | Jumps to a certain run, but doesn't write to files (more info below) |
|  s| Restarts the marathon by going to the first run |
| u | Reloads the marathon. Handy for when new runs got added. |

Note to jumping: This works by inputting the number of the order it appears in the schedule. For example:
![](docs/scheduleexample.png)

## Credits
This program was made by [Riek-lt](https://twitter.com/riek_lt)
