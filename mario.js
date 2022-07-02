// Global functions

function printVersion() {
    ctx.font = '10px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(CORNERLABEL,BX-BTHICK+2,BY+BH+BTHICK-2)
}

function waluigi() {
    music.loop = true
    music.volume = "0.2"
    music.play()
}

function waluigiStop() {
    music.pause();
    music.currentTime = 0;
}

function waluigiRestart() {
    music.currentTime = 0;
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
    function infiniteBackground(sprite,xoffset,yoffset,width,zoom=1,factor=1) {
        ctx.drawImage(sprite,xoffset,yoffset,width/zoom,BH/zoom,BX-scrollOffset%width/factor,BY,width,BH)
        ctx.drawImage(sprite,xoffset,yoffset,width/zoom,BH/zoom,BX-scrollOffset%width/factor+width,BY,width,BH)
    }
    function tiledBackground(sprite,xoffset,yoffset,width,height,zoom=1) {
        for(let i=0;i*height*zoom<BH;i++)
            for(let j=0;j*width*zoom<BW;j++)
                ctx.drawImage(sprite,xoffset,yoffset,width,height,BX+j*width*zoom,BY+i*height*zoom,width*zoom,height*zoom)
    }

    let gradient = ctx.createLinearGradient(0,0,0,BH)
    gradient.addColorStop(0,'#fdd')
    gradient.addColorStop(1,'#ddf')
    ctx.fillStyle = gradient//'#ddd'
    ctx.fillRect(BX,BY,BW,BH)
    ctx.drawImage(spritebg2,8,16*4,BW/4*3,BH/4,BX-scrollOffset/4,BY,BW*3,BH)
    ctx.drawImage(spritebg1,8,16*4+236,BW/4*3,BH/4,BX-scrollOffset/2,BY,BW*3,BH)
}

function clearOutside() {
    ctx.clearRect(0,0,BX-BTHICK,canvas.height)
    ctx.clearRect(BX+BW+BTHICK,0,canvas.width-BX-BW-BTHICK,canvas.height)
    ctx.clearRect(BX-BTHICK,0,BW+BTHICK*2,BY-BTHICK)
    ctx.clearRect(BX-BTHICK,BY+BH+BTHICK,BW+BTHICK*2,canvas.height-BY-BH-BTHICK)
}

// Functions and classes {

function drawGrid() {
    const gridOffset = -scrollOffset%BLOCKSIZE
    // ctx.globalAlpha = 0.2
    ctx.fillStyle = "#ccc"
    for(let i=0;i<BLOCKROWS;i++) ctx.fillRect(BX,BY+BLOCKSIZE*i,BW+1,1)
    for(let i=0;i<BLOCKCOLS+1;i++) ctx.fillRect(BX+BLOCKSIZE*i+gridOffset,BY,1,BH)
    // ctx.globalAlpha = 1
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
    },
    up: {
        pressed:false,
        checked:false
    }
}

function resetKeys() {
    keys.left.pressed = false
    keys.right.pressed = false
}

class Player {
    constructor({x,y},id=0) {
        this.position = {
            x,
            y
        }
        this.velocity = {
            x:0,
            y:1
        }
        this.width = BLOCKSIZE
        this.height = BLOCKSIZE*2-8
        this.jumping = false
        this.colliding = false
        this.direction = 1
        this.acceleration = ACCELERATION
        this.id = id
    }

    draw() {
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
        const spriteframe = [0,0]
        if(playerMoving==0 && this.direction==1) spriteframe.splice(0,2,5,0)
        if(playerMoving==0 && this.direction==0) spriteframe.splice(0,2,4,8)
        if(playerMoving==1) spriteframe.splice(0,2,5,1)
        if(playerMoving==-1) spriteframe.splice(0,2,4,7)
        if(this.jumping==true && this.direction==1) spriteframe.splice(1,1,3)
        if(this.jumping==true && this.direction==0) spriteframe.splice(1,1,5)
        ctx.drawImage(spritemario,spriteframe[0]*100+50-BLOCKSIZE/2,spriteframe[1]*100+50-BLOCKSIZE,32,64,this.position.x,this.position.y-8,32,64)
    }

    jump() {
        this.jumping = true
        this.velocity.y = JUMP
        audiojump.play()
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
        //Bridge
        for(let i=0;i<this.blocks;i++) ctx.drawImage(spritebridge,this.position.x+i*BLOCKSIZE,this.position.y,BLOCKSIZE,BLOCKSIZE)
        //BGO
        ctx.drawImage(spritebgo1,this.position.x,this.position.y-BLOCKSIZE,BLOCKSIZE,BLOCKSIZE)
        for(let i=1;i<this.blocks-1;i++) ctx.drawImage(spritebgo0,this.position.x+i*BLOCKSIZE,this.position.y-BLOCKSIZE,BLOCKSIZE,BLOCKSIZE)
        ctx.drawImage(spritebgo2,this.position.x+(this.blocks-1)*BLOCKSIZE,this.position.y-BLOCKSIZE,BLOCKSIZE,BLOCKSIZE)
    }
}

