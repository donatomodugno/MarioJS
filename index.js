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

function drawText(text,x,y,zoom=1,centered=true) {
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    text.split("").forEach((c,i) => {
        const j = alphabet.indexOf(c.toUpperCase())
        if(j>=0) {
            if(centered) ctx.drawImage(font,2,(j+32)*32,18,16,x+(i*18-text.length/2*18)*zoom,y-8*zoom,18*zoom,16*zoom)//zoom ? ctx.drawImage(font,2,(j+32)*32,18,16,x+(i*18-text.length/2*18)*zoom,y-8*zoom,18*zoom,16*zoom) : ctx.drawImage(font,2,(j+32)*32,18,16,x+(i*18-text.length/2*18),y-8,18,16)
            else ctx.drawImage(font,2,(j+32)*32,18,16,x+i*18*zoom,y,18*zoom,16*zoom)//zoom ? ctx.drawImage(font,2,(j+32)*32,18,16,x+i*18*zoom,y,18*zoom,16*zoom) : ctx.drawImage(font,2,(j+32)*32,18,16,x+i*18,y,18,16)
        }
    });
}

function buttonBlock(callback,text,x,y,centered) {
    ctx.imageSmoothingEnabled = false
    const zoom = 2
    const width = (text.length*18+48)*zoom
    const height = 64*zoom
    const xoffset = centered ? -width/2 : -24*zoom
    const yoffset = centered ? -height/2 : -24*zoom

    function drawLight() {
        ctx.globalAlpha = 0.1
        ctx.fillStyle = 'white'
        ctx.fillRect(x+xoffset,y+yoffset,236,128)
        ctx.globalAlpha = 1
        console.log("entrato")
    }

    function drawDark() {
        ctx.globalAlpha = 0.2
        ctx.fillStyle = 'black'
        ctx.fillRect(x+xoffset,y+yoffset,236,128)
        ctx.globalAlpha = 1
    }

    if(centered) {
        ctx.drawImage(spriteblock,0,0,12,32,x-(text.length/2*18+24)*zoom,y-32*zoom,24*zoom,64*zoom)
        text.split("").forEach((c,i) => ctx.drawImage(spriteblock,12,0,10,32,x-((text.length/2-i)*18)*zoom,y-32*zoom,18*zoom,64*zoom))
        ctx.drawImage(spriteblock,20,0,12,32,x+(text.length/2*18-2)*zoom,y-32*zoom,24*zoom,64*zoom)
    } else {
        ctx.drawImage(spriteblock,0,0,12,32,x-24*zoom,y-24*zoom,24*zoom,64*zoom)
        text.split("").forEach((c,i) => ctx.drawImage(spriteblock,12,0,10,32,x+i*18*zoom,y-24*zoom,18*zoom,64*zoom))
        ctx.drawImage(spriteblock,20,0,12,32,x+(text.length*18-2)*zoom,y-24*zoom,24*zoom,64*zoom)
    }
    drawText(text,x,y,2,centered)
    if(btnstyle == 1) drawLight()
    if(btnstyle == 2) drawDark()
    
    addEventListener('mousemove',({pageX,pageY}) => {
        canvas.style.cursor = 'default'
        if(!running) {
            if(pageX>x+xoffset && pageX<x+width+xoffset-4 && pageY>y+yoffset && pageY<y+height+yoffset) {
                canvas.style.cursor = 'pointer'
                if(mousedown) btnstyle = 2
                else btnstyle = 1
            }
            else {
                canvas.style.cursor = 'default'
                btnstyle = 0
            }
        }
    })

    addEventListener('mousedown',({pageX,pageY}) => {
        if(!running) {
            mousedown = true
            if(pageX>x+xoffset && pageX<x+width+xoffset-4 && pageY>y+yoffset && pageY<y+height+yoffset) btnstyle = 2
        }
        // {
            // if(pageX>x+xoffset && pageX<x+width+xoffset && pageY>y+yoffset && pageY<y+height+yoffset) btnstyle = 2
            // else btnstyle = 1
        // }
    })

    addEventListener('mouseup',({pageX,pageY}) => {
        if(!running) {
            mousedown = false
            if(pageX>x+xoffset && pageX<x+width+xoffset && pageY>y+yoffset && pageY<y+height+yoffset) callback()
        }
    })
}

function drawMenu() {
    buttonBlock(() => runGame(),"Play",BX+BW/2,BY+BH/2,true)
    drawText("Or press space",BX+BW/2,BY+BH/2+200)
    drawBounds()
    printVersion()

    addEventListener('keydown',({key}) => {
        if(key==' ' || key=='Enter'/*  || key=='0' */) runGame()
    })
}

function animateMenu() {
    if(!running) requestAnimationFrame(animateMenu)
    drawMenu()
}

function Menu() {
    animateMenu()
}

// if(checkAssets())

// setTimeout(() => Menu(),500) //dirty code

window.addEventListener("load",() => {
    isMobile = navigator.userAgent.toLowerCase().match(/mobile/i);
    // if (true) {
    //     alert("Is mobile device");
    // }
    // else { alert("Not mobile device"); }
    Menu()
});