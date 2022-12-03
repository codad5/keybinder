var KeyBinder = (function () {
    'use strict';

    class KeyBinder {
        constructor(settings) {
            var _a;
            this.settings = {
                listener_type: 'keypress',
                element: window,
                case_sensitive: false,
                allow_default: false,
                strict: false
            };
            this.meta_keys = ['Control', 'Shift', 'Alt', 'Meta', 'ctrl'].map(v => v.toLowerCase());
            this.can_shift = 'abcdefghijklmnopqrstuvwxyz1234567890';
            this.last_combination = '';
            this.just_listened = false;
            this.timer = 200;
            this.current_stroke = [];
            this.listen_to = [];
            this.backup_listener = [];
            this.settings = Object.assign(Object.assign(Object.assign({}, this.settings), settings), { listener_type: (_a = settings === null || settings === void 0 ? void 0 : settings.default_listener) !== null && _a !== void 0 ? _a : this.settings.listener_type });
            this.startListening();
        }
        setTimeout(time = this.timer) {
            time = time < 95 ? this.timer : time;
            return setTimeout(() => {
                this.just_listened = false;
                this.handleKey();
            }, time);
        }
        listener(listener = 'keypress', element) {
            if (!element)
                throw new Error(`Error in event element ( ${this.settings.element} )`);
            return element === null || element === void 0 ? void 0 : element.addEventListener(listener, e => this.listenerCallback(e));
        }
        listenerCallback(e) {
            var _a, _b;
            const listener = (_a = e.type) !== null && _a !== void 0 ? _a : this.settings.listener_type;
            if (!(e instanceof KeyboardEvent))
                return;
            if (!((_b = this.settings) === null || _b === void 0 ? void 0 : _b.allow_default)) {
                e.preventDefault();
                e.stopPropagation();
            }
            let alphanumeric = this.can_shift + this.can_shift.toUpperCase();
            let key = e === null || e === void 0 ? void 0 : e.key;
            clearTimeout(this.timer_listener);
            if (!this.just_listened) {
                this.current_stroke = [];
                this.just_listened = true;
            }
            (e === null || e === void 0 ? void 0 : e.ctrlKey) && this.current_stroke.indexOf('ctrl') < 0 ? this.current_stroke.push('ctrl') : null;
            (e === null || e === void 0 ? void 0 : e.altKey) && this.current_stroke.indexOf('alt') < 0 ? this.current_stroke.push('alt') : null;
            (e === null || e === void 0 ? void 0 : e.metaKey) && this.current_stroke.indexOf('meta') < 0 ? this.current_stroke.push('meta') : null;
            (e === null || e === void 0 ? void 0 : e.shiftKey) && this.current_stroke.indexOf('shift') < 0 && alphanumeric.indexOf(`${e === null || e === void 0 ? void 0 : e.key}`) >= 0 && `${e === null || e === void 0 ? void 0 : e.key}`.length == 1 ? this.current_stroke.push('shift') : null;
            if (listener == 'keypress' && e.code.toLowerCase() !== 'enter')
                key = `${e === null || e === void 0 ? void 0 : e.key}`.length > 1 ? e === null || e === void 0 ? void 0 : e.code[(e === null || e === void 0 ? void 0 : e.code.length) - 1] : e === null || e === void 0 ? void 0 : e.key;
            if (listener != 'keypress' && this.meta_keys.indexOf(`${key}`) >= 0)
                key = null;
            if (`${key}`.length > 1)
                key = `${key}`.toLowerCase();
            if ((e === null || e === void 0 ? void 0 : e.key.trim().length) == 0)
                key = 'space';
            key ? this.current_stroke.push(key) : null;
            if (alphanumeric.indexOf(`${e === null || e === void 0 ? void 0 : e.key}`) < 0 && this.current_stroke.filter(v => alphanumeric.indexOf(`${v}`) < 0 && this.meta_keys.indexOf(`${v}`) < 0 && v.length < 2).length == 1) {
                this.current_stroke = this.current_stroke.filter(v => v.toLowerCase() != 'shift'.toLowerCase());
            }
            this.current_stroke = this.current_stroke.map(v => v == 'control' ? 'ctrl' : v).filter((value, index, self) => this.meta_keys.indexOf(`${value.toLowerCase()}`) >= 0 ? self.findIndex(v => v === value) === index : value);
            this.last_combination = this.current_stroke.join('+');
            this.timer_listener = this.setTimeout(this.timer - 10);
            this.just_listened = true;
        }
        startListening() {
            this.main_listener = this.listener(this.settings.listener_type, this.settings.element);
            return this;
        }
        stopListening(clear = true) {
            var _a, _b;
            (_a = this.settings.element) === null || _a === void 0 ? void 0 : _a.removeEventListener((_b = this.settings.listener_type) !== null && _b !== void 0 ? _b : 'keyup', e => this.listenerCallback(e));
            return clear ? this.clear() : this;
        }
        continue(restore = false) {
            this.stopListening().startListening();
            return restore ? this.restore() : this;
        }
        ListenToKey(key, ...data) {
            data.unshift(key);
            let callback = data.pop();
            data.forEach(value => {
                if (typeof value !== 'string')
                    return;
                if (value.split('+').length == 1 && value.split('+')[0].length > 1)
                    value = value.toLowerCase();
                this.listen_to.push({
                    combination: value.split('+').map((v) => v == 'control' ? 'ctrl' : v).join('+').trim(),
                    callback: (data = null) => callback(data)
                });
            });
            return this.sortCombinations();
        }
        sortCombinations() {
            const any_key_combination = this.listen_to.filter(value => (value === null || value === void 0 ? void 0 : value.combination) === '***')[0];
            this.listen_to = this.listen_to.filter(value => (value === null || value === void 0 ? void 0 : value.combination) !== '***').sort();
            this.listen_to = this.listen_to.filter((value, index, self) => self.findIndex(v => v.combination === value.combination) === index);
            if (any_key_combination)
                this.listen_to.push(any_key_combination);
            return this;
        }
        handleKey() {
            this.sortCombinations();
            let key_combination = this.settings.case_sensitive ? this.current_stroke.join('+') : this.current_stroke.join('+').toLowerCase();
            let { callback, combination } = this.getCombinationWith(key_combination), settings = Object.assign({ combination }, this.settings);
            if (combination === '***')
                settings = Object.assign(Object.assign({}, settings), { combination: this.last_combination });
            if (combination)
                callback(Object.assign({}, settings));
        }
        getCombinationWith(key_combination) {
            return this.listen_to.filter((data) => {
                const key = this.settings.case_sensitive ? data.combination : data.combination.toLowerCase();
                return key === key_combination || key === "***";
            })[0];
        }
        getCombinations() {
            return this.sortCombinations().listen_to;
        }
        clear() {
            this.backup_listener = this.listen_to;
            this.listen_to = [];
            return this;
        }
        restore() {
            this.listen_to = this.backup_listener;
            return this;
        }
        set(settings) {
            this.stopListening(false).settings = Object.assign(Object.assign({}, this.settings), settings);
            return this.startListening();
        }
    }

    return KeyBinder;

})();
