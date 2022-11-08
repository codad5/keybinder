import type {Keybinder_setting, key_listner as key_listner, KeyCombination} from './types.js'
export class KeyBinder {
    
    readonly settings: Keybinder_setting = {
        default_listner: 'keypress',
        element: window
    }
    private readonly meta_keys = ['Control', 'Shift', 'Alt']
    private listner(listner: key_listner = 'keypress', element: Element|Window|undefined|null){
        if(!element) throw new Error('No element provided')
        element?.addEventListener(listner, (e) => {
            let key = e.key
            e.preventDefault()
            clearTimeout(this.timer_lsitner)
            if(!this.just_listened){
                this.current_stroke = []
                this.just_listened = true
            }
            e?.ctrlKey && this.current_stroke.indexOf('ctrl') < 0 ? this.current_stroke.push('ctrl') : null
            e?.altKey && this.current_stroke.indexOf('alt') < 0  ? this.current_stroke.push('alt') : null
            e?.shiftKey && this.current_stroke.indexOf('shift') < 0  ? this.current_stroke.push('shift') : null
            if(listner == 'keypress')  key = e?.key.length > 1 ? e?.code[e?.code.length - 1] : e?.key
            if(listner != 'keypress' && this.meta_keys[e?.key])key = null
            if(e?.key.trim().length == 0) key = 'space'
            // console.log(key)
            key ? this.current_stroke.push(key) : null
            this.timer_lsitner = this.setTimeout(this.timer - 10)
            this.just_listened = true
            // console.log(this.current_stroke, e?.key.trim().length)
        })
    }
    timer_lsitner = this.setTimeout()
    just_listened = false
    main_listner: any
    timer = 150
    current_stroke: String[] = []
    private listen_to : KeyCombination[] = []
    constructor(settings ?: Keybinder_setting){
        this.settings = {...this.settings, ...settings}
        this.startListening()
    }
    setTimeout(time = this.timer){
        time = time < 95 ? this.timer : time
        return setTimeout(() => { 
            this.just_listened = false
            this.handleKey()
        }, time)
    }
    startListening(){
        this.main_listner = this.listner(this.settings.default_listner, this.settings.element)
    }
    ListenToKey(key: string, ...data: any[]){
        const callback = data.pop()
        // console.log(data)
        delete data[data.length -1]
        this.listen_to.push({
            combination:key.trim(),
            callback: (data) => callback[0](data)
        })
        data.map(value => {
            this.listen_to.push({
                combination:value.trim(),
                callback: (data) => callback[0](data)
            })
        })
    }
    handleKey(){
        let key_combination = this.current_stroke.join('+').toLowerCase()
        let combination_data = this.listen_to.filter((data) => {
            return data.combination.toLowerCase() === key_combination
        })[0]
        const settings = this.settings.default_listner
        combination_data?.callback({...combination_data, settings})
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