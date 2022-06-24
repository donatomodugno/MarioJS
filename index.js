const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

//Constants
const bw = 32*32//*24//500 //bound width
const bh = 32*24//*18//800 //bound height
const bthick = 50 //thickness
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
    ctx.fillRect(0,0,bthick,bh+bthick)
    ctx.fillRect(bthick+bw,0,bthick,bh+bthick)
    ctx.fillStyle = 'green'
    ctx.fillRect(bthick,bh,bw,bthick)
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
            x:100,
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

    lands() {
        this.velocity.y = 0
        this.jumping = false
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y+this.height+this.velocity.y<=bh/*800*//*canvas.height*/) this.velocity.y += gravity
        else this.lands()
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
const platforms = [new Platform({x:200,y:500}),new Platform({x:800,y:600})]
const blocks = [new Block({x:200,y:200}),new Block({x:700,y:600}),new Block({x:700,y:632}),new Block({x:700,y:664})]
let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    ctx.fillStyle = '#ddd'
    ctx.fillRect(0,0,bw+bthick,bh)

    //player
    if(keys.right.pressed && player.position.x+player.width<bthick+bw) {
        player.velocity.x = 5
    } else if(keys.left.pressed && player.position.x>bthick) {
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

    //platform collision
    platforms.forEach(p => {
        if(player.position.y+player.height<=p.position.y && player.position.y+player.height+player.velocity.y>=p.position.y)
            if(player.position.x+player.width>=p.position.x && player.position.x<=p.position.x+p.width)
                player.lands()
    })

    //block collision
    blocks.forEach(b => {
        if(player.position.y+player.height<=b.position.y && player.position.y+player.height+player.velocity.y>=b.position.y)
            if(player.position.x+player.width>=b.position.x && player.position.x<=b.position.x+b.width)
                player.lands()
        if(player.position.y>=b.position.y+b.height && player.position.y+player.velocity.y<=b.position.y+b.height)
            if(player.position.x+player.width>=b.position.x && player.position.x<=b.position.x+b.width)
                player.lands()
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
}

waluigi()
animate()


//// Event Listeners ////

addEventListener('keydown',({key}) => {
    switch(key) {
        case 'ArrowUp':
            //up
            if(!player.jumping) {
                player.velocity.y = -18//-10
                player.jumping = true
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