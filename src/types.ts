export  type Keybinder_setting = {
    default_listner : key_listner,
    element ?: Element|Window 
}

export type KeyCombination = {
    combination:string,
    callback : (data:any) => any

}

export type key_listner = 'keypress' | 'keyup' | 'keydown'