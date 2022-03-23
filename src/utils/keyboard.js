var keyboard = function(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.longTap = undefined;

    key.isLongTap = false
    key.time = null
        //The `downHandler`
    key.downHandler = event => {
        if (event.key === (key.value.split(' ')[0])) {
            if (!key.isLongTap && !key.time && (key.value.split(' ')[1])) {
                key.time = +new Date()
            }
            console.log((key.value.split(' ')[1]))
            if (!key.isUp && !key.isLongTap && key.longTap && new Date() - key.time > 300 && (key.value.split(' ')[1])) {
                key.longTap()
                key.isLongTap = true
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
                return
            }
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            // if (key.isDown && key.longTap && key.isLongTap) key.longTap()
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            if ((key.value.split(' ')[1])) {
                key.time = null
                key.isLongTap = false
            }
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}

export { keyboard }