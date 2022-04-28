import $ from 'jquery'
import 'layui-src'
import '../node_modules/layui-src/src/css/layui.css' 
import {Canvas} from './draw/canvas'
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

var injectLayui = (canvas,ctx) => {
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
                    ctx.beginPath()
                    var imageItem = new Image();
                    imageItem.src = result;
                    imageItem.crossOrigin = 'Anonymous';
                    var imgW = 100,imgH = 100
                    baseConfig.actionArea = [canvas.width / 2 - imgW / 2, canvas.height / 2 - imgH / 2, imgW, imgH]
                    imageItem.onload = function () {
                        ctx.drawImage(imageItem, ...baseConfig.actionArea);
                    }
                    ctx.closePath()
                    ctx.save()
                    baseConfig.img = imageItem
                    $('.layui-icon-screen-full').click()
                });
            }
          });
    })

}

var App = () => {
    tempEditer()
    var _c = new Canvas('canvas', $('.-board').width(), $('.-board').height())
    var canvas = _c.elem;
    var ctx = _c.ctx; // 创建渲染
    injectLayui(canvas,ctx)
}

export default App