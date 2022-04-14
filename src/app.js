import { PIXI } from './plugin/pixi.js';

import * as __ from './utils/init'
import skill from './utils/skill'

import Sprite from './class/Sprite'
import Enemy from './class/Enemy'

import hero from '../assets/hero.jpg'
import map2 from '../assets/map2.jpg'

export default class App {
    constructor ({run}) {
        if(new.target !== App){
            return
        }
        if(!App._instance){
            App._instance = this
        }

        this.app = new PIXI.Application({
            resolution: 1,
            backgroundColor: 0xffffff
        });

        this.roadareaPixels = null

        this.bulletList = []
        this.bulletIndex = 0

        this.player = null

        this.state;
        this.gameScene;

        this.init({
            run
        })
        return App._instance
    }
    init ({run}) {
        document.body.appendChild(this.app.view);
        // app.renderer.autoResize = true;
        // app.renderer.resize(window.innerWidth, window.innerHeight);
        var _this = this

        this.app.loader.
            add('player', hero).
            // add('floor', map).
            add('roadarea', map2).
            load((loader, resources) => {
                // 地图碰撞检测区域
                const roadarea = new Sprite().setSprite(resources.roadarea.texture).getSprite()

                // _this.app.stage.addChild(roadarea);
                // const floor = new PIXI.Sprite(resources.roadarea.texture);
                // roadarea.alpha = .5;
                // app.stage.addChild(roadarea);

                var setup = () => {
                    // 地图场景
                    this.gameScene = new PIXI.Container();
                    this.app.stage.addChild(this.gameScene);

                    // 玩家初始设置
                    this.player = new Sprite().setSprite(resources.player.texture).playerInit({...__}).setKeys(this).getSprite()
                    // var skillMaps = new skill()

                    this.app.stage.addChild(this.player);
                    
                    // 技能树
                    new skill(this.player)

                    // 地图色彩数据array
                    this.roadareaPixels = this.app.renderer.extract.pixels(roadarea);

                    // 敌类
                    this.Enemy = new Enemy(this,resources).setEnemy()

                    // 渲染
                    var runClass = new run(this);
                    var play = runClass.play

                    // var gameOverScene = new _this.Container();
                    // this.app.stage.addChild(gameOverScene);
                    // gameOverScene.visible = false;

                    this.state = play;

                    this.app.ticker.add(() => gameLoop());
                }
                var gameLoop = () => {
                    this.state(this);
                }

                setup()
        });
    }
}