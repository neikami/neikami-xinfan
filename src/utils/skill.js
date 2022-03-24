var skill = function(moveDelta) {
    let _this = {};
    _this.skill = null
    _this.map = [
        'ddj',
        'aaj',
    ]
    var isSkill = false;
    _this.displacement = function(position, offset) {
        if (!isSkill) {
            new Promise((resolve, reject) => {
                moveDelta[position] = offset;
                isSkill = true
                setTimeout(() => {
                    resolve()
                }, 300);
            }).then(() => {
                isSkill = false
                moveDelta[position] = 0;
            })
        }
    }
    _this.mapTree = {
        'ddj': () => {
            _this.displacement('x', 5)
        },
        'aaj': () => {
            _this.displacement('x', -5)
        }
    }
    _this.keyarr = []
        //The `downHandler`
    _this.downHandler = event => {
        if (_this.keyarr.length < 3) {
            _this.keyarr.push(event.key)
        } else if (_this.keyarr.length == 3) {
            _this.keyarr.shift()
            _this.keyarr.push(event.key)
        }
        var _key = _this.keyarr.join('')
        if (_this.map.indexOf(_key) !== -1 && _this.skill) {
            _this.skill()
            _this.keyarr = []
        } else if (_this.mapTree[_key]) {
            _this.mapTree[_key]()
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