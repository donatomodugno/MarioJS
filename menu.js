

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

class ButtonBlock {
    constructor(callback,text,x,y,zoom=2,centered=true,textzoom=1) {
        this.position = {
            x,
            y
        }
        this.zoom = zoom
        this.textzoom = textzoom
        this.width = ((text.length*18-2)*textzoom+48)*zoom
        this.height = 64*zoom
        this.xoffset = centered ? -this.width/2-2*textzoom : -24*zoom
        this.yoffset = centered ? -this.height/2 : -24*zoom
        this.text = text
        this.centered = centered
        this.style = 0
        this.callback = callback
    }

    drawLight() {
        ctx.globalAlpha = 0.1
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x+this.xoffset,this.position.y+this.yoffset,this.width,this.height)
        ctx.globalAlpha = 1
    }

    drawDark() {
        ctx.globalAlpha = 0.2
        ctx.fillStyle = 'black'
        ctx.fillRect(this.position.x+this.xoffset,this.position.y+this.yoffset,this.width,this.height)
        ctx.globalAlpha = 1
    }

    drawBlock() {
        ctx.imageSmoothingEnabled = false
        ctx.drawImage(spriteblock,0,0,12,32,this.position.x-(this.text.length/2*18*this.centered*this.textzoom+24)*this.zoom,this.position.y-(24+8*this.centered)*this.zoom,24*this.zoom,64*this.zoom)
        this.text.split("").forEach((c,i) => ctx.drawImage(spriteblock,12,0,10,32,this.position.x+(i-this.text.length/2*this.centered)*18*this.textzoom*this.zoom,this.position.y-(24+8*this.centered)*this.zoom,18*this.zoom*this.textzoom,64*this.zoom))
        ctx.drawImage(spriteblock,20,0,12,32,this.position.x+(this.text.length/(1+this.centered)*18-2)*this.textzoom*this.zoom,this.position.y-(24+8*this.centered)*this.zoom,24*this.zoom,64*this.zoom)
    }

    checkMouse() {
        canvas.style.cursor = 'default'
        if(!running) {
            if(mouse.x>this.position.x+this.xoffset && mouse.x<this.position.x+this.width+this.xoffset-4 && mouse.y>this.position.y+this.yoffset && mouse.y<this.position.y+this.height+this.yoffset) {
                canvas.style.cursor = 'pointer'
                if(mouse.left.pressed) this.style = 2
                else this.style = 1
            }
            else {
                canvas.style.cursor = 'default'
                this.style = 0
            }
        
            if(mouse.left.pressed) {
                if(mouse.x>this.position.x+this.xoffset && mouse.x<this.position.x+this.width+this.xoffset-4 && mouse.y>this.position.y+this.yoffset && mouse.y<this.position.y+this.height+this.yoffset) this.style = 2
            }

            addEventListener('mouseup',({pageX,pageY}) => {
                if(pageX>this.position.x+this.xoffset && pageX<this.position.x+this.width+this.xoffset && pageY>this.position.y+this.yoffset && pageY<this.position.y+this.height+this.yoffset) this.callback()
            })
        }
    }

    draw() {
        this.checkMouse()
        this.drawBlock()
        drawText(this.text,this.position.x,this.position.y,this.zoom*this.textzoom,this.centered)
        if(this.style == 1) this.drawLight()
        if(this.style == 2) this.drawDark()
    }
}