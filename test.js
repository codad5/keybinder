const keyController = new KeyBinder({
    default_listner: 'keyup',
    element: window,
    // case_sensitive:true
})

// const ListenToKey = (key, data) => keyController.ListenToKey(key, data)
const ListenToKey = (key, ...data) => keyController.ListenToKey(key, ...data)

ListenToKey('B+G', () => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    document.querySelector('#bcdiv').innerHTML += 'Your Called me ?'
})
ListenToKey('shift+c', () => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    document.querySelector('#scdiv').innerHTML += 'Do you mean Ctrl+c? try Ctrl+c'
})
ListenToKey('enter', 'j+j', 'v', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    console.table({ ...data, element: 'Window' })
    confirm('Do you need more information?')
})
ListenToKey('space', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    document.querySelector('#spacediv').innerHTML += 'la'
})
ListenToKey('shift+s', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
})
ListenToKey('meta', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    if (alert('Dont press the windows key again')) return
})
ListenToKey('ctrl+b', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    confirm('bold combination')
})
ListenToKey('arrowup', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    if (confirm('arrowup combination')) window.clientInformation.wakeLock.request()
})

ListenToKey('***', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    document.querySelector('#keystrokehistory').innerHTML += `<li>Your  combination is ${data.combination} </li>`
    console.table({ ...data, element: 'Window' })
})
ListenToKey('alt+c', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr',
        'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    document.querySelector('#keystrokehistory').innerHTML = ``
    console.table({ ...data, element: 'Window' })
})