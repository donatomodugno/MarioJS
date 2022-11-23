// Global functions

function printVersion() {
    ctx.font = '10px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(CORNERLABEL,BX-BTHICK+2,BY+BH+BTHICK-2)
}

function musicPlay() {
    music.loop = true
    music.volume = "0.2"
    music.play()
}

function musicStop() {
    music.pause();
    music.currentTime = 0;
}

function musicRestart() {
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
    function infiniteBackground(sprite,spritexoffset,spriteyoffset,width,zoom=1,factor=1) {
        ctx.drawImage(sprite,spritexoffset,spriteyoffset,width,BH/zoom,BX-(scrollOffset/factor)%(width*zoom),BY,width*zoom,BH)
        ctx.drawImage(sprite,spritexoffset,spriteyoffset,width,BH/zoom,BX-(scrollOffset/factor)%(width*zoom)+width*zoom,BY,width*zoom,BH)
    }
    function tiledBackground(sprite,xoffset,yoffset,width,height,zoom=1) {
        // ctx.filter = "blur(5px)"
        for(let i=0;i*height*zoom<BH;i++)
            for(let j=0;j*width*zoom<BW;j++)
                ctx.drawImage(sprite,xoffset,yoffset,width,height,BX+j*width*zoom,BY+i*height*zoom,width*zoom,height*zoom)
        // ctx.filter = "blur()"
    }

    let gradient = ctx.createLinearGradient(0,0,0,BH)
    gradient.addColorStop(0,'#fdd')
    gradient.addColorStop(1,'#ddf')
    ctx.fillStyle = gradient//'#ddd'
    ctx.fillRect(BX,BY,BW,BH)
    tiledBackground(sprites[12],0,BLOCKSIZE,64,239,3)
    infiniteBackground(sprites[11],0,16*3,512,4,4)
    ctx.drawImage(sprites[10],0,4*13,1792,BH/4,BX-scrollOffset/2,BY,1792*4,BH)
}

function clearOutside() {
    ctx.clearRect(0,0,BX-BTHICK,canvas.height)
    ctx.clearRect(BX+BW+BTHICK-1,0,canvas.width-BX-BW-BTHICK,canvas.height)
    ctx.clearRect(BX-BTHICK,0,BW+BTHICK*2,BY-BTHICK)
    ctx.clearRect(BX-BTHICK,BY+BH+BTHICK,BW+BTHICK*2,canvas.height-BY-BH-BTHICK)
}

function drawGrid(opacity=1) {
    const gridOffset = -scrollOffset%BLOCKSIZE
    ctx.globalAlpha = opacity
    ctx.fillStyle = "#ccc"
    for(let i=0;i<BLOCKROWS;i++) ctx.fillRect(BX,BY+BLOCKSIZE*i,BW+1,1)
    for(let i=0;i<BLOCKCOLS+1;i++) ctx.fillRect(BX+BLOCKSIZE*i+gridOffset,BY,1,BH)
    ctx.globalAlpha = 1
}

