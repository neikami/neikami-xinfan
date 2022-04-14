export default class skill {
    constructor(target) {
        this.skill = null
        this.keyarr = []
        this.map = [
            'ddj',
            'aaj',
        ]
        this.mapTree = {
            'ddj': () => {
                this.displacement('x', 5)
            },
            'aaj': () => {
                this.displacement('x', -5)
            }
        }

        var isSkill = false;
        this.displacement = (position, offset) => {
            if (!isSkill) {
                new Promise((resolve, reject) => {
                    target.moveDelta[position] = offset;
                    isSkill = true
                    setTimeout(() => {
                        resolve()
                    }, 300);
                }).then(() => {
                    isSkill = false
                    target.moveDelta[position] = 0;
                })
            }
        }
        //The `downHandler`
        this.downHandler = event => {
            if (this.keyarr.length < 3) {
                this.keyarr.push(event.key)
            } else if (this.keyarr.length == 3) {
                this.keyarr.shift()
                this.keyarr.push(event.key)
            }
            var _key = this.keyarr.join('')
            if (this.map.indexOf(_key) !== -1 && this.skill) {
                this.skill()
                this.keyarr = []
            } else if (this.mapTree[_key]) {
                this.mapTree[_key]()
            }
        };

        //Attach event listeners
        const downListener = this.downHandler.bind(this);

        window.addEventListener(
            "keydown", downListener, false
        );

        // Detach event listeners
        this.unsubscribe = () => {
            window.removeEventListener("keydown", downListener);
        };

        return this;
    }
}