# Key Bonder/Binder

This is a javascript library (both vallina and frameworks) for frontend that helps with keyboard binding .

This currently supports most keys in `windows OS` you can visit the [Home page](https://codad5.github.io/keybinder/) to check the key code for your machine 

### Requirement 
- Your script need to be running on a web server, for development you could use,
    - live server extension is vscode 
    - node npx server by running `npx serve`
  - to avoid errors like 
  ![KeyBinder Cors error](.git/img/cors-error.png)
    
## How to use
### Install and Import

#### Using Vallina javascript
```js
<script src="https://codad5.github.io/keybinder/lib/keybinder.js"></script>
```

#### Using a framework
- Install
```bash
npm i domkeybinder
```
- Import
```js
import KeyBinder from 'domkeybinder'
```
        
### Initialize your controller object

- Define your keyboard Controller
```js
const keyController = new KeyBinder({
    default_listener: 'keyup', // can be keydown, keypress
    element: window, // can be any element or window eg `docmuent.querySelector('.myeditor')
    // case_sensitive:true, // this is if you want to make the listener case sensitive
    allow_default: true // this is set to default of false and prevents any default keyboard action
})
```

- Add your listener

For easier and better coding experience it best to create a sub function like this 
```js
const ListenToKey = (key, ...data) => keyController.ListenToKey(key, ...data)
```
Then you can add listeners like this 
```js 
ListenToKey('B+G', () => {
    //your code...
})

ListenToKey('shift+c', () => {
    //your code...
})

```
> OR this
```js
keyController.ListenToKey('enter', (data) => {
    //your code...
})

keyController.ListenToKey('ctrl+space', () => {
    //your code...
})
```

#### Diffrent Combination one action
This is if you want to one action(callback), tied to different combination
```js
ListenToKey('ctrl+space', 'ctrl+m', () => {
    alert(`your called ${data.combination}`)
    document.querySelector('#scdiv').innerHTML += 'Do you mean Ctrl+c? try Ctrl+c'
})
```

#### Avaliable methods

| method | Description |
| :---: | :---: |
| ListenToKey | Add new Listener |
| getCombinations | Get all avaliable combinations|
| clear | Remove all avaliable combinations|
| restore | Restore all previous avaliable combinations|



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

