export default class run {
    constructor(Application) {
        this.isHitWall = (x, y) => {
            var width = 667;
            var position = (width * y + x) * 4;

            var r = Application.roadareaPixels[position],
                g = Application.roadareaPixels[position + 1],
                b = Application.roadareaPixels[position + 2],
                a = Application.roadareaPixels[position + 3];

            if (r == 255 && g < 50) {
                // console.log("hit the wall"); 
                return true;
            } else {
                return false;
            }
        }
        this.play = (Application) => {
            var nextX = Application.player.x + Application.player.moveDelta.x;
            var nextY = Application.player.y + Application.player.moveDelta.y;
            // console.log(player.moveDelta.y)
            if (!this.isHitWall(Application.player.x, nextY + (Application.player.height / 2) * Application.player.moveDelta.y, Application.roadareaPixels)) {
                Application.player.y = nextY;
            }
            if (!this.isHitWall(nextX + (Application.player.width / 2) * Application.player.moveDelta.x, Application.player.y, Application.roadareaPixels)) {
                Application.player.x = nextX;
            }
            if (Application.bulletList.length > 0) {
                Application.bulletList.forEach((ele, index) => {
                    ele.x += 3 * ele.moveXposition
                    if (ele.x > Application.app.screen.width) {
                        Application.app.stage.removeChild(Application.bulletList[index])
                        Application.bulletList.splice(index, 1)
                    }
                })
            }
        }
    }
}