# Key Bonder/Binder

This is a javascript library (both vallina and frameworks) for frontend that helps with keyboard binding and input devices in general within the browser

This currently supports most keys in `windows OS` you can visit the [Home page]() to check the key code for your machine 

## How to use
### Install and Import

#### Using Vallina javascript
```js
<script type="module">
    import { KeyBinder } from 'https://codad5.github.io/keybinder/out/index.js'
</script>
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
const keyController = new KeyBinder({
    default_listener: 'keyup', // can be keydown, keypress
    element: window, // can be any element or window eg `docmuent.querySelector('.myeditor')
    // case_sensitive:true // this is if you want to make the listener case sensitive
})
```

- Add your listener

For easier and better coding experience it best to create a sub function like this 
```js
const ListenToKey = (key, ...data) => keyController.ListenToKey(key, ...data)
```
Then you can add listeners like this 
```js 
istenToKey('B+G', () => {
        alert(`your called ${data.combination}`)
        document.querySelector('#bcdiv').innerHTML += 'Your Called me ?'
    })

ListenToKey('shift+c', () => {
    document.querySelector('#scdiv').innerHTML += 'Do you mean Ctrl+c? try Ctrl+c'
})

```
> OR this
```js
keyController.ListenToKey('enter', (data) => {
    alert(`your called ${data.combination}`)
    console.table({...data, element: 'Window'})
    
})

keyController.ListenToKey('ctrl+space', () => {
    alert(`your called ${data.combination}`)
    document.querySelector('#scdiv').innerHTML += 'Do you mean Ctrl+c? try Ctrl+c'
})
```

Check Our Test Website to see the avaliable key commands for


| Key | listener - Command | 
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
- [ ] Accept Your pull request ✔

> This is built by [Codad5](https://github.com/codad5) and [ptbysr](https://github.com/ptbysr) with ❤ and ⚡