function blockCoord(offset,pos,inverted=false) {
    if(inverted) return offset-BLOCKSIZE*(pos+1)
    return offset+BLOCKSIZE*pos
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
        this.ducking = false
        this.direction = 1
        this.acceleration = ACCELERATION
        this.frames = 1
        this.frame = 0
        this.id = id
    }

    draw() {
        // ctx.fillStyle = 'red'
        // ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
        const spriteframe = []
        // if(playerMoving==0 && this.direction==1) spriteframe.splice(0,2,5,0)
        // if(playerMoving==0 && this.direction==0) spriteframe.splice(0,2,4,8)
        // if(playerMoving!=0 && !this.jumping) this.frames = 2
        // else this.frames = 1
        // if(playerMoving==1) spriteframe.splice(0,2,5,1,5,0)
        // if(playerMoving==-1) spriteframe.splice(0,2,4,7,4,8)
        // if(this.jumping && this.direction==1) spriteframe[1]=3//.splice(1,1,3)
        // if(this.jumping && this.direction==0) spriteframe[1]=5//.splice(1,1,5)
        // if(this.frames == 1) ctx.drawImage(spritemario,spriteframe[0]*100+50-BLOCKSIZE/2,spriteframe[1]*100+50-BLOCKSIZE,32,64,this.position.x,this.position.y-8,32,64)
        // else {
        //     tick%8==0 && this.frame++
        //     if(this.frame==this.frames) this.frame = 0
        //     ctx.drawImage(spritemario,spriteframe[this.frame*2]*100+50-BLOCKSIZE/2,spriteframe[this.frame*2+1]*100+50-BLOCKSIZE,32,64,this.position.x,this.position.y-8,32,64)
        // }
        if(playerMoving==0 && this.direction==1) spriteframe.splice(0,2,0,0)
        if(playerMoving==0 && this.direction==0) spriteframe.splice(0,2,4,0)
        if(playerMoving!=0 && !this.jumping) this.frames = 3
        else this.frames = 1
        if(playerMoving==1) spriteframe.splice(0,2,0,0,1,0,2,0)
        if(playerMoving==-1) spriteframe.splice(0,2,4,0,5,0,6,0)
        if(this.jumping && this.direction==1) spriteframe.splice(0,2,0,1)
        if(this.jumping && this.direction==0) spriteframe.splice(0,2,4,1)
        if(this.ducking && this.direction==1) spriteframe.splice(0,2,0,3)
        if(this.ducking && this.direction==0) spriteframe.splice(0,2,4,3)

        if(this.frames == 1) ctx.drawImage(sprites[0],spriteframe[0]*64,spriteframe[1]*64,32,64,this.position.x,this.position.y-8,32,64)
        else {
            tick%4==0 && this.frame++
            if(this.frame==this.frames) this.frame = 0
            ctx.drawImage(sprites[0],spriteframe[this.frame*2]*64,spriteframe[this.frame*2+1]*64,32,64,this.position.x,this.position.y-8,32,64)
        }
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

    duck() {
        this.ducking = true
    }

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y += GRAVITY
        this.draw()
    }
}

class Platform {
    constructor({x,y,n}) {
        this.position = {
            x,
            y
        }
        this.startpos = {
            x,
            y,
        }
        this.blocks = n
        this.width = BLOCKSIZE*this.blocks
        this.height = BLOCKSIZE
    }

    draw() {
        //Bridge
        for(let i=0;i<this.blocks;i++) ctx.drawImage(sprites[6],this.position.x+i*BLOCKSIZE,this.position.y,BLOCKSIZE,BLOCKSIZE)
        //BGO
        ctx.drawImage(sprites[8],this.position.x,this.position.y-BLOCKSIZE,BLOCKSIZE,BLOCKSIZE)
        for(let i=1;i<this.blocks-1;i++) ctx.drawImage(sprites[7],this.position.x+i*BLOCKSIZE,this.position.y-BLOCKSIZE,BLOCKSIZE,BLOCKSIZE)
        ctx.drawImage(sprites[9],this.position.x+(this.blocks-1)*BLOCKSIZE,this.position.y-BLOCKSIZE,BLOCKSIZE,BLOCKSIZE)
    }
}

class Block {
    constructor({x,y},id=0,lava=false,width=BLOCKSIZE,height=BLOCKSIZE) {
        this.position = {
            x,
            y,
        }
        this.startpos = {
            x,
            y,
        }
        this.width = width
        this.height = height
        this.lava = lava
        this.frame = 0
        this.id = id
    }

    draw() {
        switch(this.id) {
            case 0:
                ctx.drawImage(sprites[1],this.position.x,this.position.y,this.width,this.height)
                break;
            case 1:
                ctx.drawImage(sprites[2],this.position.x,this.position.y,this.width,this.height)
                break;
            case 2:
                // ctx.fillStyle = '#c00'
                // ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
                ctx.drawImage(sprites[3],0,BLOCKSIZE*this.frame,BLOCKSIZE,BLOCKSIZE,this.position.x,this.position.y,this.width,this.height)
                tick%8==0 && this.frame++
                if(this.frame==4) this.frame=0
                break;
            case 3:
                ctx.drawImage(sprites[4],this.position.x,this.position.y,this.width,this.height)
                break;
            case 4:
                ctx.drawImage(sprites[5],this.position.x,this.position.y,this.width,this.height)
                break;
        }
    }
}

