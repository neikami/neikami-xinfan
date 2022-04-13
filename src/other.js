import { PIXI } from './pixi.js';
function isHitWall(x, y, roadareaPixels) {
    var width = 667;
    var position = (width * y + x) * 4;

    var r = roadareaPixels[position],
        g = roadareaPixels[position + 1],
        b = roadareaPixels[position + 2],
        a = roadareaPixels[position + 3];

    if (r == 255 && g < 50) {
        // console.log("hit the wall");
        return true;
    } else {
        return false;
    }
}

function enemy(resources, app, gameScene) {
    let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150,
        speed = 2,
        direction = 1;

    //An array to store all the blob monsters
    var blobs = [];

    //Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {

        //Make a blob
        let blob = new PIXI.Sprite(resources.player.texture);
        //Space each blob horizontally according to the `spacing` value.
        //`xOffset` determines the point from the left of the screen
        //at which the first blob should be added
        let x = spacing * i + xOffset;

        //Give the blob a random `y` position
        // (0, app.stage.height - blob.height)
        let y = Math.ceil(Math.random() * 10) * blob.height;

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


function play(delta, arg) {
    var {player, moveDelta, bulletList , roadareaPixels, app} = arg
    var nextX = player.x + moveDelta.x;
    var nextY = player.y + moveDelta.y;
    // console.log(moveDelta.y)
    if (!isHitWall(player.x, nextY + (player.height / 2) * moveDelta.y , roadareaPixels)) {
        player.y = nextY;
    }
    if (!isHitWall(nextX + (player.width / 2) * moveDelta.x, player.y, roadareaPixels)) {
        player.x = nextX;
    }
    if (bulletList.length > 0) {
        bulletList.forEach((ele, index) => {
            ele.x += 3 * ele.moveXposition
            if (ele.x > app.screen.width) {
                app.stage.removeChild(bulletList[index])
                bulletList.splice(index, 1)
            }
        })
    }
}

export {isHitWall,enemy, play};