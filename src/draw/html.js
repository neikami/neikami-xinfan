// 全局模版
export var html = ({headUtil='',plane=''})=>{
return `<div class="layui-container -draw">\
            <div class="layui-row -headUtil">\
                ${headUtil}
            </div>\
            <div class="layui-row">\
                <div class="layui-col-md2">\
                    <div class="-plane">\
                        <div class="layui-row">\
                            ${plane}
                        </div>\
                    </div>\
                </div>\
                <div class="layui-col-md10">\
                    <div class="-board">\
                        <canvas id="canvas"></canvas>\
                        <canvas class="Layer"></canvas>\
                    </div>\
                </div>\
            </div>\
        </div>`
}