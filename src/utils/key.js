import * as __ from './init'
import Keyboard from './keyboard'
export default class KeyConfig {
    constructor(arg) {
        this.keys = {}
        this.step = {}
        this.key = ''
        for (let i = 0; i < arg.length; i++) {
            var key = arg[i]
            this.setKeys(key)
        }
        return this
    }
    setDo(key) {
        this.do = (fn) => {
            this.step[key].step.push(fn)
            return this
        }
        this.doThis = (fn) => {
            if (!fn) fn = (() => { })
            return fn
        }
        return this
    }
    getKey(key) {
        return this.keys[key]
    }
    setKeys(key) {
        this.key = key
        this.keys[key] = new Keyboard(key)
        this.step[key] = {
            key: key,
            step: []
        }
        var isKeyPressed = false
        var isKeyDblPressed = false
        var timer = null
        this.keys[key].press = () => {
            if (isKeyDblPressed) return false
            clearTimeout(timer)
            new Promise((resolve, reject) => {
                if (!isKeyPressed) {
                    this.doThis(this.step[key].step[0])()
                    isKeyPressed = true
                    timer = setTimeout(() => {
                        resolve()
                    }, __.jumpInterval);
                } else {
                    if (!isKeyDblPressed) {
                        this.doThis(this.step[key].step[0])()
                        isKeyDblPressed = true
                        timer = setTimeout(() => {
                            resolve()
                        }, __.jumpInterval * 2);
                    }
                }
            }).then(() => {
                this.doThis(this.step[key].step[1])()
                clearTimeout(timer)
                timer = setTimeout(() => {
                    isKeyPressed = false
                    isKeyDblPressed = false
                }, isKeyDblPressed ? __.jumpInterval * 2 : __.jumpInterval);
            })
        };
        this.keys[key].release = () => {

        }
        this.keys[key].longTap = () => {

        }
        return this
    }
}
