// Main menu

let running = false
let btnstyle = 0
let mousedown = false

function runGame() {
    if(!running) {
        running = true
        MainGame()
    }
}

//----//

// function buttonBlock(callback,text,x,y,zoom=2,centered=true) {
//     ctx.imageSmoothingEnabled = false
//     const width = (text.length*18+48)*zoom
//     const height = 64*zoom
//     const xoffset = centered ? -width/2 : -24*zoom
//     const yoffset = centered ? -height/2 : -24*zoom

//     function drawLight() {
//         ctx.globalAlpha = 0.1
//         ctx.fillStyle = 'white'
//         ctx.fillRect(x+xoffset,y+yoffset,236,128)
//         ctx.globalAlpha = 1
//     }

//     function drawDark() {
//         ctx.globalAlpha = 0.2
//         ctx.fillStyle = 'black'
//         ctx.fillRect(x+xoffset,y+yoffset,236,128)
//         ctx.globalAlpha = 1
//     }

//     // function drawBlock() {
//     //     if(centered) {
//     //         ctx.drawImage(spriteblock,0,0,12,32,x-(text.length/2*18+24)*zoom,y-32*zoom,24*zoom,64*zoom)
//     //         text.split("").forEach((c,i) => ctx.drawImage(spriteblock,12,0,10,32,x-((text.length/2-i)*18)*zoom,y-32*zoom,18*zoom,64*zoom))
//     //         ctx.drawImage(spriteblock,20,0,12,32,x+(text.length/2*18-2)*zoom,y-32*zoom,24*zoom,64*zoom)
//     //     } else {
//     //         ctx.drawImage(spriteblock,0,0,12,32,x-24*zoom,y-24*zoom,24*zoom,64*zoom)
//     //         text.split("").forEach((c,i) => ctx.drawImage(spriteblock,12,0,10,32,x+i*18*zoom,y-24*zoom,18*zoom,64*zoom))
//     //         ctx.drawImage(spriteblock,20,0,12,32,x+(text.length*18-2)*zoom,y-24*zoom,24*zoom,64*zoom)
//     //     }
//     // }

//     function drawBlock() {
//         ctx.drawImage(spriteblock,0,0,12,32,x-(text.length/2*18*centered+24)*zoom,y-(24+8*centered)*zoom,24*zoom,64*zoom)
//         text.split("").forEach((c,i) => ctx.drawImage(spriteblock,12,0,10,32,x+(i-text.length/2*centered)*18*zoom,y-(24+8*centered)*zoom,18*zoom,64*zoom))
//         ctx.drawImage(spriteblock,20,0,12,32,x+(text.length/(1+centered)*18-2)*zoom,y-(24+8*centered)*zoom,24*zoom,64*zoom)
//     }

//     function draw() {
//         drawBlock()
//         drawText(text,x,y,zoom,centered)
//         if(btnstyle == 1) drawLight()
//         if(btnstyle == 2) drawDark()
        
//         canvas.style.cursor = 'default'
//         if(!running) {
//             if(mouse.x>x+xoffset && mouse.x<x+width+xoffset-4 && mouse.y>y+yoffset && mouse.y<y+height+yoffset) {
//                 canvas.style.cursor = 'pointer'
//                 if(mousedown) btnstyle = 2
//                 else btnstyle = 1
//             }
//             else {
//                 canvas.style.cursor = 'default'
//                 btnstyle = 0
//             }
            
//             // mousedown = true
//             if(mouse.left.pressed) {
//                 if(!mousedown) mousedown = true
//                 if(mouse.x>x+xoffset && mouse.x<x+width+xoffset-4 && mouse.y>y+yoffset && mouse.y<y+height+yoffset) btnstyle = 2
//             }
            
//             // mousedown = false
//             if(!mouse.left.pressed && mousedown) {
//                 mousedown = false
//                 if(mouse.x>x+xoffset && mouse.x<x+width+xoffset && mouse.y>y+yoffset && mouse.y<y+height+yoffset) callback()
//             }
//             // console.log(mouse.left.pressed,mouse.left.checked)
//         }
//     }

//     draw()
// }

function drawMenu() {
    // buttonBlock(() => runGame(),"Play",BX+BW/2,BY+BH/2,2,true)
    const btn = new ButtonBlock(() => runGame(),"Play",BX+BW/2,BY+BH/2,2,true)
    btn.draw()
    drawText("Or press space",BX+BW/2,BY+BH/2+200,1.5)
    drawBounds()
    printVersion()

    // addEventListener('keydown',({key}) => {
    //     if(key==' ' || key=='Enter'/*  || key=='0' */) runGame()
    // })
}

function animateMenu() {
    if(!running) requestAnimationFrame(animateMenu)
    drawMenu()
}

function Menu() {
    animateMenu()
}

//// Event Listeners ////

window.addEventListener("load",() => {
    // Where everything starts
    isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
    Menu()
})

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
    if(key==' ' || key=='Enter'/*  || key=='0' */) runGame()
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
    
addEventListener('mousemove',({pageX,pageY}) => {
    mouse.x = pageX
    mouse.y = pageY
})

addEventListener('mousedown',({pageX,pageY}) => {
    mouse.left.pressed = true
    if(!mouse.left.checked) mouse.left.checked = true
    else mouse.left.checked = false
    mouse.left.x = pageX
    mouse.left.y = pageY
})

addEventListener('mouseup',({pageX,pageY}) => {
    mouse.left.pressed = false
    if(!mouse.left.checked) mouse.left.checked = true
    else mouse.left.checked = false
    mouse.left.x = pageX
    mouse.left.y = pageY
})

addEventListener('touchstart'/*mousedown*/,(e) => {
    const xpos = e.changedTouches[0].pageX//.pageX//.originalEvent.touches[0].pageX
    const ypos = e.changedTouches[0].pageY//.pageY//.originalEvent.touches[0].pageY
    if(running && isMobile) {
        if(ypos>BY+BH+200 && ypos<BY+BH+200+BH/2) {
            if(!player.jumping) player.jump()
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