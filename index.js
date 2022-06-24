//import imgplatform from './platform.png'
//console.log(imgplatform)
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
const bw = 500 //bound width
const bh = 800 //bound height
const bthick = 50 //thickness

const audiojump = new Audio("./assets/player-jump.ogg")
const imgplatform = new Image()
imgplatform.src = "./assets/platform.png"

const gravity = 0.5
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
        this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.position.y+this.height+this.velocity.y<=bh/*800*//*canvas.height*/) this.velocity.y += gravity
        else this.velocity.y = 0
        this.draw()
    }
}

class Platform {
    constructor({x,y}) {
        this.position = {
            x,
            y
        }
        this.width = 200
        this.height = 20
    }

    draw() {
        //c.fillStyle = 'blue'
        //c.fillRect(this.position.x,this.position.y,this.width,this.height)
        c.drawImage(imgplatform,0,0,this.width,this.height,this.position.x,this.position.y,this.width,this.height)
    }
}

function waluigi() {
    const music = new Audio("./assets/ssbb-waluigi.ogg")
    music.loop = true
    music.volume = "0.2"
    music.play()
}

function drawBounds() {
    c.fillStyle = 'black'
    c.fillRect(0,0,bthick,bh+bthick)
    c.fillRect(bthick+bw,0,bthick,bh+bthick)
    c.fillStyle = 'green'
    c.fillRect(bthick,bh,bw,bthick)
}

const player = new Player()
const platforms = [new Platform({x:200,y:500}),new Platform({x:800,y:600})]
let scrollOffset = 0

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)

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
        } else if(keys.left.pressed) {
            scrollOffset -= 5
            platforms.forEach(p => p.position.x += 5)
        }
    }

    //platform collision
    platforms.forEach(p => {
        if(player.position.y+player.height<=p.position.y && player.position.y+player.height+player.velocity.y>=p.position.y)
            if(player.position.x+player.width>=p.position.x && player.position.x<=p.position.x+p.width)
                player.velocity.y = 0
    })

    //win scenario
    if(scrollOffset>1600) console.log('you win')
    
    player.update()
    platforms.forEach(p => p.draw())
    drawBounds()
}

waluigi()
animate()


//// Event Listeners ////

addEventListener('keydown',({key}) => {
    switch(key) {
        case 'ArrowUp':
            //up
            if(player.velocity.y==0) {
                player.velocity.y = -18//-10
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