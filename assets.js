const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth//1000
canvas.height = innerHeight//800

const VERSION = "0.3.5"
const CORNERLABEL = "MarioJS " + VERSION
const BLOCKSIZE = 32
const BLOCKCOLS = 24//*32
const BLOCKROWS = 18//*24
const BW = BLOCKSIZE*BLOCKCOLS//500 //bound width
const BH = BLOCKSIZE*BLOCKROWS//800 //bound height
const BTHICK = 20 //thickness
const BX = (canvas.width-BW)/2-BTHICK
const BY = BTHICK*2
const SCROLLTHICK = BLOCKSIZE*6
const SPEED = 5//4
const GRAVITY = 0.5
const ACCELERATION = 0.2
const JUMP = -16//-18//-10
const BOUNCE = false
const HIPNHOP = false

const ASSETPATH = "./assets/"
const music = new Audio(ASSETPATH+"smb-overworld.mp3")
const musicwaluigi = new Audio(ASSETPATH+"ssbb-waluigi.ogg")
const audiojump = new Audio(ASSETPATH+"player-jump.ogg")
const audiodied = new Audio(ASSETPATH+"player-died.ogg")
const audiostomp = new Audio(ASSETPATH+"stomped.ogg")
audiostomp.volume = "0.8"

const spritenames = [
    "SMAS-SMB1-Mario",
    "SMAS-SMB1-block1",
    "SMAS-SMB1-block2",
    "SMAS-SMW-block3",
    "SMAS-SMB1-block4",
    "SMAS-SMB1-block5",
    "SMAS-SMB1-bridge",
    "SMAS-SMB1-bgo1",
    "SMAS-SMB1-bgo1-1",
    "SMAS-SMB1-bgo1-2",
    "SMAS-SMB1-bg1-1",
    "SMAS-SMB1-bg1-2",
    "SMAS-SMB1-bg1-3",
    "SMAS-SMB1-npc0",
    "SMAS-SMB1-npc1"
]
const sprites = []
spritenames.forEach((s,i) => {
    sprites[i] = new Image()
    sprites[i].src = "./assets/"+s+".png"
})

const font = new Image()
font.src = ASSETPATH+"font.png"

//// Global variables ////
const keys = {
    left: {
        pressed:false
    },
    right: {
        pressed:false
    },
    up: {
        pressed:false,
        checked:false
    },
    down: {
        pressed:false
    }
}
const mouse = {
    x:0,
    y:0,
    left: {
        pressed:false,
        checked:false,
        x:0,
        y:0
    },
    right: {
        pressed:false,
        checked:false,
        x:0,
        y:0
    }
}
// let timestamps = []
let tick = 0
let isMobile = false