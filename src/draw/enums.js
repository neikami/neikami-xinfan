
import $ from 'jquery'
import {iconFn, ChildFn} from './class'
import {baseConfig} from './public'
import Keyboard from './keyboard'

iconFn.prototype = {
    setBaseConfig: function (target) {
        $('.-board')[0].className = `-board mouse_${this.dataset} ${baseConfig.mouse.class}`
        baseConfig.activeUtil = target
        baseConfig.mouse.cursor = 'default'
        var headUtils = ''
        if(this.headUtil){
            for (const [key, value] of this.headUtil.entries()) {
                headUtils += value.html
            }
        }
        $('.-headUtil').html(headUtils)
    },
}

ChildFn.prototype.add = function () {
    $('.-board').toggleClass(baseConfig.mouse.class)
    baseConfig.mouse.level < baseConfig.mouse.maxLevel && baseConfig.mouse.level++
    baseConfig.mouse.class = 'x' + baseConfig.mouse.level
    $('.-board').toggleClass(baseConfig.mouse.class)
}
ChildFn.prototype.sub = function () {
    $('.-board').toggleClass(baseConfig.mouse.class)
    baseConfig.mouse.level > baseConfig.mouse.minLevel && baseConfig.mouse.level--
    baseConfig.mouse.class = 'x' + baseConfig.mouse.level
    $('.-board').toggleClass(baseConfig.mouse.class)
}

var addSize = new Keyboard(']')
addSize.press = () => {
    if (!baseConfig.activeUtil || (baseConfig.activeUtil.dataset.type != 'pen' && baseConfig.activeUtil.dataset.type != 'rubber')) return
    Enums['pen'].headUtil.get('add')['add']()
}

var subSize = new Keyboard('[')
subSize.press = () => {
    if (!baseConfig.activeUtil || (baseConfig.activeUtil.dataset.type != 'pen' && baseConfig.activeUtil.dataset.type != 'rubber')) return
    Enums['pen'].headUtil.get('sub')['sub']()
}

var addFn = new ChildFn('add', 'layui-icon-addition',`<div class="layui-col-md1">
    <i class="layui-icon layui-icon-addition" data-type="add" style="font-size: 20px;"></i>
</div>`)

var subFn = new ChildFn('sub', 'layui-icon-subtraction',`<div class="layui-col-md1">
    <i class="layui-icon layui-icon-subtraction" data-type="sub" style="font-size: 20px;"></i>
</div>`)

var tleftFn = new ChildFn('tleft', 'layui-icon-align-left',`<div class="layui-col-md1">
    <i class="layui-icon layui-icon-align-left" data-type="left" style="font-size: 20px;"></i>
</div>`)
var tcenterFn = new ChildFn('tcenter', 'layui-icon-align-center',`<div class="layui-col-md1">
    <i class="layui-icon layui-icon-align-center" data-type="center" style="font-size: 20px;"></i>
</div>`)
var trightFn = new ChildFn('right', 'layui-icon-align-right',`<div class="layui-col-md1">
    <i class="layui-icon layui-icon-align-right" data-type="right" style="font-size: 20px;"></i>
</div>`)
var fontsuFn = new ChildFn('fontsu', 'layui-icon-fonts-u',`<div class="layui-col-md1">
    <i class="layui-icon layui-icon-fonts-u" data-type="fontsu" style="font-size: 20px;"></i>
</div>`)
var fontsiFn = new ChildFn('fontsi', 'layui-icon-fonts-i',`<div class="layui-col-md1">
    <i class="layui-icon layui-icon-fonts-i" data-type="fontsi" style="font-size: 20px;"></i>
</div>`)

var penFn = new iconFn('pen', 'layui-icon-edit',new Map([['add',addFn],['sub',subFn]]))
var autosizeFn = new iconFn('autosize', 'layui-icon-screen-full')
var levelFn = new iconFn('level', 'layui-icon-template-1')
var borderFn = new iconFn('border', 'layui-icon-templeate-1')
var textFn = new iconFn('text', 'layui-icon-fonts-i' ,new Map([['tleft',tleftFn],['tcenter',tcenterFn],['tright',trightFn],['fontsu',fontsuFn],['fontsi',fontsiFn]]))
var setFn = new iconFn('set', 'layui-icon-set')
var rubberFn = new iconFn('rubber', 'layui-icon-note',new Map([['add',addFn],['sub',subFn]]))
var pictureFn = new iconFn('picture', 'layui-icon-picture')

export var Enums = {
    pen: penFn,
    autosize: autosizeFn,
    level: levelFn,
    border: borderFn,
    text: textFn,
    set: setFn,
    rubber: rubberFn,
    picture: pictureFn
}
