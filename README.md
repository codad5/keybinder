# Key Bonder/Binder

This is a react.js library that helps with keyboard binding and input devices in general

```js
ListenToKey('enter', (data) => {
        console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
        console.table({...data, element: 'Window'})
        confirm('Do you need more information?')
    })
```

This currently supports most keys in `windows OS` you can visit the [Home page]() to check the key code for your machine 

## How to use
### Install and Import

#### Using CDN
```js
<script type="module" src="https"></script>
```

#### Using a framework
- Install
    ```bash
    npm i KeyBinder
    ```
- Import
    ```js
    import {KeyBinder} from 'keyBinder'
    ```
        
### Initialize your controller object

- Define your keyboard Controller
```js
mport { KeyBinder as KeyBinder } from 'keyBinder'
const keyController = new KeyBinder({
    default_listner: 'keyup', // can be keydown, keypress
    element: window, // can be any element or window eg `docmuent.querySelector('.myeditor')
    // case_sensitive:true // this is if you want to make the listner case sensitive
})
```

- Add your listner

For easier and better coding experience it best to create a sub function like this 
```js
const ListenToKey = (key, ...data) => keyController.ListenToKey(key, data)
```
Then you can add listners like this 
```js 
istenToKey('B+G', () => {
        console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
        document.querySelector('#bcdiv').innerHTML += 'Your Called me ?'
    })

ListenToKey('shift+c', () => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    document.querySelector('#scdiv').innerHTML += 'Do you mean Ctrl+c? try Ctrl+c'
})

```
> OR this
```js
keyController.ListenToKey('enter', (data) => {
    console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
    console.table({...data, element: 'Window'})
    confirm('Do you need more information?')
})

keyController.ListenToKey('ctrl+space', () => {
console.log('%cThanks for using this by https://github.com/codad5 && https://github.com/ptbysr', 'background:blue;color:white;width:100%;height:50px;font-size:20px;')
document.querySelector('#scdiv').innerHTML += 'Do you mean Ctrl+c? try Ctrl+c'
})
```

Check Our Test Website to see the avaliable key commands for


| Key | Listner - Command | 
| :---: | :---: | 
| Control | ctrl |
| Shift | Shift |
| Alt | Alt |
| A | A |
| A...Z | A...Z | 
| A...Z | A...Z | 
| > | arrowup |
1 | !
1...9 | 1...9
f1...f9 | f1...f9
Windows - Home Buttom | meta
| Listen to any other key | ***

## Todos
- [ ] Add listner for mouse event
- [ ] Add Listner for Gamepad/JoyStick
- [ ] Add Listner for USB insert

> This is built by [Codad5](https://github.com/codad5) and [ptbysr](https://github.com/ptbysr) with ❤ and ⚡

