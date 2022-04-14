import { PIXI } from '../plugin/pixi.js';
import keyConfig from '../utils/key'
export default class Sprite {
    constructor() {
        this.resources = null
        this.getSprite = () => {
            return this._Sprite
        }
        this.setSprite = (resources) => {
            this.resources = resources
            this._Sprite = new PIXI.Sprite(resources)
            this._Sprite.moveDelta = {
                x: 0,
                y: 0
            }
            return this
        }
        return this
    }
    playerInit({
        x, y, gravity = 0, moveSpeed = 1
    }) {
        this._Sprite.x = x;
        this._Sprite.y = y;

        this._Sprite.anchor.x = 0.5;
        this._Sprite.anchor.y = 0.5;

        this._Sprite.moveDelta.y = gravity

        this._Sprite.moveSpeed = moveSpeed;

        return this
    }
    setKeys(Application) {
        var keys = new keyConfig(['a', 'd', 'j', 'k'])
        // keys.setKeys('a')
        // keys.setKeys('d')

        // keys.setKeys('j')
        // keys.setKeys('k')
        var ldirection = -1
        var rdirection = 1
        keys.getKey('a').press = () => {
            Application.player.moveDelta.x = Application.player.moveSpeed * ldirection;
            Application.player.moveXposition = ldirection
        }
        keys.getKey('a').release = () => {
            Application.player.moveDelta.x = 0;
        }

        keys.getKey('d').press = () => {
            Application.player.moveDelta.x = Application.player.moveSpeed * rdirection;
            Application.player.moveXposition = rdirection
        }
        keys.getKey('d').release = () => {
            Application.player.moveDelta.x = 0;
        }

        keys.setDo('j').do(() => {
            Application.player.moveDelta['y'] = -1;
        }).do(() => {
            Application.player.moveDelta['y'] = 1;
        })

        keys.setDo('k').do(() => {
            if (Application.bulletList[Application.bulletIndex]) {
                Application.bulletIndex++
            }
            Application.bulletList[Application.bulletIndex] = new Sprite().setSprite(this.resources).playerInit({ x: Application.player.x, y: Application.player.y }).getSprite()
            Application.app.stage.addChild(Application.bulletList[Application.bulletIndex]);
            Application.bulletList[Application.bulletIndex].moveXposition = Application.player.moveXposition
        })

        keys.getKey('k').longTap = () => {
            if (Application.bulletList[Application.bulletIndex]) {
                Application.bulletIndex++
            }
            Application.bulletList[Application.bulletIndex] = new Sprite().setSprite(this.resources).playerInit({ x: Application.player.x, y: Application.player.y }).getSprite()
            Application.app.stage.addChild(Application.bulletList[Application.bulletIndex]);
            Application.bulletList[Application.bulletIndex].width *= 10
            Application.bulletList[Application.bulletIndex].height *= 10
            Application.bulletList[Application.bulletIndex].moveXposition = Application.player.moveXposition
        }
        return this
    }
    roadareaInit(roadarea) {
        return roadarea
    }
}