class Block {
    constructor({x,y},id=0,lava=false) {
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
        this.lava = lava
        this.frame = 0
        this.id = id
    }

    draw() {
        switch(this.id) {
            case 0:
                ctx.drawImage(spriteblock,this.position.x,this.position.y,this.width,this.height)
                break;
            case 1:
                ctx.drawImage(spriteground,this.position.x,this.position.y,this.width,this.height)
                break;
            case 2:
                ctx.drawImage(spritelava,0,BLOCKSIZE*this.frame,BLOCKSIZE,BLOCKSIZE,this.position.x,this.position.y,this.width,this.height)
                tick%8==0 && this.frame++
                if(this.frame==4) this.frame=0
                // ctx.fillStyle = '#c00'
                // ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
                break;
        }
    }
}

let player
const platforms = []
const blocks = []
function parseLevel() {
    player = new Player({x:blockCoord(BX,level.player[0].x),y:blockCoord(BY+BH,level.player[0].y,true)})
    level.platform.forEach(p => platforms.push(new Platform({x:blockCoord(BX,p.x),y:blockCoord(BY+BH,p.y,true)})))
    level.block.forEach(b => blocks.push(new Block({x:blockCoord(BX,b.x),y:blockCoord(BY+BH,b.y,true)},b.id,b.id==2 && true)))
}

let scrollOffset = 0
let scrollDirection = 0
let playerMoving = 0
let tick = 0
let isMobile = 0

function mobileControls() {
    if(isMobile) {
        ctx.fillStyle = 'lightgrey'
        ctx.fillRect(0,BY+BH+200,canvas.width,BH/2)
        ctx.fillStyle = 'grey'
        ctx.fillRect(0,BY+BH+204+BH/2,BX+BW/2,BH/2)
        ctx.fillRect(BX+BW/2+4,BY+BH+204+BH/2,BX+BW/2,BH/2)
        ctx.font = "200px Arial"
        ctx.fillText("^",BW/2,BY+BH*2-100)
        ctx.fillStyle = 'lightgrey'
        ctx.fillText("<",BW/4,BY+BH*2+100)
        ctx.fillText(">",3*BW/4,BY+BH*2+100)
    }

    addEventListener('touchstart'/*mousedown*/,(e) => {
        const xpos = e.changedTouches[0].pageX//.pageX//.originalEvent.touches[0].pageX
        const ypos = e.changedTouches[0].pageY//.pageY//.originalEvent.touches[0].pageY
        if(running && isMobile) {
            if(ypos>BY+BH+200 && ypos<BY+BH+200+BH/2) {
                if(!player.jumping) {
                    player.jump()
                    // player.jumping = true
                    // player.velocity.y = -16//-18//-10
                    // audiojump.play()
                }
            }
            if(ypos>BY+BH+200+BH/2 && xpos<BX+BW/2) {
                keys.left.pressed = true
            }
            if(ypos>BY+BH+200+BH/2 && xpos>BX+BW/2) {
                keys.right.pressed = true
            }
        }
    })

    addEventListener('touchend'/*mouseup*/,(e) => {
        const xpos = e.changedTouches[0].pageX//.pageX//.originalEvent.touches[0].pageX
        const ypos = e.changedTouches[0].pageY//.pageY//.originalEvent.touches[0].pageY
        if(running && isMobile && ypos>BY+BH+200+BH/2) {
            if(keys.left.pressed) {
                keys.left.pressed = false
            }
            if(keys.right.pressed) {
                keys.right.pressed = false
            }
        }
    })
}

