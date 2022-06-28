const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

//Constants
const blocksize = 32
const blockcols = 24//*32
const blockrows = 18//*24
const bw = blocksize*blockcols//500 //bound width
const bh = blocksize*blockrows//800 //bound height
const bthick = 20 //thickness
const bx = (canvas.width-bw)/2-bthick
const by = bthick*2
const scrollthick = blocksize*4
const speed = 5
const gravity = 0.5
//Assets
const audiojump = new Audio("./assets/player-jump.ogg")
const imgplatform = new Image()
imgplatform.src = "./assets/platform.png"
const background = new Image()
background.src = "./assets/background.png"
const spriteblock = new Image()
spriteblock.src = "./assets/block.png"
const spritebridge = new Image()
spritebridge.src = "./assets/bridge.png"

//Functions and classes
function waluigi() {
    const music = new Audio("./assets/ssbb-waluigi.ogg")
    music.loop = true
    music.volume = "0.2"
    music.play()
}

function drawBounds() {
    ctx.fillStyle = 'black'
    ctx.fillRect(bx-bthick,by-bthick,bthick,bh+bthick*2) //Left
    ctx.fillRect(bx+bw,by-bthick,bthick,bh+bthick*2) //Right
    ctx.fillRect(bx,by+bh,bw,bthick) //Floor
    ctx.fillRect(bx,by-bthick,bw,bthick) //Ceil
    // ctx.fillRect(bx-bthick,by-bthick,bw+bthick*2,bh+bthick*2)
}

function drawGrid(scrollOffset) {
    const gridOffset = -scrollOffset%blocksize
    ctx.fillStyle = "#ccc"
    for(let i=0;i<blockrows;i++) ctx.fillRect(bx,by+blocksize*i,bw+1,1)
    for(let i=0;i<blockcols+1;i++) ctx.fillRect(bx+blocksize*i+gridOffset,by,1,bh)
}

function clearOutside() {
    ctx.clearRect(0,0,bx-bthick,canvas.height)
    ctx.clearRect(bx+bw+bthick,0,canvas.width-bx-bw-bthick,canvas.height)
}

function blockCoord(offset,pos,inverted) {
    if(inverted) return offset-blocksize*(pos+1)
    return offset+blocksize*pos
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
        this.width = blocksize
        this.height = blocksize*2
        this.jumping = false
        this.colliding = false
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
        // if(this.position.y+this.height+this.velocity.y<=bh/*800*//*canvas.height*/) this.velocity.y += gravity
        // else this.land()
        this.velocity.y += gravity
        this.draw()
    }
}

class Platform {
    constructor({x,y}) {
        this.position = {
            x,
            y
        }
        this.blocks = 6
        this.width = blocksize*this.blocks
        this.height = blocksize
    }

    draw() {
        for(let i=0;i<this.blocks;i++) ctx.drawImage(spritebridge,0,0,blocksize,blocksize,this.position.x+i*32,this.position.y,blocksize,blocksize)
    }
}

class Block {
    constructor({x,y}) {
        this.position = {
            x,
            y
        }
        this.width = blocksize
        this.height = blocksize
    }

    draw() {
        ctx.drawImage(spriteblock,0,0,this.width,this.height,this.position.x,this.position.y,this.width,this.height)
    }
}

const player = new Player({x:blockCoord(bx,3),y:blockCoord(by+bh,14,true)})
const platforms = [
    new Platform({x:blockCoord(bx,6),y:blockCoord(by,11)}),
    new Platform({x:blockCoord(bx,24),y:blockCoord(by,14)})
]
const blocks = [
    new Block({x:blockCoord(bx,6),y:blockCoord(by,5)}),
    new Block({x:blockCoord(bx,21),y:blockCoord(by,14)}),
    new Block({x:blockCoord(bx,21),y:blockCoord(by,15)}),
    new Block({x:blockCoord(bx,21),y:blockCoord(by,16)})
]
let scrollOffset = 0
let scrolling = 0

//Main function
function animate() {
    requestAnimationFrame(animate)

    function checkCollisions() {
        player.jumping = true
        player.colliding = false

        //TEMP floor collision
        if(player.position.y+player.height<=by+bh && player.position.y+player.height+player.velocity.y>by+bh) player.land(by+bh)

        //platform collision
        platforms.forEach(p => {
            if(player.position.y+player.height<=p.position.y && player.position.y+player.height+player.velocity.y>p.position.y)
                if(player.position.x+player.width>=p.position.x && player.position.x<=p.position.x+p.width)
                    player.land(p.position.y)
        })

        //block collision
        xdiff = scrolling!=0 ? scrolling*speed : player.velocity.x
        blocks.forEach(b => {
            if(player.position.y+player.height<=b.position.y && player.position.y+player.height+player.velocity.y>b.position.y)
                if(player.position.x+player.width>b.position.x && player.position.x<b.position.x+b.width)
                    player.land(b.position.y)
            if(player.position.y>=b.position.y+b.height && player.position.y+player.velocity.y<=b.position.y+b.height)
                if(player.position.x+player.width>b.position.x && player.position.x<b.position.x+b.width)
                    player.land(b.position.y+b.height,true)
            if(player.position.x+player.width<=b.position.x && player.position.x+player.width+xdiff>b.position.x)
                if(player.position.y+player.height>=b.position.y && player.position.y<b.position.y+b.height)
                    player.collide(b.position.x)
            if(player.position.x>=b.position.x+b.width && player.position.x+xdiff<b.position.x+b.width)
                if(player.position.y+player.height>=b.position.y && player.position.y<b.position.y+b.height)
                    player.collide(b.position.x+b.width,true)
        })
    }

    //Player
    if(keys.right.pressed && player.position.x+player.width<bx+bw-scrollthick) {
        scrolling = 0
        player.velocity.x = 5
    } else if(keys.left.pressed && player.position.x>bx+scrollthick) {
        scrolling = 0
        player.velocity.x = -5
    } else {
        player.velocity.x = 0
        if(keys.right.pressed && !player.colliding) {
            scrolling = 1
            scrollOffset += 5
            platforms.forEach(p => p.position.x -= 5)
            blocks.forEach(b => b.position.x -= 5)
        } else if(keys.left.pressed && !player.colliding) {
            scrolling = -1
            scrollOffset -= 5
            platforms.forEach(p => p.position.x += 5)
            blocks.forEach(b => b.position.x += 5)
        }
    }

    checkCollisions()

    //win scenario
    if(scrollOffset>1600) console.log('you win')
    
    // Drawing functions
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = '#ddd'
    ctx.fillRect(bx,by,bw,bh)
    drawGrid(scrollOffset)
    // vvvvvv
    player.update()
    // ^^^^^^
    platforms.forEach(p => p.draw())
    blocks.forEach(b => b.draw())
    drawBounds()
    clearOutside()
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