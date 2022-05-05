import {baseConfig} from './public'
import {Enums} from './enums'
export class Canvas {
    constructor (elem, width, height) {
        this.elem = document.getElementById(elem)
        this.elem.width = width
        this.elem.height = height

        
        this.ctx = this.elem.getContext('2d')

        this.pos = this.getAbsCoordinates(this.elem)

        this.ox1 = 0
        this.oy1 = 0

        this.downHandel = e => {
            this.penWeight = baseConfig.mouse.level * 3;
            // 全局偏移 + 画笔偏移
            this.cx = this.pos.left - this.penWeight / 2
            this.cy = this.pos.top - this.penWeight / 2
            // 点击位置
            this.ox = e.clientX - this.cx;
            this.oy = e.clientY - this.cy;

            this.mousedown(e)

            this.moveHandel = e => {
                // 当前位置
                this.ox1 = e.clientX - this.cx;
                this.oy1 = e.clientY - this.cy;
                this.mousemove(e)
                e.preventDefault();
            } 
            this.upHandel = event => {

                this.mouseup(event)

                this.ctx.stroke();
                this.ctx.closePath();

                this.unsubscribe()

                if (baseConfig.history.length>10) {
                    baseConfig.history.shift()
                }
                baseConfig.history.push(this.ctx.getImageData(0, 0, this.elem.width, this.elem.height))

                event.preventDefault();
            } 
            this.elem.addEventListener(
                "mouseup", this.upHandel, false
            );
            this.elem.addEventListener(
                "mousemove", this.moveHandel, false
            );
            event.preventDefault();
        } 


        this.elem.addEventListener(
            "mousedown", this.downHandel, false
        );
        this.unsubscribe = () => {
            this.elem.removeEventListener("mouseup", this.upHandel);
            this.elem.removeEventListener("mousemove", this.moveHandel);
        };
    }
    clearCanvas () {
        this.ctx.clearRect(0,0,this.elem.width,this.elem.height);
    }
    mousedown (e) {
        if (!baseConfig.activeUtil) {
            return
        }
        var type = baseConfig.activeUtil.dataset.type

        this.ctx.beginPath();

        if (type == 'pen' || type == 'rubber') {
            this.drawPlane(e)
        }
        if (type == 'autosize') {
            this.autosize(e)
        }
        if (type == 'line') {
            this.drawLine(e)
        }
    }
    mousemove (e) {

    }
    mouseup (e) {

    }

    autosize (e) {
        // this.ctx.beginPath()
        var isScale = false
        var inborder = false
        console.log(baseConfig.actionArea)
        if (this.bbox(this.ox,this.oy,...baseConfig.actionArea,0.9)) {
            this.ctx.clearRect(...baseConfig.actionArea);
            inborder = true
        } else if (this.bbox(this.ox,this.oy,...baseConfig.actionArea)) {
            Enums.autosize.cb('cell')
            isScale = true
            inborder = true
        }
        this.mousemove = (e) => {

        }
        this.mouseup = (e) => {
            if ((this.ox1 || this.oy1) && inborder) {
                if(!isScale){
                    baseConfig.actionArea[0] = baseConfig.actionArea[0] + (this.ox1 - this.ox)
                    baseConfig.actionArea[1] = baseConfig.actionArea[1] + (this.oy1 - this.oy)
                } else {
                    this.ctx.clearRect(...baseConfig.actionArea);
                    if ((this.ox1 - this.ox) < 0) baseConfig.actionArea[0] = baseConfig.actionArea[0] - Math.abs(this.ox1 - this.ox)
                    if ((this.oy1 - this.oy) < 0) baseConfig.actionArea[1] = baseConfig.actionArea[1] - Math.abs(this.oy1 - this.oy)
                    baseConfig.actionArea[2] = baseConfig.actionArea[2] + Math.abs(this.ox1 - this.ox)
                    baseConfig.actionArea[3] = baseConfig.actionArea[3] + Math.abs(this.oy1 - this.oy)
                }
                this.ctx.drawImage(baseConfig.img, ...baseConfig.actionArea);
            }
            Enums.autosize.cb('cell')
        }
    }

    drawPlane (e) {
        var penColor = baseConfig.activeUtil.dataset.type == 'rubber' ? '#fff' : baseConfig.foreground;

        this.ctx.strokeStyle= penColor;
        this.ctx.lineWidth = this.penWeight;
        this.ctx.moveTo(this.ox,this.oy);

        this.mousemove = (e) => {
            this.ctx.lineTo(this.ox1,this.oy1);
            this.ctx.stroke();
        }

        this.mouseup = () => {
            if (!this.ox1 && !this.oy1) {
                this.ctx.lineTo(this.ox+1, this.oy+1);
                this.ctx.stroke();
            }
        }
    }

    drawLine (e) {
        var penColor =  baseConfig.foreground;
        this.ctx.strokeStyle= penColor;
        this.mousemove = (e) => {
            this.ctx.moveTo(this.ox,this.oy);
        }
        this.mouseup = () => {
            this.ctx.lineTo(this.ox1,this.oy1);
        }
    }

    getAbsCoordinates (e) {
        var pos = {top: 0, left: 0};
        while(e){
            pos.left += e.offsetLeft;
            pos.top += e.offsetTop;
            e=e.offsetParent;
        }
        return pos;
    }

    bbox(x,y, px, py, width,height, scale = 1) {
        var ow = Math.ceil(width * (1 - scale) / 2)
        var oy = Math.ceil(height * (1 - scale) / 2)
        var pw = width * scale
        var ph = height * scale
        var maxborder = 10
        if (ow > maxborder) ow = maxborder, pw = width - maxborder * 2
        if (oy > maxborder) oy = maxborder, py = height - maxborder * 2
        return x > px  + ow && x < px + pw - ow && y > py + oy && y < py +ph - oy 
    }

}