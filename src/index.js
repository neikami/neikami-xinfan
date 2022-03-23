import _ from 'lodash';
import './style.css';
// import {wordToNum} from 'neikami-libs/src/index'
import { PIXI } from './pixi.js';
import hero from '../assets/hero.jpg'
import lz from '../assets/lz.jpg'
import map from '../assets/map.jpg'
import { keyboard } from './utils/keyboard'
//初始化PIXI
function init() {}

init()

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

function isHitWall(x, y) {
    var width = 375;
    var position = (width * y + x) * 4;

    var r = roadareaPixels[position],
        g = roadareaPixels[position + 1],
        b = roadareaPixels[position + 2],
        a = roadareaPixels[position + 3];

    if (r == 255 && g < 50) {
        console.log("hit the wall");
        return true;
    } else {
        return false;
    }
}

function enemy() {
    let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150,
        speed = 2,
        direction = 1;

    //An array to store all the blob monsters
    blobs = [];

    //Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {

        //Make a blob
        let blob = new Sprite(id["hero.jpg"]);

        //Space each blob horizontally according to the `spacing` value.
        //`xOffset` determines the point from the left of the screen
        //at which the first blob should be added
        let x = spacing * i + xOffset;

        //Give the blob a random `y` position
        let y = randomInt(0, stage.height - blob.height);

        //Set the blob's position
        blob.x = x;
        blob.y = y;

        //Set the blob's vertical velocity. `direction` will be either `1` or
        //`-1`. `1` means the enemy will move down and `-1` means the blob will
        //move up. Multiplying `direction` by `speed` determines the blob's
        //vertical direction
        blob.vy = speed * direction;

        //Reverse the direction for the next blob
        direction *= -1;

        //Push the blob into the `blobs` array
        blobs.push(blob);

        //Add the blob to the `gameScene`
        gameScene.addChild(blob);
    }
}

window.onload = function() {
    document.body.appendChild(app.view);
    var state;
    // app.renderer.autoResize = true;
    // app.renderer.resize(window.innerWidth, window.innerHeight);

    app.loader.
    add('player', hero).
        // add('floor', map).
    add('roadarea', lz).
    load((loader, resources) => {
        const roadarea = new PIXI.Sprite(resources.roadarea.texture);
        // app.stage.addChild(roadarea);
        // const floor = new PIXI.Sprite(resources.floor.texture);
        // floor.alpha=.5;
        // app.stage.addChild(floor);
        const player = new PIXI.Sprite(resources.player.texture);
        app.stage.addChild(player);
        roadareaPixels = app.renderer.extract.pixels(roadarea);
        player.x = 50;
        player.y = 50;
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        var bulletList = []
        var bulletIndex = bulletList.length

        function setup() {
            //Initialize the game sprites, set the game `state` to `play`
            //and start the 'gameLoop'
            var gameScene = new Container();
            app.stage.addChild(gameScene);

            var gameOverScene = new Container();
            app.stage.addChild(gameOverScene);
            gameOverScene.visible = false;

            state = play;
            app.ticker.add(delta => gameLoop(delta));
        }

        function gameLoop(delta) {
            state(delta);
        }

        function play(delta) {
            var nextX = player.x + moveDelta.x;
            var nextY = player.y + moveDelta.y;
            // console.log(moveDelta.y)
            if (!isHitWall(player.x, nextY + 5 * moveDelta.y)) {
                player.y = nextY;
            }
            if (!isHitWall(nextX + 5 * moveDelta.x, player.y)) {
                player.x = nextX;
            }
            if (bulletList.length > 0) {
                bulletList.forEach(ele => {
                    ele.x += 3
                })
            }
        }
        var j = new keyboard('j')
        var k = new keyboard('k')
        var lk = new keyboard('k l')
        var w = new keyboard('w')
        var a = new keyboard('a')
        var s = new keyboard('s')
        var d = new keyboard('d')
        var isJump = false;
        j.press = () => {
            if (!isJump) {
                new Promise((resolve, reject) => {
                    isJump = true
                    moveDelta.y = -1;
                    setTimeout(() => {
                        resolve()
                    }, 300);
                }).then(() => {
                    moveDelta.y = 1;
                    setTimeout(() => {
                        moveDelta.y = 0;
                        isJump = false
                    }, 300);
                })
            }
        };
        var isAttack = false
        k.press = (e) => {
            if (!isAttack) {
                bulletList[bulletIndex] = new PIXI.Sprite(resources.player.texture);
                app.stage.addChild(bulletList[bulletIndex]);
                bulletList[bulletIndex].anchor.x = 0.5;
                bulletList[bulletIndex].anchor.y = 0.5;
                bulletList[bulletIndex].x = player.x
                bulletList[bulletIndex].y = player.y
                new Promise((resolve, reject) => {
                    isAttack = true
                    setTimeout(() => {
                        resolve()
                    }, 300);
                }).then(() => {
                    setTimeout(() => {
                        isAttack = false
                            // app.stage.removeChild(bulletList[bulletIndex])
                    }, 1000);
                })
            }
        };
        lk.longTap = () => {
            // app.stage.removeChild(bulletList[bulletIndex])
            console.log(bulletList)
            bulletList[bulletIndex] = new PIXI.Sprite(resources.player.texture);
            app.stage.addChild(bulletList[bulletIndex]);
            bulletList[bulletIndex].anchor.x = 0.5;
            bulletList[bulletIndex].anchor.y = 0.5;
            bulletList[bulletIndex].x = player.x
            bulletList[bulletIndex].y = player.y
            bulletList[bulletIndex].width *= 10
            bulletList[bulletIndex].height *= 10
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
        s.press = () => {
            moveDelta.y = 1;
        }
        s.release = () => {
            moveDelta.y = 0;
        }
        a.press = () => {
            moveDelta.x = -1;
        }
        a.release = () => {
            moveDelta.x = 0;
        }
        d.press = () => {
            moveDelta.x = 1;
        }
        d.release = () => {
            moveDelta.x = 0;
        };
        setup()
    });

}

if (module.hot) {
    module.hot.accept('./other.js', function() {
        console.log('Acceptin1g the updated printMe module!');
        console.log('1234');
        // printMe();
    })
}