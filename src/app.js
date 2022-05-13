import $ from 'jquery'
import 'layui-src'
import '../node_modules/layui-src/src/css/layui.css' 
import {Canvas} from './draw/sudu'
import {baseConfig} from './draw/public'
import {html} from './draw/html'
// 页面模板
var tempEditer = () => {
    let plane = `<div class="layui-col-md6">
        <span class="layui-badge">${baseConfig.activeNumber}</span>
    </div>`
    document.body.innerHTML = html({plane: plane});
}
// 入口
var App = () => {
    // 注入模板
    tempEditer()
    // 实例化canvas
    var _c = new Canvas('canvas', $('.-board').width(), $('.-board').height())
    var canvas = _c.elem;
    var ctx = _c.ctx; // 创建渲染
    var downListener = e => {
        if (/[1-9]/.test(e.key)) {
            $('.layui-badge').html(e.key)
            baseConfig.activeNumber = e.key
        }
    }
    window.addEventListener(
        "keydown", downListener, false
    );
}

export default App