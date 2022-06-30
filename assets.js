const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const VERSION = "0.3.0.5"
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

const music = new Audio("./assets/ssbb-waluigi.ogg")
const audiojump = new Audio("./assets/player-jump.ogg")
const audiodied = new Audio("./assets/player-died.ogg")
const spriteblock = new Image()
spriteblock.src = "./assets/block.png"
const spriteground = new Image()
spriteground.src = "./assets/block-1.png"
const spritelava = new Image()
spritelava.src = "./assets/block-2.png"
const spritebridge = new Image()
spritebridge.src = "./assets/bridge.png"
const spritemario = new Image()
spritemario.src = "./assets/mario-2.png"

function testload() {
    spriteblock.src = "./assets/block.png"
    spriteground.src = "./assets/block-1.png"
    spritelava.src = "./assets/block-2.png"
    spritebridge.src = "./assets/bridge.png"
    spritemario.src = "./assets/mario-2.png"
}

const font = new Image()
font.src = "./assets/font.png"