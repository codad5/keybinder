export  type Keybinder_setting = {
    listener_type? : key_listener,
    default_listener? : key_listener,
    element ?: Element|Window ,
    case_sensitive ?: boolean,
    allow_default ?: boolean,
    strict ?: boolean,
}

export type KeyCombination = {
    combination:string,
    callback : (data:any) => any

}

export type key_listener = 'keypress' | 'keyup' | 'keydown'