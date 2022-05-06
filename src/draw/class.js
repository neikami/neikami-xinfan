// 基础类
// 左侧边功能
export var iconFn = function (dataset, _class, headUtil = []) {
    this.dataset = dataset
    this._class = _class
    this.headUtil = headUtil
}
// 头部子功能
export var ChildFn = function (dataset, _class, html = '') {
    this.html = html
    iconFn.call(this, dataset, _class);
}