// Main function
function animate() {
    if(running) {
        requestAnimationFrame(animate)
        requestAnimationFrame(mobileControls)
    }
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
        function checkCollisionDown(ya,yb,ydiff,x1a=1,x1b=0,x2a=0,x2b=1) {
            if(ya<=yb && ya+ydiff>yb)
                if(x1a>x1b && x2a<x2b)
                    return true
            return false
        }

        function checkCollisionUp(ya,yb,ydiff,x1a,x1b,x2a,x2b) {
            if(ya>=yb && ya+ydiff<yb)
                if(x1a>x1b && x2a<x2b)
                    return true
            return false
        }

        function checkCollisionRight(xa,xb,xdiff,y1a,y1b,y2a,y2b) {
            if(xa<=xb && xa+xdiff>xb)
                if(y1a>y1b && y2a<y2b)
                    return true
            return false
        }

        function checkCollisionLeft(xa,xb,xdiff,y1a,y1b,y2a,y2b) {
            if(xa>=xb && xa+xdiff<xb)
                if(y1a>y1b && y2a<y2b)
                    return true
            return false
        }

        function playerDeath() {
            waluigiRestart()
            cameraReset()
            player = new Player({x:blockCoord(BX,3),y:blockCoord(BY+BH,14,true)})
            audiodied.play()
            // alert("Hai perso")
        }

        // Fall death
        if(checkCollisionDown(player.position.y+player.height,BY+BH+BLOCKSIZE,player.velocity.y))
            playerDeath()

        xdiff = scrollDirection!=0 ? scrollDirection*SPEED : player.velocity.x
        // Lava collision
        blocks.filter(b => b.lava).forEach(b => {
            if(checkCollisionDown(player.position.y+player.height-1,b.position.y,player.velocity.y,player.position.x+player.width,b.position.x,player.position.x,b.position.x+b.width))
                playerDeath()
            if(checkCollisionUp(player.position.y+1,b.position.y+b.height,player.velocity.y,player.position.x+player.width,b.position.x,player.position.x,b.position.x+b.width))
                playerDeath()
            if(checkCollisionRight(player.position.x+player.width,b.position.x,xdiff,player.position.y+player.height,b.position.y,player.position.y,b.position.y+b.height))
                playerDeath()
            if(checkCollisionLeft(player.position.x,b.position.x+b.width,xdiff,player.position.y+player.height,b.position.y,player.position.y,b.position.y+b.height))
                playerDeath()
        })

        // Platform collision
        platforms.forEach(p => {
            if(checkCollisionDown(player.position.y+player.height,p.position.y,player.velocity.y,player.position.x+player.width,p.position.x,player.position.x,p.position.x+p.width))
                player.land(p.position.y)
        })

        // Block collision
        blocks.filter(b => !b.lava).forEach(b => {
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
    playerMoving = 0
    if(keys.right.pressed) playerMoving += 1
    if(keys.left.pressed) playerMoving -= 1
    player.acceleration = ACCELERATION

    if(playerMoving>0 && player.position.x+player.width<BX+BW-SCROLLTHICK) {
        scrollDirection = 0
        player.velocity.x = SPEED
        player.direction = 1
        // if(player.velocity.x==SPEED) player.acceleration = 0
        // if(player.velocity.x<SPEED) player.velocity.x += player.acceleration
        // console.log(player.acceleration,player.velocity.x)
    } else if(playerMoving<0 && player.position.x>BX+SCROLLTHICK) {
        scrollDirection = 0
        player.velocity.x = -SPEED
        player.direction = 0
        // if(player.velocity.x==-SPEED) player.acceleration = 0
        // if(player.velocity.x>-SPEED) player.velocity.x -= player.acceleration
        // console.log(player.acceleration,player.velocity.x)
    } else {
        player.velocity.x = 0
        if(playerMoving>0) {
            scrollDirection = 1
            // scrollOffset += SPEED
            // platforms.forEach(p => p.position.x -= SPEED)
            // blocks.forEach(b => b.position.x -= SPEED)
        } else if(playerMoving<0) {
            scrollDirection = -1
            // scrollOffset -= SPEED
            // platforms.forEach(p => p.position.x += SPEED)
            // blocks.forEach(b => b.position.x += SPEED)
        }
    }

    if(playerMoving==0 && player.velocity.x>0) {
        player.acceleration = ACCELERATION
        player.velocity.x -= player.acceleration
    }
    if(playerMoving==0 && player.velocity.x<0) {
        player.acceleration = ACCELERATION
        player.velocity.x += player.acceleration
    }

    /* --- WARNING: DIRTY CODE --- */
    if(playerMoving==0 && player.velocity.x>-ACCELERATION && player.velocity.x<ACCELERATION) {
        player.acceleration = ACCELERATION
        player.velocity.x = 0
    }
    /* --------------------------- */

    checkCollisions()
    cameraMove()
    scrollDirection=0
    if(keys.up.pressed) {
        if(!keys.up.checked || BOUNCE && !player.jumping) {
            if(!player.jumping || HIPNHOP) {
                player.jump()
            }
        }
        keys.up.checked = true
    }

    // Win scenario
    if(scrollOffset>2000) {
        resetKeys()
        alert('You win!')
        cameraReset()
        player = new Player({x:blockCoord(BX,3),y:blockCoord(BY+BH,14,true)})
    }
    
    // Drawing functions
    /* zIndex=-5 */ ctx.clearRect(0,0,canvas.width,canvas.height)
    /* zIndex=-4 */ drawBackground()
    /* zIndex=-3 */ drawGrid(scrollOffset)
    /* zIndex=-2 */ platforms.forEach(p => p.draw())
    /* zIndex=-1 */ blocks.forEach(b => b.draw())
    /* zIndex=0  */ player.update()
    /* zIndex=+1 */ drawBounds()
    /* zIndex=+2 */ clearOutside()
    /* zIndex=+3 */ printVersion()

    tick==64 ? tick = 0 : tick++
}


function MainGame() {
    waluigi()
    parseLevel()
    animate()
}

//// Event Listeners ////

addEventListener('keydown',({key}) => {
    switch(key) {
        case 'ArrowUp':
            //up
            keys.up.pressed = true
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
            keys.up.pressed = false
            keys.up.checked = false
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
// }