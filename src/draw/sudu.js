import {baseConfig} from './public'
export class Canvas {
    constructor (elem, width, height) {
        this.elem = document.getElementById(elem)
        this.elem.width = width
        this.elem.height = height
        
        this.ctx = this.elem.getContext('2d')

        this.pos = this.getAbsCoordinates(this.elem)
        // 当前位置
        this.ox1 = 0
        this.oy1 = 0


        this.len = baseConfig.length
        this.htemp = this.elem.height / this.len
        this.wtemp = this.elem.width / this.len

        // 点击事件
        this.downHandel = e => {
            // 全局偏移 + 画笔偏移
            this.cx = this.pos.left
            this.cy = this.pos.top
            // 点击位置
            this.ox = e.clientX - this.cx;
            this.oy = e.clientY - this.cy;

            // 点击事件执行函数
            this.mousedown(e)

            // 点击事件之后监听up事件
            this.upHandel = e => {
                // 取消up move事件订阅
                this.unsubscribe()

                event.preventDefault();
            } 
            this.elem.addEventListener(
                "mouseup", this.upHandel, false
            );
            event.preventDefault();
        }

        this.elem.addEventListener(
            "mousedown", this.downHandel, false
        );
        this.unsubscribe = () => {
            this.elem.removeEventListener("mouseup", this.upHandel);
        };

        this.initLine()
    }
    // 清空
    clearCanvas (area) {
        if(!area) area = [0,0,this.elem.width,this.elem.height]
        this.ctx.clearRect(...area);
    }
    // 点击
    mousedown (e) {
        var x = Math.floor(e.layerX / this.wtemp)
        var y = Math.floor(e.layerY / this.htemp)
        var area = baseConfig.area.get('x' + x + 'y' + y)
        if (this.checkVal(x ,y , baseConfig.activeNumber)) {
            for (let [key, value] of baseConfig.errArea.entries()) {
                console.log(value)
                this.ctx.fillStyle="red";
                this.ctx.fillRect(value.x + 2, value.y + 2, this.wtemp - 4, this.htemp - 4)
                this.drawText(value, true)
            }
            baseConfig.errArea.clear()
            console.log(baseConfig.errArea)
            return
        }
        area.value = baseConfig.activeNumber
        this.drawText(area)
    }
    // 校验重复
    checkVal (x, y, activeNumber) {
        var bool = false
        for (let i = 0; i < this.len; i++) {
            if (i != x) {
                if(baseConfig.area.get('x' + i + 'y' + y).value && baseConfig.area.get('x' + i + 'y' + y).value == activeNumber) {
                    bool = true
                    // baseConfig.errArea.set('x' + i + 'y' + y, {...baseConfig.area.get('x' + i + 'y' + y)})
                }
            }
            if (i != y) {
                if(baseConfig.area.get('x' + x + 'y' + i).value && baseConfig.area.get('x' + x + 'y' + i).value == activeNumber) {
                    bool = true
                    // baseConfig.errArea.set('x' + x + 'y' + i, {...baseConfig.area.get('x' + x + 'y' + i)})
                }
            }
        }

        var row =  Math.floor((x) / 3) 
        var col =  Math.floor((y) / 3)
        for (let i = row * 3; i < ((1 + row )* 3); i++) {
            for (let j = col * 3; j < ((1 + col)* 3); j++) {
                if(baseConfig.area.get('x' + i + 'y' + j).value && baseConfig.area.get('x' + i + 'y' + j).value == activeNumber) {
                    bool = true
                    // baseConfig.errArea.set('x' + i + 'y' + y, {...baseConfig.area.get('x' + i + 'y' + y)})
                }
            }
        }
        if(bool) baseConfig.area.get('x' + x + 'y' + y).value = activeNumber,baseConfig.errArea.set('x' + x + 'y' + y, {...baseConfig.area.get('x' + x + 'y' + y)})
        return bool
    }
    // 写入
    drawText (area, error) {
        this.ctx.fillStyle = '#000'
        if (!error) {this.clearCanvas([area.x + 1, area.y + 1, this.wtemp - 2, this.htemp - 2])}else{
            this.ctx.fillStyle = '#fff'
        }
        this.ctx.beginPath();
        this.ctx.font="30px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif";
        this.ctx.fillText(baseConfig.activeNumber,(area.x + this.wtemp / 2 - 10), (area.y + this.htemp / 2 + 10));
        this.ctx.closePath();
    }
    initLine(){
        this.ctx.beginPath();
        for (let i = 1; i <= this.len; i++) {
            // 竖线 1/10 宽度为x 整个高度为y
            this.ctx.moveTo(i * this.wtemp,0);
            this.ctx.lineTo(i * this.wtemp, this.elem.height);
            // 横线 1/10 高度为x 整个宽度为y
            this.ctx.moveTo(0,i * this.htemp);
            this.ctx.lineTo(this.elem.width, i * this.htemp);
        }
        for (let i = 0; i < this.len; i++) {
            var x = i * this.wtemp
            for (let j = 0; j < this.len; j++) {
                var y = j * this.htemp
                var obj = {
                    x: i * this.wtemp,
                    y: y,
                    value: null
                }
                baseConfig.area.set('x' + i + 'y' + j, obj)
            }
        }
        this.ctx.stroke();

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
}