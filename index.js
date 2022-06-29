const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

// Constants
const VERSION = "0.2.2"
const BLOCKSIZE = 32
const BLOCKCOLS = 24//*32
const BLOCKROWS = 18//*24
const BW = BLOCKSIZE*BLOCKCOLS//500 //bound width
const BH = BLOCKSIZE*BLOCKROWS//800 //bound height
const BTHICK = 20 //thickness
const BX = (canvas.width-BW)/2-BTHICK
const BY = BTHICK*2
const SCROLLTHICK = BLOCKSIZE*6
const SPEED = 5
const GRAVITY = 0.5
const ACCELERATION = 0.2
// Assets
const audiojump = new Audio("./assets/player-jump.ogg")
const imgplatform = new Image()
imgplatform.src = "./assets/platform.png"
const background = new Image()
background.src = "./assets/background.png"
const spriteblock = new Image()
spriteblock.src = "./assets/block.png"
const spriteground = new Image()
spriteground.src = "./assets/block-1.png"
const spritebridge = new Image()
spritebridge.src = "./assets/bridge.png"

// Functions and classes
function printVersion() {
    ctx.fillStyle = 'white'
    ctx.fillText("MarioJS "+VERSION,BX-BTHICK+2,BY+BH+BTHICK-2)
}

function waluigi() {
    const music = new Audio("./assets/ssbb-waluigi.ogg")
    music.loop = true
    music.volume = "0.2"
    music.play()
}

function drawBounds() {
    ctx.fillStyle = 'black'
    ctx.fillRect(BX-BTHICK,BY-BTHICK,BTHICK,BH+BTHICK*2) //Left
    ctx.fillRect(BX+BW,BY-BTHICK,BTHICK,BH+BTHICK*2) //Right
    ctx.fillRect(BX,BY+BH,BW,BTHICK) //Floor
    ctx.fillRect(BX,BY-BTHICK,BW,BTHICK) //Ceil
    // ctx.fillRect(BX-BTHICK,BY-BTHICK,BW+BTHICK*2,BH+BTHICK*2)
}

function drawBackground() {
    let gradient = ctx.createLinearGradient(0,0,0,BH)
    gradient.addColorStop(0,'#edd')
    gradient.addColorStop(1,'#dde')
    ctx.fillStyle = '#ddd'
    ctx.fillRect(BX,BY,BW,BH)
}

function drawGrid(scrollOffset) {
    const gridOffset = -scrollOffset%BLOCKSIZE
    ctx.fillStyle = "#ccc"
    for(let i=0;i<BLOCKROWS;i++) ctx.fillRect(BX,BY+BLOCKSIZE*i,BW+1,1)
    for(let i=0;i<BLOCKCOLS+1;i++) ctx.fillRect(BX+BLOCKSIZE*i+gridOffset,BY,1,BH)
}

function clearOutside() {
    ctx.clearRect(0,0,BX-BTHICK,canvas.height)
    ctx.clearRect(BX+BW+BTHICK,0,canvas.width-BX-BW-BTHICK,canvas.height)
    ctx.clearRect(BX-BTHICK,0,BW+BTHICK*2,BY-BTHICK)
    ctx.clearRect(BX-BTHICK,BY+BH+BTHICK,BW+BTHICK*2,canvas.height-BY-BH-BTHICK)
}

function blockCoord(offset,pos,inverted) {
    if(inverted) return offset-BLOCKSIZE*(pos+1)
    return offset+BLOCKSIZE*pos
}

const keys = {
    left: {
        pressed:false
    },
    right: {
        pressed:false
    }
}

class Player {
    constructor({x,y}) {
        this.position = {
            x,
            y
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.width = BLOCKSIZE
        this.height = BLOCKSIZE*2
        this.jumping = false
        this.colliding = false
        this.acceleration = ACCELERATION
    }

    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    land(pos,top) {
        this.velocity.y = 0
        if(pos) this.position.y = top ? pos : pos-this.height
        if(!top) this.jumping = false
    }

    collide(pos,left) {
        this.velocity.x = 0
        if(pos) this.position.x = left ? pos : pos-this.width
        this.colliding = true
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        // if(this.position.y+this.height+this.velocity.y<=BH/*800*//*canvas.height*/) this.velocity.y += GRAVITY
        // else this.land()
        this.velocity.y += GRAVITY
        this.draw()
    }
}

class Platform {
    constructor({x,y}) {
        this.position = {
            x,
            y
        }
        this.startpos = {
            x,
            y,
        }
        this.blocks = 6
        this.width = BLOCKSIZE*this.blocks
        this.height = BLOCKSIZE
    }

