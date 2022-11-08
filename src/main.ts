import type {Keybinder_setting, key_listner as key_listner, KeyCombination} from './types.js'
export class KeyBinder {
    
    readonly settings: Keybinder_setting = {
        default_listner: 'keypress',
        element: window,
        case_sensitive:false
    }
    private readonly meta_keys = ['Control', 'Shift', 'Alt', 'Meta'].map(v => v.toLowerCase());
    private readonly can_shift = 'abcdefghijklmnopqrstuvwxyz1234567890'
    last_combination :string = ''
    timer_lsitner ?: NodeJS.Timeout
    just_listened = false
    main_listner: any
    timer = 200
    current_stroke: String[] = []
    private listen_to : KeyCombination[] = []
    constructor(settings ?: Keybinder_setting){
        this.settings = {...this.settings, ...settings}
        this.startListening()
    }
    /**
     * This set and check for the key combination done under the time set
     * @param time the time to wait for the key combination to be done
     */
    setTimeout(time = this.timer){
        time = time < 95 ? this.timer : time
        return setTimeout(() => { 
            this.just_listened = false
            this.handleKey()
        }, time)
    }
    /**
     * 
     * @param listner This is type of event to be listened to.
     * @param element The element you want to be listened to
     */
    private listner(listner: key_listner = 'keypress', element: Element|Window|undefined|null){
        if(!element) throw new Error('No element provided')
        element?.addEventListener(listner, (e) => {
            // let can_shift = !this.settings.case_sensitive ? this.can_shift+this.can_shift.toUpperCase() : this.can_shift
            let can_shift = this.can_shift+this.can_shift.toUpperCase()
            let key = e?.key
            // console.log(key)
            e.preventDefault()
            clearTimeout(this.timer_lsitner)
            if(!this.just_listened){
                this.current_stroke = []
                this.just_listened = true
            }
            e?.ctrlKey && this.current_stroke.indexOf('ctrl') < 0 ? this.current_stroke.push('ctrl') : null
            e?.altKey && this.current_stroke.indexOf('alt') < 0  ? this.current_stroke.push('alt') : null
            e?.metaKey && this.current_stroke.indexOf('meta') < 0  ? this.current_stroke.push('meta') : null
            e?.shiftKey && this.current_stroke.indexOf('shift') < 0 && can_shift.indexOf(`${e?.key}`) >= 0 && `${e?.key}`.length == 1 ? this.current_stroke.push('shift') : null
            if(listner == 'keypress')  key = `${e?.key}`.length > 1 ? e?.code[e?.code.length - 1] : e?.key
            if(listner != 'keypress' && this.meta_keys.indexOf('key') >= 0)key = null
            // console.log(key)
            if(`${key}`.length > 1) key = `${key}`.toLowerCase()
            // if(['Control', 'Shift', 'Alt'].indexOf(key) > 0)key = null
            if(e?.key.trim().length == 0) key = 'space'
            // console.log(key)
            key ? this.current_stroke.push(key) : null
            this.last_combination = this.current_stroke.join('+')
            this.timer_lsitner = this.setTimeout(this.timer - 10)
            this.just_listened = true
            console.log(this.current_stroke, can_shift.indexOf(e?.key))
        })
    }
    /**
     * This is the function that starts listening to the key combination
     * 
     */
    private startListening(){
        this.main_listner = this.listner(this.settings.default_listner, this.settings.element)
    }
    /**
     * This is the function that assemble all the key combination to be listened to by the
     * @param key the comination set to be called , they are seperared with the `+` sign
     * @callback callback this is the function is to be called after
     */
    ListenToKey(key: string, callback: ((arg0: any) => any)[]): this{
        if(key.split('+').length == 1 && key.split('+')[0].length > 1)key = key.toLowerCase()
        this.listen_to.push({
            combination:key.trim(),
            callback: (data = null) => callback[0](data)
        })
        return this
    }
    /**
     * This is the functioned called after the combination is made
     */
    handleKey(){
        let key_combination = this.settings.case_sensitive ? this.current_stroke.join('+') : this.current_stroke.join('+').toLowerCase()
        let combination_data = this.listen_to.filter((data) => {
            const key = this.settings.case_sensitive ? data.combination: data.combination.toLowerCase()
            return key === key_combination || key === "***"
        })[0],
        settings = {...combination_data, ...this.settings}
        if(combination_data.combination === '***'){
            settings = {...settings, combination:this.last_combination}
        } 
        console.log(combination_data)
        if(combination_data) combination_data?.callback({...settings})
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