const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth//1000
canvas.height = innerHeight//800

const VERSION = "0.3.3"
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
const music = new Audio(ASSETPATH+"ssbb-waluigi.ogg")
const audiojump = new Audio(ASSETPATH+"player-jump.ogg")
const audiodied = new Audio(ASSETPATH+"player-died.ogg")
const spriteblock = new Image()
spriteblock.src = ASSETPATH+"block.png"
const spriteground = new Image()
spriteground.src = ASSETPATH+"block-1.png"
const spritelava = new Image()
spritelava.src = ASSETPATH+"block-2.png"
const spritebridge = new Image()
spritebridge.src = ASSETPATH+"bridge.png"
const spritebgo0 = new Image()
spritebgo0.src = ASSETPATH+"bgo.png"
const spritebgo1 = new Image()
spritebgo1.src = ASSETPATH+"bgo-1.png"
const spritebgo2 = new Image()
spritebgo2.src = ASSETPATH+"bgo-2.png"
const spritemario = new Image()
spritemario.src = ASSETPATH+"mario-2.png"
const spritebg1 = new Image()
spritebg1.src = ASSETPATH+"bg1-1.png"
const spritebg2 = new Image()
spritebg2.src = ASSETPATH+"bg1-2.png"
const spritebg3 = new Image()
spritebg3.src = ASSETPATH+"bg1-3.png"
const spritesheet = new Image()
spritesheet.src = ASSETPATH+"smb1-sheet.png"

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
let tick = 0
let isMobile = false