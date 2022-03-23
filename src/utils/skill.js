var skill = function() {
    let _this = {};
    _this.skill = null
    _this.map = [
        'ddj'
    ]
    _this.keyarr = []
        //The `downHandler`
    _this.downHandler = event => {
        if (_this.keyarr.length < 3) {
            _this.keyarr.push(event.key)
        } else if (_this.keyarr.length == 3) {
            _this.keyarr.shift()
            _this.keyarr.push(event.key)
        }
        if (_this.map.indexOf(_this.keyarr.join('')) !== -1 && _this.skill) {
            _this.skill()
            _this.keyarr = []
        }
    };

    //Attach event listeners
    const downListener = _this.downHandler.bind(_this);

    window.addEventListener(
        "keydown", downListener, false
    );

    // Detach event listeners
    _this.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
    };

    return _this;
}

export { skill }