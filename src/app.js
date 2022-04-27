import $ from 'jquery'
import 'layui-src'
import '../node_modules/layui-src/src/css/layui.css' 
import {html} from './draw/html'
import {baseConfig} from './draw/public'
import {Enums} from './draw/enums'
var tempEditer = () => {
    let plane = ''
    baseConfig.controllList.forEach(ele=>{
        plane += `<div class="layui-col-md6">
            <i class="layui-icon ${Enums[ele]._class}" data-type="${ele}" style="font-size: 30px;"></i>
        </div>`
    })
    document.body.innerHTML = html({plane: plane});
}

var injectLayui = (ctx) => {
    layui.use('colorpicker', function(){
        var colorpicker = layui.colorpicker;
        colorpicker.render({
            color: '#000', //设置默认色
            elem: '.foreground',
            done: function(color){
                baseConfig.foreground = color
                //譬如你可以在回调中把得到的 color 赋值给表单
            }
        });
        colorpicker.render({
            elem: '.backdrop',
            done: function(color){
                baseConfig.backdrop = color
                //譬如你可以在回调中把得到的 color 赋值给表单
            }
        });
    });

    $(".layui-container").on('click',".layui-col-md6 .layui-icon",function(e){
        $(baseConfig.activeUtil).parent().toggleClass('actived')
        Enums[e.currentTarget.dataset.type].setBaseConfig(e.currentTarget)
        $(e.currentTarget).parent().toggleClass('actived')
    })
    $(".layui-container").on('click',".layui-col-md1 .layui-icon",function(e){
        var currentTarget = e.currentTarget
        var type = currentTarget.dataset.type
        Enums[baseConfig.activeUtil.dataset.type].headUtil.get(type)[type](currentTarget)
    })
    layui.use('upload',function (){
        var upload = layui.upload
        upload.render({
            elem: '.layui-icon-picture'
            ,url: 'https://httpbin.org/post' //此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
            ,before: function(obj){
                obj.preview(function(index, file, result){
                    var imageItem = new Image();
                    imageItem.src = result;
                    imageItem.crossOrigin = 'Anonymous';
                    imageItem.onload = function () {
                        ctx.drawImage(imageItem, 100, 100, 100, 100);
                    }
                });
            }
          });
    })

}

var draw = (canvas, ctx) => {
    var pos = getAbsCoordinates(canvas)
    $('.-board').mousedown(function(e){
        e=e||window.event;
        if (!baseConfig.activeUtil) {
            return
        }
        var penColor = baseConfig.activeUtil.dataset.type == 'rubber' ? '#fff' : baseConfig.foreground;
        var penWeight = baseConfig.mouse.level * 3;
        ctx.strokeStyle= penColor;
        ctx.lineWidth = penWeight;
        ctx.beginPath();
        var ox=e.clientX - pos.left + penWeight / 2;
        var oy=e.clientY - pos.top + penWeight / 2;
        ctx.moveTo(ox,oy);
        canvas.onmousemove=function(e){
            var ox1=e.clientX - pos.left + penWeight / 2;
            var oy1=e.clientY - pos.top + penWeight / 2;
            ctx.lineTo(ox1,oy1);
            ctx.stroke();
        }
        canvas.onmouseup=function(){
            canvas.onmousemove=null;
            ctx.closePath();
            if (baseConfig.history.length>10) {
                baseConfig.history.shift()
            }
            baseConfig.history.push(ctx.getImageData(0, 0, $('.-board').width(), $('.-board').height()))
        }
    })
}
var getAbsCoordinates = (e) =>{
    var pos = {top: 0, left: 0};
    while(e){
        pos.left += e.offsetLeft;
        pos.top += e.offsetTop;
        e=e.offsetParent;
    }
    return pos;
};
var App = () => {
    tempEditer()

    var canvas = document.getElementById('canvas');
    canvas.width = $('.-board').width(); // canvas宽度
    canvas.height = $('.-board').height(); // canvas的高度
    var ctx = canvas.getContext('2d'); // 创建渲染

    injectLayui(ctx)

    draw(canvas, ctx)
}

export default App