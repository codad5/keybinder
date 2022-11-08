export class KeyBinder {
    constructor(settings) {
        this.settings = {
            default_listner: 'keypress',
            element: window
        };
        this.meta_keys = ['Control', 'Shift', 'Alt'];
        this.timer_lsitner = this.setTimeout();
        this.just_listened = false;
        this.timer = 150;
        this.current_stroke = [];
        this.listen_to = [];
        this.settings = Object.assign(Object.assign({}, this.settings), settings);
        this.startListening();
    }
    listner(listner = 'keypress', element) {
        if (!element)
            throw new Error('No element provided');
        element === null || element === void 0 ? void 0 : element.addEventListener(listner, (e) => {
            let key = e.key;
            e.preventDefault();
            clearTimeout(this.timer_lsitner);
            if (!this.just_listened) {
                this.current_stroke = [];
                this.just_listened = true;
            }
            (e === null || e === void 0 ? void 0 : e.ctrlKey) && this.current_stroke.indexOf('ctrl') < 0 ? this.current_stroke.push('ctrl') : null;
            (e === null || e === void 0 ? void 0 : e.altKey) && this.current_stroke.indexOf('alt') < 0 ? this.current_stroke.push('alt') : null;
            (e === null || e === void 0 ? void 0 : e.shiftKey) && this.current_stroke.indexOf('shift') < 0 ? this.current_stroke.push('shift') : null;
            if (listner == 'keypress')
                key = (e === null || e === void 0 ? void 0 : e.key.length) > 1 ? e === null || e === void 0 ? void 0 : e.code[(e === null || e === void 0 ? void 0 : e.code.length) - 1] : e === null || e === void 0 ? void 0 : e.key;
            if (listner != 'keypress' && this.meta_keys[e === null || e === void 0 ? void 0 : e.key])
                key = null;
            if ((e === null || e === void 0 ? void 0 : e.key.trim().length) == 0)
                key = 'space';
            // console.log(key)
            key ? this.current_stroke.push(key) : null;
            this.timer_lsitner = this.setTimeout(this.timer - 10);
            this.just_listened = true;
            // console.log(this.current_stroke, e?.key.trim().length)
        });
    }
    setTimeout(time = this.timer) {
        time = time < 95 ? this.timer : time;
        return setTimeout(() => {
            this.just_listened = false;
            this.handleKey();
        }, time);
    }
    startListening() {
        this.main_listner = this.listner(this.settings.default_listner, this.settings.element);
    }
    ListenToKey(key, ...data) {
        const callback = data.pop();
        // console.log(data)
        delete data[data.length - 1];
        this.listen_to.push({
            combination: key.trim(),
            callback: (data) => callback[0](data)
        });
        data.map(value => {
            this.listen_to.push({
                combination: value.trim(),
                callback: (data) => callback[0](data)
            });
        });
    }
    handleKey() {
        let key_combination = this.current_stroke.join('+').toLowerCase();
        let combination_data = this.listen_to.filter((data) => {
            return data.combination.toLowerCase() === key_combination;
        })[0];
        const settings = this.settings.default_listner;
        combination_data === null || combination_data === void 0 ? void 0 : combination_data.callback(Object.assign(Object.assign({}, combination_data), { settings }));
    }
}
/**
 * How This will work
 * There will be an array that has all the list of  keybind to activate like ['crtl+b+c', 'alt+z']
 * Then they will be a class that listen to key type
 * on any key type , the keyname will be appended to an array that collect like of keypress in the last 1 sec
 * there will be a property time that manage time
 * if key event is triggered the time will be set to one sec
 * else it will combine all join all the array item of pressed key with array.join('+')
 * then check if such property exist in the array of keys
 * if it does it will call the callback function to that passing in a data on default
 *
 */ 
