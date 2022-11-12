import type {Keybinder_setting, key_listener as key_listener, KeyCombination} from './types.js'
// merge into WindowEventMap
//extend a new interface to event type and keyboardevnt

export class KeyBinder {
    
    readonly settings: Keybinder_setting = {
        default_listener: 'keypress',
        element: window,
        case_sensitive:false
    }
    private readonly meta_keys = ['Control', 'Shift', 'Alt', 'Meta'].map(v => v.toLowerCase());
    private readonly can_shift = 'abcdefghijklmnopqrstuvwxyz1234567890'
    last_combination :string = ''
    timer_lsitner ?: NodeJS.Timeout
    just_listened = false
    main_listener: any
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
     * @param listener This is type of event to be listened to.
     * @param element The element you want to be listened to
     */
    private listener(listener: key_listener = 'keypress', element: Element|Window|undefined|null){
        if(!element) throw new Error(`Error in event element ( ${this.settings.element} )`)
        // set type of listener to keyboard event
        element?.addEventListener(listener, (e) => {
            //check if e is type of KeyboardEvent
            if(!(e instanceof KeyboardEvent)) return
            // let can_shift = !this.settings.case_sensitive ? this.can_shift+this.can_shift.toUpperCase() : this.can_shift
            e.preventDefault()
            let can_shift = this.can_shift+this.can_shift.toUpperCase()
            let key : string|null = e?.key
            // //console.log(key)
            clearTimeout(this.timer_lsitner)
            if(!this.just_listened){
                this.current_stroke = []
                this.just_listened = true
            }
            e?.ctrlKey && this.current_stroke.indexOf('ctrl') < 0 ? this.current_stroke.push('ctrl') : null
            e?.altKey && this.current_stroke.indexOf('alt') < 0  ? this.current_stroke.push('alt') : null
            e?.metaKey && this.current_stroke.indexOf('meta') < 0  ? this.current_stroke.push('meta') : null
            e?.shiftKey && this.current_stroke.indexOf('shift') < 0 && can_shift.indexOf(`${e?.key}`) >= 0 && `${e?.key}`.length == 1 ? this.current_stroke.push('shift') : null
            if(listener == 'keypress')  key = `${e?.key}`.length > 1 ? e?.code[e?.code.length - 1] : e?.key
            if(listener != 'keypress' && this.meta_keys.indexOf('key') >= 0)key = null
            // //console.log(key)
            if(`${key}`.length > 1) key = `${key}`.toLowerCase()
            // if(['Control', 'Shift', 'Alt'].indexOf(key) > 0)key = null
            if(e?.key.trim().length == 0) key = 'space'
            // //console.log(key)
            key ? this.current_stroke.push(key) : null
            this.last_combination = this.current_stroke.join('+')
            this.timer_lsitner = this.setTimeout(this.timer - 10)
            this.just_listened = true
            // //console.log(this.current_stroke, can_shift.indexOf(e?.key))
        })
    }
    /**
     * This is the function that starts listening to the key combination
     * 
     */
    private startListening(){
        this.main_listener = this.listener(this.settings.default_listener, this.settings.element)
    }
    /**
     * This is the function that assemble all the key combination to be listened to by the
     * @param key the comination set to be called , they are seperared with the `+` sign
     * @callback callback this is the function is to be called after
     */
    ListenToKey(key: string, ...data: any[]): this{
        //console.log(`adding`)
        data.unshift(key)
        let callback = data.pop()
        data.forEach(value => {
            if(typeof value !== 'string') return 
            if(value.split('+').length == 1 && value.split('+')[0].length > 1)value = value.toLowerCase()
            //console.log(`added ${value.trim()} to key_listener`)
            this.listen_to.push({
                combination:value.trim(),
                callback: (data = null) => callback(data)
            })
        })
        return this
    }
    sortCombinations(){
        const any_key_combination = this.listen_to.filter(value => value?.combination === '***')[0]
        this.listen_to = this.listen_to.filter(value => value?.combination !== '***').sort()
        if(any_key_combination) this.listen_to.push(any_key_combination)
        return this
    }
    /**
     * This is the functioned called after the combination is made
     */
    handleKey(){
        //console.log(this.listen_to)
        this.sortCombinations()
        //console.log(this.listen_to)
        let key_combination = this.settings.case_sensitive ? this.current_stroke.join('+') : this.current_stroke.join('+').toLowerCase()
        let combination_data = this.listen_to.filter((data) => {
            const key = this.settings.case_sensitive ? data.combination: data.combination.toLowerCase()
            return key === key_combination || key === "***"
        })[0],
        settings = {...combination_data, ...this.settings}
        if(combination_data?.combination === '***') settings = {...settings, combination:this.last_combination}
        
        if(combination_data) combination_data?.callback({...settings})
    }



}

