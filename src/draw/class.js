export var iconFn = function (dataset, _class, headUtil = []) {
    this.dataset = dataset
    this._class = _class
    this.headUtil = headUtil
}
export var ChildFn = function (dataset, _class, html = '') {
    this.html = html
    iconFn.call(this, dataset, _class);
}