class NPC {
    constructor({x,y},id=0) {
        this.position = {
            x,
            y,
        }
        this.startpos = {
            x,
            y,
        }
        this.velocity = {
            x: id>0 ? -1 : 0,
            y:1
        }
        this.width = BLOCKSIZE
        this.height = BLOCKSIZE*(id>0 ? 1 : 2)
        this.frame = 0
        this.alive = true
        this.visible = true
        this.id = id
    }

    draw() {
        if(this.visible) {
            switch(this.id) {
                case 0:
                    // Win
                    ctx.drawImage(sprites[13],0,0,16,32,this.position.x,this.position.y,this.width,this.height)
                    break;
                case 1:
                    if(this.alive) {
                        ctx.drawImage(sprites[14],0,32*this.frame,32,32,this.position.x,this.position.y,this.width,this.height)
                        tick%8==0 && this.frame++
                        if(this.frame>=2) this.frame=0
                    } else {
                        this.frame = 2
                        ctx.drawImage(sprites[14],0,64,32,32,this.position.x,this.position.y,this.width,this.height)
                    }
                    break;
                case 2:
                    break;
            }
        }
    }

    death() {
        this.alive = false
        switch(this.id) {
            case 0:
                // Win
                break;
            case 1:
                audiostomp.play()
                setTimeout(() => this.visible = false,2000)
                break;
            case 2:
                break;
        }
    }

    update() {
        if(this.alive) {
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
            this.velocity.y += GRAVITY
        }
        this.draw()
    }
}

let player
let platforms = []
let blocks = []
let npc = []
function parseLevel() {
    player = new Player({x:blockCoord(BX,level1.player[0].x),y:blockCoord(BY+BH,level1.player[0].y,true)})
    platforms = []
    blocks = []
    npc = []
    level1.platform.forEach(p => platforms.push(new Platform({x:blockCoord(BX,p.x),y:blockCoord(BY+BH,p.y,true),n:p.n})))
    level1.block.forEach(b => blocks.push(new Block({x:blockCoord(BX,b.x),y:blockCoord(BY+BH,b.y,true)},b.id,b.id==2/* && true*/,b.width,b.height)))
    level1.npc.forEach(e => npc.push(new NPC({x:blockCoord(BX,e.x),y:blockCoord(BY+BH,e.y,true)},e.id)))
}
let scrollOffset = 0
let scrollDirection = 0
let playerMoving = 0

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
}

function cameraMove() {
    scrollOffset += scrollDirection*SPEED
    platforms.forEach(p => p.position.x -= scrollDirection*SPEED)
    blocks.forEach(b => b.position.x -= scrollDirection*SPEED)
    npc.forEach(e => e.position.x -= scrollDirection*SPEED)
}

function cameraReset() {
    scrollOffset = 0
    platforms.forEach(p => p.position.x = p.startpos.x)
    blocks.forEach(b => b.position.x = b.startpos.x)
    npc.forEach((e,i) => {
        e.position.x = blockCoord(BX,level1.npc[i].x)
        e.position.y = blockCoord(BY+BH,level1.npc[i].y,true)
        e.velocity.x = level1.npc[i].id>0 ? -1 : 0
    })
}

function playerDeath() {
    // alert("Hai perso")
    audiodied.play()
    musicRestart()
    parseLevel()
    scrollOffset = 0
}

function playerWin() {
    resetKeys()
    alert('Thank you Mario but the princess is in another castle!')
    musicRestart()
    parseLevel()
    scrollOffset = 0
}

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

function checkIntersection2D(x1a,x1b,x2a,x2b,y1a,y1b,y2a,y2b) {
    if(x1a>x1b && x2a<x2b)
        if(y1a>y1b && y2a<y2b)
            return true
    return false
}

