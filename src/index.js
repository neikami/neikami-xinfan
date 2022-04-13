import _ from 'lodash';
import './style.css';
// import {wordToNum} from 'neikami-libs/src/index'

import { PIXI } from './pixi.js';
import * as __ from './utils/init'
import { isHitWall, enemy, play } from './other';
import { keyboard } from './utils/keyboard'
import { skill } from './utils/skill'
import PositionUtils from './utils/position'

import hero from '../assets/hero.jpg'
import lz from '../assets/lz.jpg'
import map from '../assets/map.jpg'
import map2 from '../assets/map2.jpg'

const app = new PIXI.Application({
    resolution: 1,
    backgroundColor: 0xffffff
});
const Container = PIXI.Container;

var moveDelta = {
    x: 0,
    y: 0
}

var roadareaPixels;

//初始化PIXI
function init() {
    document.body.appendChild(app.view);
    var state;
    var gameScene
        // app.renderer.autoResize = true;
        // app.renderer.resize(window.innerWidth, window.innerHeight);

    app.loader.
    add('player', hero).
        // add('floor', map).
    add('roadarea', map2).
    load((loader, resources) => {
        const roadarea = new PIXI.Sprite(resources.roadarea.texture);
        // app.stage.addChild(roadarea);
        // const floor = new PIXI.Sprite(resources.roadarea.texture);
        // roadarea.alpha = .5;
        // app.stage.addChild(roadarea);
        const player = new PIXI.Sprite(resources.player.texture);
        app.stage.addChild(player);
        roadareaPixels = app.renderer.extract.pixels(roadarea);

        player.x = __.x;
        player.y = __.y;
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        moveDelta.y = 1

        var bulletList = []
        var bulletIndex = 0
        var moveXposition = __.moveXposition

        function setup() {
            //Initialize the game sprites, set the game `state` to `play`
            //and start the 'gameLoop'
            gameScene = new Container();
            app.stage.addChild(gameScene);

            var gameOverScene = new Container();
            app.stage.addChild(gameOverScene);
            gameOverScene.visible = false;

            state = play;
            app.ticker.add(delta => gameLoop(delta, {
                player,moveDelta,bulletList,roadareaPixels,app
            }));
        }

        function gameLoop(delta, arg) {
            state(delta, arg);
        }

        var j = new keyboard('j')
        var k = new keyboard('k')
        var w = new keyboard('w')
        var a = new keyboard('a')
        var s = new keyboard('s')
        var d = new keyboard('d')
        var skillMaps = new skill(moveDelta)
            // j.press = () => {
            //     PositionUtils.displacementAutoAsync('y', -1, moveDelta.y, moveDelta)
            // };
        var isJump = false
        var isDblJump = false
        var timer = null
        j.press = () => {
            if (isDblJump) return false
            clearTimeout(timer)
            new Promise((resolve, reject) => {
                if (!isJump) {
                    moveDelta['y'] = -1;
                    isJump = true
                    timer = setTimeout(() => {
                        resolve()
                    }, __.jump);
                } else {
                    if (!isDblJump) {
                        moveDelta['y'] = -1;
                        isDblJump = true
                        timer = setTimeout(() => {
                            resolve()
                        }, __.jump * 2);
                    }
                }
            }).then(() => {
                moveDelta['y'] = 1;
                clearTimeout(timer)
                timer = setTimeout(() => {
                    isJump = false
                    isDblJump = false
                }, isDblJump ? __.jump * 2 : __.jump);

            })
        };

        var isAttack = false
        var kTimer = null
        k.press = (e) => {
            if (!isAttack) {
                clearTimeout(kTimer)
                if (bulletList[bulletIndex]) {
                    bulletIndex++
                }
                bulletList[bulletIndex] = new PIXI.Sprite(resources.player.texture);
                app.stage.addChild(bulletList[bulletIndex]);
                bulletList[bulletIndex].anchor.x = 0.5;
                bulletList[bulletIndex].anchor.y = 0.5;
                bulletList[bulletIndex].x = player.x
                bulletList[bulletIndex].y = player.y
                bulletList[bulletIndex].moveXposition = moveXposition
                new Promise((resolve, reject) => {
                    isAttack = true
                    kTimer = setTimeout(() => {
                        resolve()
                    }, 300);
                }).then(() => {
                    clearTimeout(kTimer)
                    kTimer = setTimeout(() => {
                        isAttack = false
                            // app.stage.removeChild(bulletList[bulletIndex])
                    }, 1000);
                })
            }
        };
        k.longTap = () => {
            // app.stage.removeChild(bulletList[bulletIndex])
            if (bulletList[bulletIndex]) {
                bulletIndex++
            }
            bulletList[bulletIndex] = new PIXI.Sprite(resources.player.texture);
            app.stage.addChild(bulletList[bulletIndex]);
            bulletList[bulletIndex].anchor.x = 0.5;
            bulletList[bulletIndex].anchor.y = 0.5;
            bulletList[bulletIndex].x = player.x
            bulletList[bulletIndex].y = player.y
            bulletList[bulletIndex].width *= 10
            bulletList[bulletIndex].height *= 10
            bulletList[bulletIndex].moveXposition = moveXposition
                // setTimeout(() => {
                //     isAttack = false
                //     app.stage.removeChild(bulletList[bulletIndex])
                // }, 1000);
        };
        // w.press = () => {
        //     moveDelta.y = -1;
        // }
        // w.release = () => {
        //     moveDelta.y = 0;
        // }
        // s.press = () => {
        //     moveDelta.y = 1;
        // }
        // s.release = () => {
        //     moveDelta.y = 0;
        // }
        a.press = () => {
            moveDelta.x = -1;
            moveXposition = -1
        }
        a.release = () => {
            moveDelta.x = 0;
        }
        d.press = () => {
            moveDelta.x = 1;
            moveXposition = 1
        }
        d.release = () => {
            moveDelta.x = 0;
        };
        setup()
        enemy(resources, app, gameScene)
    });

}

window.onload = init()


if (module.hot) {
    module.hot.accept('./other.js', function() {
        console.log('Accept1in1g the updated printMe module!');
    })
}