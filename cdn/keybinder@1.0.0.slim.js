class KeyBinder {
    constructor(settings) {
        this.settings = {
            default_listener: 'keypress',
            element: window,
            case_sensitive: false
        };
        this.meta_keys = ['Control', 'Shift', 'Alt', 'Meta'].map(v => v.toLowerCase());
        this.can_shift = 'abcdefghijklmnopqrstuvwxyz1234567890';
        this.last_combination = '';
        this.just_listened = false;
        this.timer = 200;
        this.current_stroke = [];
        this.listen_to = [];
        this.settings = Object.assign(Object.assign({}, this.settings), settings);
        this.startListening();
    }
    /**
     * This set and check for the key combination done under the time set
     * @param time the time to wait for the key combination to be done
     */
    setTimeout(time = this.timer) {
        time = time < 95 ? this.timer : time;
        return setTimeout(() => {
            this.just_listened = false;
            this.handleKey();
        }, time);
    }
    /**
     *
     * @param listener This is type of event to be listened to.
     * @param element The element you want to be listened to
     */
    listener(listener = 'keypress', element) {
        if (!element)
            throw new Error('No element provided');
        element === null || element === void 0 ? void 0 : element.addEventListener(listener, (e) => {
            // let can_shift = !this.settings.case_sensitive ? this.can_shift+this.can_shift.toUpperCase() : this.can_shift
            e.preventDefault();
            let can_shift = this.can_shift + this.can_shift.toUpperCase();
            let key = e === null || e === void 0 ? void 0 : e.key;
            // console.log(key)
            clearTimeout(this.timer_lsitner);
            if (!this.just_listened) {
                this.current_stroke = [];
                this.just_listened = true;
            }
            (e === null || e === void 0 ? void 0 : e.ctrlKey) && this.current_stroke.indexOf('ctrl') < 0 ? this.current_stroke.push('ctrl') : null;
            (e === null || e === void 0 ? void 0 : e.altKey) && this.current_stroke.indexOf('alt') < 0 ? this.current_stroke.push('alt') : null;
            (e === null || e === void 0 ? void 0 : e.metaKey) && this.current_stroke.indexOf('meta') < 0 ? this.current_stroke.push('meta') : null;
            (e === null || e === void 0 ? void 0 : e.shiftKey) && this.current_stroke.indexOf('shift') < 0 && can_shift.indexOf(`${e === null || e === void 0 ? void 0 : e.key}`) >= 0 && `${e === null || e === void 0 ? void 0 : e.key}`.length == 1 ? this.current_stroke.push('shift') : null;
            if (listener == 'keypress')
                key = `${e === null || e === void 0 ? void 0 : e.key}`.length > 1 ? e === null || e === void 0 ? void 0 : e.code[(e === null || e === void 0 ? void 0 : e.code.length) - 1] : e === null || e === void 0 ? void 0 : e.key;
            if (listener != 'keypress' && this.meta_keys.indexOf('key') >= 0)
                key = null;
            // console.log(key)
            if (`${key}`.length > 1)
                key = `${key}`.toLowerCase();
            // if(['Control', 'Shift', 'Alt'].indexOf(key) > 0)key = null
            if ((e === null || e === void 0 ? void 0 : e.key.trim().length) == 0)
                key = 'space';
            // console.log(key)
            key ? this.current_stroke.push(key) : null;
            this.last_combination = this.current_stroke.join('+');
            this.timer_lsitner = this.setTimeout(this.timer - 10);
            this.just_listened = true;
            // console.log(this.current_stroke, can_shift.indexOf(e?.key))
        });
    }
    /**
     * This is the function that starts listening to the key combination
     *
     */
    startListening() {
        this.main_listener = this.listener(this.settings.default_listener, this.settings.element);
    }
    /**
     * This is the function that assemble all the key combination to be listened to by the
     * @param key the comination set to be called , they are seperared with the `+` sign
     * @callback callback this is the function is to be called after
     */
    ListenToKey(key, ...data) {
        let callback = data.pop();
        data.unshift(key);
        data.forEach(value => {
            if (value.split('+').length == 1 && value.split('+')[0].length > 1)
                value = value.toLowerCase();
            this.listen_to.push({
                combination: value.trim(),
                callback: (data = null) => callback(data)
            });
        });
        return this;
    }
    sortCombinations() {
        const any_key_combination = this.listen_to.filter(value => (value === null || value === void 0 ? void 0 : value.combination) === '***')[0];
        this.listen_to = this.listen_to.filter(value => (value === null || value === void 0 ? void 0 : value.combination) !== '***').sort();
        if (any_key_combination)
            this.listen_to.push(any_key_combination);
        return this;
    }
    /**
     * This is the functioned called after the combination is made
     */
    handleKey() {
        this.sortCombinations();
        console.log(this.listen_to);
        let key_combination = this.settings.case_sensitive ? this.current_stroke.join('+') : this.current_stroke.join('+').toLowerCase();
        let combination_data = this.listen_to.filter((data) => {
            const key = this.settings.case_sensitive ? data.combination : data.combination.toLowerCase();
            return key === key_combination || key === "***";
        })[0], settings = Object.assign(Object.assign({}, combination_data), this.settings);
        if (combination_data.combination === '***')
            settings = Object.assign(Object.assign({}, settings), { combination: this.last_combination });
        if (combination_data)
            combination_data === null || combination_data === void 0 ? void 0 : combination_data.callback(Object.assign({}, settings));
    }
}
// How it works
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
