import { threadId } from 'worker_threads';
import { Keybinder_setting, key_listener as key_listener, KeyCombination} from './types'

export class KeyBinder {
    
    settings : Keybinder_setting = {
        listener_type: 'keypress',
        element: window,
        case_sensitive:false,
        allow_default:false,
        strict : false
    }
    private readonly meta_keys = ['Control', 'Shift', 'Alt', 'Meta', 'ctrl'].map(v => v.toLowerCase());
    private readonly can_shift = 'abcdefghijklmnopqrstuvwxyz1234567890'
    private last_combination :string = ''
    private timer_lsitner ?: NodeJS.Timeout
    private just_listened = false
    private main_listener: any
    private timer = 200
    private current_stroke: String[] = []
    private listen_to : KeyCombination[] = []
    private backup_listener : KeyCombination[] = []
    constructor(settings ?: Keybinder_setting){
        this.settings = {...this.settings, ...settings, listener_type: settings?.default_listener ?? this.settings.listener_type}
        this.startListening()
    }
    /**
     * This set and check for the key combination done under the time set
     * @param time the time to wait for the key combination to be done
     */
    protected setTimeout(time = this.timer){
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
        return element?.addEventListener(listener, e => this.listenerCallback(e))
    }
    private listenerCallback(e : Event){
            //check if e is type of KeyboardEvent
            console.log(this.settings)
            const listener = e.type ?? this.settings.listener_type
            if(!(e instanceof KeyboardEvent)) return
            // let can_shift = !this.settings.case_sensitive ? this.can_shift+this.can_shift.toUpperCase() : this.can_shift
            //console.log(this.settings)
            if(!this.settings?.allow_default){
                e.preventDefault()
                e.stopPropagation();
            }
            let alphanumeric = this.can_shift+this.can_shift.toUpperCase()
            let key : string|null = e?.key
            // //// console.log(key)
            // console.log(e.key)
            clearTimeout(this.timer_lsitner)
            if(!this.just_listened){
                this.current_stroke = []
                this.just_listened = true
            }
            e?.ctrlKey && this.current_stroke.indexOf('ctrl') < 0 ? this.current_stroke.push('ctrl') : null
            e?.altKey && this.current_stroke.indexOf('alt') < 0  ? this.current_stroke.push('alt') : null
            e?.metaKey && this.current_stroke.indexOf('meta') < 0  ? this.current_stroke.push('meta') : null
            e?.shiftKey && this.current_stroke.indexOf('shift') < 0 && alphanumeric.indexOf(`${e?.key}`) >= 0 && `${e?.key}`.length == 1 ? this.current_stroke.push('shift') : null
            if(listener == 'keypress' && e.code.toLowerCase() !== 'enter')  key = `${e?.key}`.length > 1 ? e?.code[e?.code.length - 1] : e?.key
            if(listener != 'keypress' && this.meta_keys.indexOf(`${key}`) >= 0) key = null
            // //// console.log(key)
            if(`${key}`.length > 1) key = `${key}`.toLowerCase()
            // if(['Control', 'Shift', 'Alt'].indexOf(key) > 0)key = null
            if(e?.key.trim().length == 0) key = 'space'
            // console.log(e.code, listener)
            key ? this.current_stroke.push(key) : null
            //removing the shift key if the key is not part of the alphanumeric characters and character lenght is one
            if(alphanumeric.indexOf(`${e?.key}`) < 0 && this.current_stroke.filter(v => alphanumeric.indexOf(`${v}`) < 0 && this.meta_keys.indexOf(`${key}`) < 0).length > 1){
                this.current_stroke = this.current_stroke.filter(v => v.toLowerCase() != 'shift')
            }
            this.current_stroke = this.current_stroke.map(v => v == 'control' ? 'ctrl' : v).filter((value, index, self) => this.meta_keys.indexOf(`${value.toLowerCase()}`) >= 0 ? self.findIndex(v => v === value) === index : value)
            this.last_combination = this.current_stroke.join('+')
            this.timer_lsitner = this.setTimeout(this.timer - 10)
            this.just_listened = true
            // //// console.log(this.current_stroke, can_shift.indexOf(e?.key))
        }
    /**
     * This is the function that starts listening to the key combination
     * 
     */
    private startListening(){
        this.main_listener = this.listener(this.settings.listener_type, this.settings.element)
        return this
    }
    /**
     * this function is remove the listener from that element 
     * @param clear This state if all previous combination should be cleared if true or left
     * @returns {this}
     */
    stopListening(clear : boolean  = true): this{
        this.settings.element?.removeEventListener(this.settings.listener_type ?? 'keyup', e => this.listenerCallback(e))
        return clear ? this.clear() : this
    }
    continue(restore : boolean = false){
        this.stopListening().startListening()
        return restore ? this.restore() : this
    }
    /**
     * This is the function that assemble all the key combination to be listened to by the
     * @param key the comination set to be called , they are seperared with the `+` sign
     * @callback callback this is the function is to be called after
     */
    ListenToKey(key: string, ...data: any[]): this{
        //// console.log(`adding`)
        data.unshift(key)
        let callback = data.pop()
        data.forEach(value => {
            if(typeof value !== 'string') return 
            if(value.split('+').length == 1 && value.split('+')[0].length > 1)value = value.toLowerCase()
            //// console.log(`added ${value.trim()} to key_listener`)
            this.listen_to.push({
                combination:value.split('+').map((v: string) => v == 'control' ? 'ctrl' : v).join('+').trim(),
                callback: (data = null) => callback(data)
            })
        })
        return this.sortCombinations()
    }
    sortCombinations(){
        // console.log(this.listen_to)
        const any_key_combination = this.listen_to.filter(value => value?.combination === '***')[0]
        this.listen_to = this.listen_to.filter(value => value?.combination !== '***').sort()
        //remove duplicate combinations
        this.listen_to = this.listen_to.filter((value, index, self) => self.findIndex(v => v.combination === value.combination) === index)
        if(any_key_combination) this.listen_to.push(any_key_combination)
        return this
    }
    /**
     * This is the functioned called after the combination is made
     */
    handleKey(){
        this.sortCombinations()
        let key_combination = this.settings.case_sensitive ? this.current_stroke.join('+') : this.current_stroke.join('+').toLowerCase()
        let {callback, combination} = this.getCombinationWith(key_combination),
        settings = {combination, ...this.settings}
        if(combination === '***') settings = {...settings, combination:this.last_combination}
        
        if(combination) callback({...settings})
    }
    getCombinationWith(key_combination: string){
        return this.listen_to.filter((data) => {
            const key = this.settings.case_sensitive ? data.combination: data.combination.toLowerCase()
            return key === key_combination || key === "***"
        })[0]
    }
    /**
     * Get all the key combinations that are being listened to
     * 
     * @returns {KeyCombination[]} an array of all the key combinations
     * 
     */
    getCombinations(): KeyCombination[]{
        return this.sortCombinations().listen_to
    }
    
    /**
     * This is the function that stops listening to the key combination
     * 
    */
    clear(){
        this.backup_listener = this.listen_to
        this.listen_to = []
        return this
    }
    /**
     * Restarts the listening to the key combination
     * @returns {this} the instance of the class
     */
    restore(): this{
        this.listen_to = this.backup_listener
        return this
    }
    set(settings ?: Keybinder_setting){
        this.stopListening(false).settings = {...this.settings, ...settings}
        return this.startListening()
    }


}

