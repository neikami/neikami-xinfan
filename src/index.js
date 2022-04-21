import $ from 'jquery'
import 'layui-src'
import JSZip from 'jszip'
import {saveAs} from 'file-saver'
layui.config({
    dir: '../node_modules/layui-src/', 　//layui.js 所在路径（注意，如果是script单独引入layui.js，无需设定该参数。），一般情况下可以无视
})

import '../node_modules/layui-src/src/css/layui.css' 

import './style.css';
var html = '<div class="layui-upload">\
<div class="layui-upload-list" style="max-width: 1500px;">\
    <table class="layui-table">\
        <colgroup>\
            <col width="200">\
            <col width="150">\
            <col width="150">\
            <col width="150">\
        </colgroup>\
        <thead>\
            <tr>\
                <th>文件名</th>\
                <th>大小</th>\
                <th>文件类型</th>\
                <th>最后修改时间</th>\
            </tr>\
        </thead>\
        <tbody id="getUploadFileInfo">\
        </tbody>\
    </table>\
    <div class="layui-progress" lay-showpercent="true">\
        <div class="layui-progress-bar" lay-percent="0%" id="progressbar"></div>\
    </div>\
    <div>\
    <div class="layui-row">\
    <div class="layui-col-xs3 layui-col-sm3 layui-col-md3"><input id="boderSize" type="text" placeholder="边框范围 0-100 先输入后上传" autocomplete="off" class="layui-input"></div>\
    <div class="layui-col-xs1 layui-col-sm1 layui-col-md1"><input id="xpos" type="text" placeholder="x偏移量" autocomplete="off" class="layui-input"></div>\
    <div class="layui-col-xs1 layui-col-sm1 layui-col-md1"><input id="ypos" type="text" placeholder="y偏移量" autocomplete="off" class="layui-input"></div>\
    <div class="layui-col-xs1 layui-col-sm1 layui-col-md1"><input id="cborder" value="10" type="text" placeholder="子边框大小" autocomplete="off" class="layui-input"></div>\
    <div class="layui-col-xs4 layui-col-sm4 layui-col-md4">\
    <button class="layui-btn" onclick=\"downloadZip(this)\">下载</button>\
    <button class="layui-btn" onclick=\"reshow(this)\">重新生成</button>\
    <button class="layui-btn" onclick=\"remove(this)\">清除图片</button>\
    <button class="layui-btn layui-btn-primary layui-border-blue" onclick=\"goText(this)\">文字检索</button>\
    </div>\
    </div>\
    <div class="layui-row">\
    <div class="layui-col-xs6 layui-col-sm6 layui-col-md6"><input type="file" onchange=\"fileBg(this)\"  class="layui-btn"></div>\
    <div class="layui-col-xs6 layui-col-sm6 layui-col-md6"><input type="file" multiple onchange=\"fileSelect(this)\"  class="layui-btn layui-btn-primary layui-border-green"></div>\
    </div>\
    <div id="canvass"></div>\
    </div>\
</div>\
</div>'
var img = document.createElement('img');
var imgarr = []
document.body.innerHTML = html;
/**
* 合并图片
* @param images 图片路径数组
* @param callback
*/
function drawImage(images, bg, callback) {
    if (!images || images.length == 0) {
        return false;
    }
    var borderSize = document.querySelector('#boderSize').value / 100
    var option = {
        width: bg.width, // 每个图片的宽
        height: bg.height, // 每个图片的高
        borderSize: borderSize || 0.01, // 边框范围
        encoderOptions: 0.8 // 拼出来的图片的质量，0-1之间，越大质量越好
    }
    var imageCount = images.length; // 图片数量

    // 已绘制的图片数(onload和onerror为异步)
    var drawCount = 0;

    // 遍历图片路径数组
    images.forEach(function (img, index) {
        var canvas = document.createElement('canvas'); // 创建canvas元素
        canvas.id = 'canvas'+index
        canvas.width = option.width; // canvas宽度
        canvas.height = option.height; // canvas的高度
        var context = canvas.getContext('2d'); // 创建渲染
        // 设置背景为白色
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        var imageItem = new Image();
        imageItem.src = img;
        // 跨域
        imageItem.crossOrigin = 'Anonymous';
        // 计算图片x坐标
        var xAxis = 0
        // 计算图片y坐标
        var yAxis = 0

        var xpos = Number(document.querySelector('#xpos').value)
        var ypos = Number(document.querySelector('#ypos').value)
        var cborder = Number(document.querySelector('#cborder').value)
        // 图片加载成功，绘制图片
        imageItem.onload = function () {
            context.drawImage(bg, xAxis, yAxis, option.width, option.height);
            // 添加边框
            if (cborder){
                context.fillStyle = '#000';
                context.fillRect(xpos + xAxis + option.width * option.borderSize - cborder / 2, ypos + yAxis + option.height * option.borderSize - cborder / 2, option.width * (1-option.borderSize*2) + cborder, option.height * (1-option.borderSize*2) + cborder);
            }
            context.drawImage(imageItem,
                xpos + xAxis + option.width * option.borderSize,
                ypos + yAxis + option.height * option.borderSize, 
                option.width * (1-option.borderSize*2),
                option.height * (1-option.borderSize*2),
            );
            drawCount++;

        //     // canvas返回base64数据
            callback(canvas.toDataURL('image/jpeg', option.encoderOptions));
            if(index == 0){
                if($('#canvass').innerHTML != ''){
                    $('#canvass').html('')
                }
                $('#canvass').append(canvas)
            }
        }
        // 图片加载失败，绘制空白
        imageItem.onerror = function () {
            drawCount++;
            if (drawCount === imageCount) {
                // canvas返回base64数据
                callback(canvas.toDataURL('image/jpeg', option.encoderOptions));
            }
        }
    });
}

function dataURLtoFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}

window.fileSelect = function (fileInput) {
    new Promise((resolve,reject)=>{
        for (let i = 0; i < fileInput.files.length; i++) {
            var file = fileInput.files[i]
            if (!file) {
                alert("请选择文件");
                return false;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("选择的文件过大!!请不要超过2M");
                return false;
            }

            //显示加载相关的文件信息
            var msg = document.getElementById("getUploadFileInfo");
            var html = "";
            html += '<td>' + file.name + '</td>';
            html += '<td>' + (file.size/(1024 * 1024)).toFixed(2) + ' M </td>';
            html += '<td>' + file.type + '</td>';
            html += '<td>' + file.lastModifiedDate + '</td>';
            msg.innerHTML += html;
            //初始化进度条
            document.getElementById("progressbar").setAttribute("style", "width:0%;")
            //创建FileReader对象
            var reader = new FileReader();

            //读取操作开始事件
            reader.onloadstart = function(e) {
                document.getElementById("progressbar").setAttribute("style", "width:1%;")
            };
            //读取操作进行中事件
            reader.onprogress = function(e) {
                var percentLoaded = Math.round((e.loaded / e.total) * 100);
                if (percentLoaded < 100) {
                    var info = "width:" + percentLoaded + "%;";
                    document.getElementById("progressbar").setAttribute("style", info);
                }
            };
            //读取完操作事件
            reader.onload = function(e) {
                document.getElementById("progressbar").setAttribute("style", "width:100%;")
                var base64 = e.target.result;
                var _img = document.createElement('img');
                _img.src = base64;
                imgarr.push(base64)
                // document.body.appendChild(_img);
                if (i == fileInput.files.length - 1) {
                    setTimeout(() => {
                        resolve()
                    }, 1000);
                }
            };
            reader.readAsDataURL(fileInput.files[i])
        }
    }).then(() => {
        reshow()
    }).catch((err) => console.log(err));
}


window.fileBg = function (fileInput) {
    new Promise((resolve,reject)=>{
        var file = fileInput.files[0]
        if (!file) {
            alert("请选择文件");
            return false;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("选择的文件过大!!请不要超过2M");
            return false;
        }

        //显示加载相关的文件信息
        var msg = document.getElementById("getUploadFileInfo");
        var html = "";
        html += '<td>背景：' + file.name + '</td>';
        html += '<td>' + (file.size/(1024 * 1024)).toFixed(2) + ' M </td>';
        html += '<td>' + file.type + '</td>';
        html += '<td>' + file.lastModifiedDate + '</td>';
        msg.innerHTML = html;
        imgarr = []
        $('#canvass').html('')
        //初始化进度条
        document.getElementById("progressbar").setAttribute("style", "width:0%;")
        //创建FileReader对象
        var reader = new FileReader();

        //读取操作开始事件
        reader.onloadstart = function(e) {
            document.getElementById("progressbar").setAttribute("style", "width:1%;")
        };
        //读取操作进行中事件
        reader.onprogress = function(e) {
            var percentLoaded = Math.round((e.loaded / e.total) * 100);
            if (percentLoaded < 100) {
                var info = "width:" + percentLoaded + "%;";
                document.getElementById("progressbar").setAttribute("style", info);
            }
        };
        //读取完操作事件
        reader.onload = function(e) {
            document.getElementById("progressbar").setAttribute("style", "width:100%;")
            var base64 = e.target.result;
            img.src = base64;
            setTimeout(() => {
                resolve()
            }, 1000);
        };
        reader.readAsDataURL(file)
    })
}   
window.reshow = function () {
    download = []
    drawImage(imgarr,img,function (data){
        download.push(dataURLtoFile(data, (new Date().getTime()+'').substr(5,10)))
    })
}
window.remove = function (){
    download = []
    var msg = document.getElementById("getUploadFileInfo");
    msg.innerHTML = '';
    imgarr = []
    $("input[type='file']").val("");
    $('#canvass').html('')
}
var download = []
window.downloadZip = function (){
    var zip = new JSZip();
    download.map(ele=>{
        zip.file(ele.name, ele);
    })
    zip.generateAsync({type:"blob"}).then(function(content) {
        // see FileSaver.js
        saveAs(content, "picture.zip");
    });
}
window.goText = function () {
    window.location.href = './other.html'
}