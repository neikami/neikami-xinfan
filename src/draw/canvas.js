import {baseConfig} from './public'
import {Enums} from './enums'
export class Canvas {
    constructor (elem, width, height) {
        this.elem = document.getElementById(elem)
        this.elem.width = width
        this.elem.height = height
        
        this.ctx = this.elem.getContext('2d')

        // 全局偏移
        this.pos = this.getAbsCoordinates(this.elem)

        // 当前位置
        this.ox1 = 0
        this.oy1 = 0

        this.maxx 
        this.maxy
        this.minx 
        this.miny

        // 点击事件
        this.downHandel = e => {
            // 默认记录 当前点击位置
            this.penWeight = baseConfig.mouse.level * 3;
            // 全局偏移 + 画笔偏移
            this.cx = this.pos.left - this.penWeight / 2
            this.cy = this.pos.top - this.penWeight / 2
            // 点击位置
            this.ox = e.clientX - this.cx;
            this.oy = e.clientY - this.cy;

            // 当前点击 最大最小点
            this.maxx = this.minx = this.ox
            this.maxy = this.miny = this.oy

            // 点击事件执行函数
            this.mousedown(e)

            // 点击事件之后监听移动事件
            this.moveHandel = e => {
                // 默认记录当前位置
                this.ox1 = e.clientX - this.cx;
                this.oy1 = e.clientY - this.cy;

                // 记录鼠标移动最大偏移
                if (this.ox1 > this.ox && this.ox1 > this.maxx) {
                    this.maxx = this.ox1
                }
                if (this.ox1 < this.ox && this.ox1 < this.minx) {
                    this.minx = this.ox1
                }

                if (this.oy1 > this.oy && this.oy1 > this.maxy) {
                    this.maxy = this.oy1
                }
                if (this.oy1 < this.oy && this.oy1 < this.miny) {
                    this.miny = this.oy1
                }

                // 移动事件执行函数
                this.mousemove(e)
                e.preventDefault();
            } 

            // 点击事件之后监听up事件
            this.upHandel = e => {
                // up事件执行函数
                this.mouseup(event)
                this.ctx.stroke();
                if (baseConfig.activeUtil && baseConfig.activeUtil.dataset.type == 'pen') {
                    baseConfig.actionArea = [this.minx - this.penWeight, this.miny - this.penWeight, Math.abs(this.maxx - this.minx) + this.penWeight * 2, Math.abs(this.maxy - this.miny) + this.penWeight * 2]
                    this.createPoints()
                    // this.ctx.strokeRect(...baseConfig.actionArea);
                }
                this.ctx.closePath();

                // 取消up move事件订阅
                this.unsubscribe()
                // 记录历史记录 当记录数>10 删除第一个
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
    createPoints () {
        var border = 20
        var leftTop = baseConfig.actionArea[0] - border / 2
        var leftCenter = this.maxx - baseConfig.actionArea[0]
        console.log(baseConfig.actionArea)
        console.log(leftTop)
        // this.ctx.strokeRect(baseConfig.actionArea[0], baseConfig.actionArea[1] + 10,20,20);

    }
    // 清空
    clearCanvas (area) {
        if(!area) area = [0,0,this.elem.width,this.elem.height]
        this.ctx.clearRect(...area);
    }
    // 点击执行函数
    mousedown (e) {
        if (!baseConfig.activeUtil) {
            return
        }
        var type = baseConfig.activeUtil.dataset.type

        this.ctx.beginPath();

        if (type == 'pen') {
            this.drawPlane(e)
        }
        if (type == 'rubber') {
            this.rubberClear(e)
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
    // 移动工具
    autosize (e) {
        // this.ctx.beginPath()
        var isScale = false
        var inborder = false
        var imgData= this.ctx.getImageData(...baseConfig.actionArea);
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
                if(baseConfig.img){
                    this.ctx.drawImage(baseConfig.img, ...baseConfig.actionArea);
                } else {
                    // this.clearCanvas(baseConfig.actionArea)
                    this.ctx.putImageData(imgData,baseConfig.actionArea[0],baseConfig.actionArea[1],0,0,baseConfig.actionArea[2],baseConfig.actionArea[3]);
                }
            }
            Enums.autosize.cb('cell')
        }
    }
    rubberClear (e) {
        this.mousemove = (e) => {
            this.clearCanvas([this.ox1 - this.penWeight / 2,this.oy1 - this.penWeight / 2,this.penWeight, this.penWeight])
        }
    }
    // 画笔与橡皮擦 橡皮擦默认#fff颜色
    drawPlane (e) {
        var penColor = baseConfig.foreground;

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
    // 线段工具
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
    // 递归获取边距
    getAbsCoordinates (e) {
        var pos = {top: 0, left: 0};
        while(e){
            pos.left += e.offsetLeft;
            pos.top += e.offsetTop;
            e=e.offsetParent;
        }
        return pos;
    }
    // 区域判断
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