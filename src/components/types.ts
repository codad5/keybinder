export  type Keybinder_setting = {
    listener_type : key_listener,
    element ?: Element|Window ,
    case_sensitive ?: boolean
}

export type KeyCombination = {
    combination:string,
    callback : (data:any) => any

}

export type key_listener = 'keypress' | 'keyup' | 'keydown'