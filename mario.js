// Global functions

function printVersion() {
    ctx.font = '10px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText("MarioJS "+VERSION,BX-BTHICK+2,BY+BH+BTHICK-2)
}

function waluigi() {
    music.loop = true
    music.volume = "0.2"
    music.play()
}

function musicStop() {
    music.pause();
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
    let gradient = ctx.createLinearGradient(0,0,0,BH)
    gradient.addColorStop(0,'#fdd')
    gradient.addColorStop(1,'#ddf')
    ctx.fillStyle = gradient//'#ddd'//gradient
    ctx.fillRect(BX,BY,BW,BH)
}

function clearOutside() {
    ctx.clearRect(0,0,BX-BTHICK,canvas.height)
    ctx.clearRect(BX+BW+BTHICK,0,canvas.width-BX-BW-BTHICK,canvas.height)
    ctx.clearRect(BX-BTHICK,0,BW+BTHICK*2,BY-BTHICK)
    ctx.clearRect(BX-BTHICK,BY+BH+BTHICK,BW+BTHICK*2,canvas.height-BY-BH-BTHICK)
}

    // Functions and classes

    function drawGrid() {
        const gridOffset = -scrollOffset%BLOCKSIZE
        ctx.fillStyle = "#ccc"
        for(let i=0;i<BLOCKROWS;i++) ctx.fillRect(BX,BY+BLOCKSIZE*i,BW+1,1)
        for(let i=0;i<BLOCKCOLS+1;i++) ctx.fillRect(BX+BLOCKSIZE*i+gridOffset,BY,1,BH)
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
            for(let i=0;i<this.blocks;i++) ctx.drawImage(spritebridge,this.position.x+i*32,this.position.y,BLOCKSIZE,BLOCKSIZE)
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
            ctx.fillText("^",BX+BW/2,BY+BH*2-100)
            ctx.fillStyle = 'lightgrey'
            ctx.fillText("<",BX,BY+BH*2+200)
            ctx.fillText(">",BX*2+BW/2,BY+BH*2+200)
        }

        addEventListener('touchstart'/*mousedown*/,(e) => {
            const xpos = e.changedTouches[0].pageX//.pageX//.originalEvent.touches[0].pageX
            const ypos = e.changedTouches[0].pageY//.pageY//.originalEvent.touches[0].pageY
            if(running && isMobile) {
                if(ypos>BY+BH+200 && ypos<BY+BH*2+200) {
                    if(!player.jumping) {
                        player.jumping = true
                        player.velocity.y = -16//-18//-10
                        audiojump.play()
                    }
                }
                if(ypos>BY+BH*2+200 && xpos<BX+BW/2) {
                    keys.left.pressed = true
                }
                if(ypos>BY+BH*2+200 && xpos>BX+BW/2) {
                    keys.right.pressed = true
                }
            }
        })

        addEventListener('touchend'/*mouseup*/,(e) => {
            const xpos = e.changedTouches[0].pageX//.pageX//.originalEvent.touches[0].pageX
            const ypos = e.changedTouches[0].pageY//.pageY//.originalEvent.touches[0].pageY
            if(running && isMobile) {
                if(ypos>BY+BH*2+200 && xpos<BX+BW/2) {
                    keys.left.pressed = false
                }
                if(ypos>BY+BH*2+200 && xpos>BX+BW/2) {
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
            function checkCollisionDown(ya,yb,ydiff,x1a,x1b,x2a,x2b) {
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
                cameraReset()
                player = new Player({x:blockCoord(BX,3),y:blockCoord(BY+BH,14,true)})
                audiodied.play()
                // alert("Hai perso")
                music.pause()
            }

            // Fall death
            if(player.position.y+player.height<=BY+BH && player.position.y+player.height+player.velocity.y>BY+BH) {
                playerDeath()
            }

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

        // Win scenario
        if(scrollOffset>600) {
            resetKeys()
            alert('you win')
            cameraReset()
            player = new Player({x:blockCoord(BX,3),y:blockCoord(BY+BH,14,true)})
        }
        
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
// }