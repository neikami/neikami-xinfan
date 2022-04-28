export default class skill {
    constructor(target) {
        this.skill = null
        this.keyarr = []
        this.map = [
            'MetaShiftz',
            'ControlShiftz',
        ]
        this.mapTree = {
            'Metaz': () => {
                this.back()
            },
            'Controlz': () => {
                this.back()
            },
            'Metar': () => {
                this.nexts()
            },
            'Controlr': () => {
                this.nexts()
            }
        }

        this.back = () => {
            this.keyarr = []
            this.skill(true)
        }
        this.nexts = () => {
            this.keyarr = []
            this.skill(false)
        }
        //The `downHandler`
        this.downHandler = event => {
            if (event.key == 'Meta') {this.keyarr = []}
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