// function polling() {
//     timestamps.filter(t => t.time<=Date.now()).forEach(t => t.callback())
//     timestamps = timestamps.filter(t => t.time>Date.now())
// }

// function delay(millis,callback) {
//     timestamps.push({time:Date.now()+millis,callback:callback})
// }

// Main function
function animate() {
    if(running) {
        requestAnimationFrame(animate)
        requestAnimationFrame(mobileControls)
    }
    tick==63 ? tick = 0 : tick++
    // if(timestamps.length>0) polling()
    // console.log(npc.filter(e => e.id==0)[0].position.y)
    
    player.jumping = true
    player.colliding = false
    player.ducking = false

    function checkCollisions() {
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
            npc.forEach(e => {
                if(checkCollisionDown(e.position.y+e.height,p.position.y,e.velocity.y,e.position.x+e.width,p.position.x,e.position.x,p.position.x+p.width))
                    e.velocity.y = 0
            })
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
            npc.forEach(e => {
                if(checkCollisionDown(e.position.y+e.height,b.position.y,e.velocity.y,e.position.x+e.width,b.position.x,e.position.x,b.position.x+b.width))
                    e.velocity.y = 0
                if(checkCollisionRight(e.position.x+e.width,b.position.x,e.velocity.x,e.position.y+e.height,b.position.y,e.position.y,b.position.y+b.height)
                || checkCollisionLeft(e.position.x,b.position.x+b.width,e.velocity.x,e.position.y+e.height,b.position.y,e.position.y,b.position.y+b.height))
                    e.velocity.x = -e.velocity.x
            })
        })

        // Goomba death
        npc.filter(e => e.id==1 && e.alive==true).forEach(e => {
            if(checkCollisionDown(player.position.y+player.height,e.position.y,player.velocity.y,player.position.x+player.width,e.position.x,player.position.x,e.position.x+e.width))
                e.death()
            if(checkCollisionRight(player.position.x+player.width,e.position.x,player.velocity.x-e.velocity.x,player.position.y+player.height,e.position.y,player.position.y,e.position.y+e.height)
            || checkCollisionLeft(player.position.x,e.position.x+e.width,player.velocity.x-e.velocity.x,player.position.y+player.height,e.position.y,player.position.y,e.position.y+e.height)
            || checkCollisionUp(player.position.y,e.position.y+e.height,player.velocity.y-e.velocity.y,player.position.x+player.width,e.position.x,player.position.x,e.position.x+e.width))
                playerDeath()
        });

        // Win scenario
        npc.filter(e => e.id==0).forEach(e => {
            if(checkIntersection2D(player.position.x+player.width,e.position.x,player.position.x,e.position.x+e.width,player.position.y+player.height,e.position.y,player.position.y,e.position.y+e.height))
                playerWin()
        });
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
    if(!keys.up.pressed && player.jumping)
        if(player.velocity.y<0)
            player.velocity.y+=1
    if(keys.down.pressed) {
        player.duck()
    }

    // // Win scenario
    // if(scrollOffset>2000) {
    //     resetKeys()
    //     alert('You win!')
    //     cameraReset()
    //     player = new Player({x:blockCoord(BX,3),y:blockCoord(BY+BH,14,true)})
    // }
    
    // Drawing functions
    /* zIndex=-5 */ ctx.clearRect(0,0,canvas.width,canvas.height)
    /* zIndex=-4 */ drawBackground()
    /* zIndex=-3 */ drawGrid(0.2)
    /* zIndex=-2 */ platforms.forEach(p => p.draw())
    /* zIndex=-1 */ blocks.forEach(b => b.draw())
    /* zIndex=0  */ player.update()
    /* zIndex=+1 */ npc.forEach(e => e.update())
    /* zIndex=+2 */ drawBounds()
    /* zIndex=+3 */ clearOutside()
    /* zIndex=+4 */ printVersion()
}

function MainGame() {
    musicPlay()
    parseLevel()
    animate()
}

addEventListener('mousedown',(e) => {
    // console.log('debug')
})