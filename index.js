const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

//Constants
const bw = 32*24//*32//500 //bound width
const bh = 32*18//*24//800 //bound height
const bthick = 50 //thickness
const bx = (canvas.width-bw)/2-bthick
const by = bthick
const scrollthick = 120
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
    ctx.fillRect(bx,by,bthick,bh+bthick)
    ctx.fillRect(bx+bthick+bw,by,bthick,bh+bthick)
    //ctx.fillStyle = 'green'
    ctx.fillRect(bx+bthick,by+bh,bw,bthick)
    ctx.fillRect(bx+bthick,by,bw,bthick)
    ctx.clearRect(0,0,bx,canvas.height)
    ctx.clearRect(bx+bw+bthick*2,0,canvas.width-bx,canvas.height)
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
    constructor() {
        this.position = {
            x:bx+100,
            y:100
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.width = 32
        this.height = 32
        this.jumping = false
    }

    draw() {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    land() {
        this.velocity.y = 0
        this.jumping = false
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
        this.width = 192
        this.height = 32
    }

    draw() {
        //ctx.fillStyle = 'blue'
        //ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
        let i=0
        for(i=0;i<6;i++) ctx.drawImage(spritebridge,0,0,this.width,this.height,this.position.x+i*32,this.position.y,this.width,this.height)
    }
}

class Block {
    constructor({x,y}) {
        this.position = {
            x,
            y
        }
        this.width = 32
        this.height = 32
    }

    draw() {
        ctx.drawImage(spriteblock,0,0,this.width,this.height,this.position.x,this.position.y,this.width,this.height)
    }
}

const player = new Player()
const platforms = [new Platform({x:bx+200,y:400}),new Platform({x:bx+800,y:500})]
const blocks = [new Block({x:bx+200,y:200}),new Block({x:bx+700,y:500}),new Block({x:bx+700,y:532}),new Block({x:bx+700,y:564})]
let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = '#ddd'
    ctx.fillRect(bx,by,bw+bthick,bh)

    //player
    if(keys.right.pressed && player.position.x+player.width<bx+bthick+bw-scrollthick) {
        player.velocity.x = 5
    } else if(keys.left.pressed && player.position.x>bx+bthick+scrollthick) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0
        if(keys.right.pressed) {
            scrollOffset += 5
            platforms.forEach(p => p.position.x -= 5)
            blocks.forEach(b => b.position.x -= 5)
        } else if(keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(p => p.position.x += 5)
            blocks.forEach(b => b.position.x += 5)
        }
    }

    player.jumping = true
    //TEMP floor collision
    if(player.position.y+player.height<=by+bh && player.position.y+player.height+player.velocity.y>=by+bh) player.land()

    //platform collision
    platforms.forEach(p => {
        if(player.position.y+player.height<=p.position.y && player.position.y+player.height+player.velocity.y>=p.position.y)
            if(player.position.x+player.width>=p.position.x && player.position.x<=p.position.x+p.width)
                player.land()
    })

    //block collision
    blocks.forEach(b => {
        if(player.position.y+player.height<=b.position.y && player.position.y+player.height+player.velocity.y>=b.position.y)
            if(player.position.x+player.width>=b.position.x && player.position.x<=b.position.x+b.width)
                player.land()
        if(player.position.y>=b.position.y+b.height && player.position.y+player.velocity.y<=b.position.y+b.height)
            if(player.position.x+player.width>=b.position.x && player.position.x<=b.position.x+b.width)
                player.velocity.y = 0
        if(player.position.x+player.width<=b.position.x && player.position.x+player.width+player.velocity.x>=b.position.x)
            if(player.position.y+player.height>=b.position.y && player.position.y<=b.position.y+b.height)
                player.velocity.x = 0
        if(player.position.x>=b.position.x+b.width && player.position.x+player.velocity.x<=b.position.x+b.width)
            if(player.position.y+player.height>=b.position.y && player.position.y<=b.position.y+b.height)
                player.velocity.x = 0
    })

    //win scenario
    if(scrollOffset>1600) console.log('you win')
    
    player.update()
    platforms.forEach(p => p.draw())
    blocks.forEach(b => b.draw())
    drawBounds()
    console.log(player.position.x,player.position.y)
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