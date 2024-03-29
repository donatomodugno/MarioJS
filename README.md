MarioJS
===
My first Mario clone in JavaScript

Try it: https://donatomodugno.github.io/MarioJS

Changelog
---
* 0.3.6:
    - Fixed 60 fps
    - Goombas improvements
    - Filename bugfixes
    - Fixed jumping from mobile control
* 0.3.5: _Mi sono scocciato di trovare nomi per le versioni_
    - Added ducking player movement
    - Added fine jumping based on key pressure time
    - Improved sprite sources importing
    - Fixed lava sprite filename
    - Fixed time interval for dead goombas to disappear
* 0.3.4: _Salta che ti passa - parte 2_
    - Implemented Goombas
    - Replaced Mario sprite from SMW to All-Stars SMB1
    - Added SMAS-SMB1 overworld BGM
    - Added pipes
    - WASD controls restored, both WASD and arrows are available
* 0.3.3: _Salta che ti passa - parte 1_
    - Animated Mario walking sprite
    - Added platform width (thanks to Andrea Caruso)
    - Created ButtonBlock class and menu.js
    - Added NPCs (Peach, Goombas...)
    - Peach (win scenario) fully implemented
* 0.3.2: _Saltiamo al mio tre_
    - Fixed bug: infinite jumping
    - Added constants to enable bouncing and hopping
    - Fixed background positioning
    - Added background functions for scrolling
    - Changelog changed
* 0.3.1: _Parallax la mia gioiax_
    - Mobile gestures improved again
    - Added parallax backgrounds
    - Pushed down floor level for death
    - Improved collision function for floor
    - Improved menu button
    - Moved blocks z-order behind player
* 0.3.0.7
    - Mobile gestures improved
* 0.3.0.6
    - Restored touches instead of mouse for mobile
* 0.3.0.5
    - The nth patch for mobile devices
* 0.3.0.4
    - Another mobile test
* 0.3.0.3
    - Added mobile controller (kinda)
* 0.3.0.2
    - Fixed some mobile controls bugs
* 0.3.0.1
    - Fixed bug: sometimes sprites not loads
    - Fixed mobile control
    - Cleaned code a bit
* 0.3: _Come tutto ebbe inizio_
    - Added main menu to start the game
    - Removed non-Mario assets
    - Added some rough mobile implementations
    - Code splitted in many new js files
    - Improved win scenario
* 0.2.4: _The floor is lava_
    - Completed lava block
    - Added lava animated sprite
    - Added Mario sprite (idle, walking, jumping)
    - Asset loader moved to assets.js
* 0.2.3: _Parsifichiamo il tutto_
    - Implemented level generation from js file
    - Added favicon and title
    - Moved game in MainGame function
    - Added lava block (no sprite, still buggy)
* 0.2.2: _Commit post-esame di Software Engineering_
    - Improved clearOutside function
    - Improved background functionalities
    - Fixed bug: crossing block while scrolling
    - Added ground block
    - Added fall death scenario
    - Implemented player acceleration (commented, still buggy)
    - Changelog created
    - Version print on screen
* 0.2.1: _Commit pre-esame di Software Engineering_
    - More code abstraction
    - Created grid and grid system
    - Fixed bug "little fall after fall" with more detailed functions
    - Fixed bigger border problems
* 0.2
    - Fixed air-jumping bug
    - Reduced visible area
    - Added scroll border thickness
    - Minor fixes
* 0.1.2
    - Added blocks
    - Improved previous jumping rough implementation
* 0.1.1: _Codice rimesso al passo delle modifiche su Altervista_
    - Imported images
    - Player movements with arrows and not WASD anymore
* 0.1: _Versione locale iniziale_
    - Code so close to [a tutorial that I followed on YouTube](https://www.youtube.com/watch?v=4q2vvZn5aoo)