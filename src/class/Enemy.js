import Sprite from './Sprite';
// 敌人
export default class Enemy {
    constructor(Application, resources) {
        this.setEnemy = () => {
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
                let blob = new Sprite().setSprite(resources.player.texture).getSprite()

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
                Application.gameScene.addChild(blob);
            }
            return this
        }
        return this
    }
}