    draw() {
        for(let i=0;i<this.blocks;i++) ctx.drawImage(spritebridge,0,0,BLOCKSIZE,BLOCKSIZE,this.position.x+i*32,this.position.y,BLOCKSIZE,BLOCKSIZE)
    }
}

class Block {
    constructor({x,y},id=0) {
        this.position = {
            x,
            y,
        }
        this.startpos = {
            x,
            y,
        }
        this.width = BLOCKSIZE
        this.height = BLOCKSIZE
        this.id = id
    }

    draw() {
        switch(this.id) {
            case 0:
                ctx.drawImage(spriteblock,0,0,this.width,this.height,this.position.x,this.position.y,this.width,this.height)
                break;
            case 1:
                ctx.drawImage(spriteground,0,0,this.width,this.height,this.position.x,this.position.y,this.width,this.height)
                break;
        }
    }
}

let player = new Player({x:blockCoord(BX,3),y:blockCoord(BY+BH,14,true)})
const platforms = [
    new Platform({x:blockCoord(BX,6),y:blockCoord(BY,11)}),
    new Platform({x:blockCoord(BX,24),y:blockCoord(BY,14)})
]
const ground = []
for(let i=0;i<40;i++) ground.push(new Block({x:blockCoord(BX,i),y:blockCoord(BY+BH,0,true)},1))
const blocks = [
    ...ground,
    new Block({x:blockCoord(BX,6),y:blockCoord(BY,5)}),
    new Block({x:blockCoord(BX,21),y:blockCoord(BY,14)}),
    new Block({x:blockCoord(BX,21),y:blockCoord(BY,15)}),
    new Block({x:blockCoord(BX,21),y:blockCoord(BY,16)})
]
let scrollOffset = 0
let scrollDirection = 0
let playerDirection = 0

// Main function
function animate() {
    requestAnimationFrame(animate)
    player.jumping = true
    player.colliding = false

    function cameraMove() {
        scrollOffset += scrollDirection*SPEED
        platforms.forEach(p => p.position.x -= scrollDirection*SPEED)
        blocks.forEach(b => b.position.x -= scrollDirection*SPEED)
    }

    function cameraReset() {
        scrollOffset = 0
        platforms.forEach(p => p.position.x = p.startpos.x)
        blocks.forEach(b => b.position.x = b.startpos.x)
    }

    function checkCollisions() {
        function checkCollisionDown(ya,yb,ydiff,x1a,x1b,x2a,x2b) {
            if(ya<=yb && ya+ydiff>yb)
                if(x1a>x1b && x2a<x2b)
                    return 1
            return 0
        }

        function checkCollisionUp(ya,yb,ydiff,x1a,x1b,x2a,x2b) {
            if(ya>=yb && ya+ydiff<yb)
                if(x1a>x1b && x2a<x2b)
                    return 1
            return 0
        }

        function checkCollisionRight(xa,xb,xdiff,y1a,y1b,y2a,y2b) {
            if(xa<=xb && xa+xdiff>xb)
                if(y1a>y1b && y2a<y2b)
                    return 1
            return 0
        }

        function checkCollisionLeft(xa,xb,xdiff,y1a,y1b,y2a,y2b) {
            if(xa>=xb && xa+xdiff<xb)
                if(y1a>y1b && y2a<y2b)
                    return 1
            return 0
        }

        // Fall death
        if(player.position.y+player.height<=BY+BH && player.position.y+player.height+player.velocity.y>BY+BH) {
            cameraReset()
            player = new Player({x:blockCoord(BX,3),y:blockCoord(BY+BH,14,true)})
        }

        // Platform collision
        platforms.forEach(p => {
            if(checkCollisionDown(player.position.y+player.height,p.position.y,player.velocity.y,player.position.x+player.width,p.position.x,player.position.x,p.position.x+p.width))
                player.land(p.position.y)
        })

        // Block collision
        xdiff = scrollDirection!=0 ? scrollDirection*SPEED : player.velocity.x
        blocks.forEach(b => {
            if(checkCollisionDown(player.position.y+player.height,b.position.y,player.velocity.y,player.position.x+player.width,b.position.x,player.position.x,b.position.x+b.width))
                player.land(b.position.y)
            if(checkCollisionUp(player.position.y,b.position.y+b.height,player.velocity.y,player.position.x+player.width,b.position.x,player.position.x,b.position.x+b.width))
                player.land(b.position.y+b.height,true)
            if(checkCollisionRight(player.position.x+player.width,b.position.x,xdiff,player.position.y+player.height,b.position.y,player.position.y,b.position.y+b.height)) {
                player.collide(b.position.x)
                scrollDirection = 0
            }
            if(checkCollisionLeft(player.position.x,b.position.x+b.width,xdiff,player.position.y+player.height,b.position.y,player.position.y,b.position.y+b.height)) {
                player.collide(b.position.x+b.width,true)
                scrollDirection = 0
            }
        })
    }


    // Player movements
    playerDirection = 0
    if(keys.right.pressed) playerDirection += 1
    if(keys.left.pressed) playerDirection -= 1
    player.acceleration = ACCELERATION

    if(playerDirection>0 && player.position.x+player.width<BX+BW-SCROLLTHICK) {
        scrollDirection = 0
        player.velocity.x = SPEED
        // if(player.velocity.x==SPEED) player.acceleration = 0
        // if(player.velocity.x<SPEED) player.velocity.x += player.acceleration
        // console.log(player.acceleration,player.velocity.x)
    } else if(playerDirection<0 && player.position.x>BX+SCROLLTHICK) {
        scrollDirection = 0
        player.velocity.x = -SPEED
        // if(player.velocity.x==-SPEED) player.acceleration = 0
        // if(player.velocity.x>-SPEED) player.velocity.x -= player.acceleration
        // console.log(player.acceleration,player.velocity.x)
    } else {
        player.velocity.x = 0
        if(playerDirection>0) {
            scrollDirection = 1
            // scrollOffset += SPEED
            // platforms.forEach(p => p.position.x -= SPEED)
            // blocks.forEach(b => b.position.x -= SPEED)
        } else if(playerDirection<0) {
            scrollDirection = -1
            // scrollOffset -= SPEED
            // platforms.forEach(p => p.position.x += SPEED)
            // blocks.forEach(b => b.position.x += SPEED)
        }
    }

    if(playerDirection==0 && player.velocity.x>0) {
        player.acceleration = ACCELERATION
        player.velocity.x -= player.acceleration
    }
    if(playerDirection==0 && player.velocity.x<0) {
        player.acceleration = ACCELERATION
        player.velocity.x += player.acceleration
    }

    /* --- WARNING: DIRTY CODE --- */
    if(playerDirection==0 && player.velocity.x>-ACCELERATION && player.velocity.x<ACCELERATION) {
        player.acceleration = ACCELERATION
        player.velocity.x = 0
    }
    /* --------------------------- */

    checkCollisions()
    cameraMove()
    scrollDirection=0

    // Win scenario
    if(scrollOffset>600) console.log('you win')
    
    // Drawing functions
    /* zIndex=-4 */ ctx.clearRect(0,0,canvas.width,canvas.height)
    /* zIndex=-3 */ drawBackground()
    /* zIndex=-2 */ drawGrid(scrollOffset)
    /* zIndex=-1 */ platforms.forEach(p => p.draw())
    /* zIndex=0  */ player.update()
    /* zIndex=+1 */ blocks.forEach(b => b.draw())
    /* zIndex=+2 */ drawBounds()
    /* zIndex=+3 */ clearOutside()
    /* zIndex=+4 */ printVersion()
}

waluigi()
animate()


//// Event Listeners ////

addEventListener('keydown',({key}) => {
    switch(key) {
        case 'ArrowUp':
            //up
            if(!player.jumping) {
                player.jumping = true
                player.velocity.y = -16//-18//-10
                audiojump.play()
            }
            break
        case 'ArrowLeft':
            //left
            keys.left.pressed = true
            break
        case 'ArrowDown':
            //down
            break
        case 'ArrowRight':
            //right
            keys.right.pressed = true
            break
    }
})

addEventListener('keyup',({key}) => {
    switch(key) {
        case 'ArrowUp':
            //up
            break
        case 'ArrowLeft':
            //left
            keys.left.pressed = false
            break
        case 'ArrowDown':
            //down
            break
        case 'ArrowRight':
            //right
            keys.right.pressed = false
            break
    }
})

addEventListener('mousedown',(e) => {
    // console.log(e.button)
    // console.log(player.acceleration,player.velocity.x)
})