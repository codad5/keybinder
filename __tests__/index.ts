/**
 * @jest-environment jsdom
 */
import {jest} from '@jest/globals';

jest.useFakeTimers();

import KeyBinder from '../src/index'


const keyController = new KeyBinder({
    listener_type: 'keydown',
    element: window,
    case_sensitive: true
})

it('keybinder should be defined', () => {
    expect(KeyBinder).toBeDefined()
})

const ListenToKey = (key : string, ...data : any[]) => keyController.ListenToKey(key, ...data);
var keycom : string[] = []

const addListener = (...key: string[]) => {
    
    return keycom = [...keycom, ...key].map((v: string) => {
        ListenToKey(v, () => {
            console.log('hello')
        })
        return v
    }).filter((value, index, self) => self.findIndex(v => v === value) === index)
}

keycom = addListener('q+p','ctrl+p','ctrl+p','control+z')
// ListenToKey('q+p', () => {
//     console.log('hello')
// })

// ListenToKey('ctrl+p', () => {
//     console.log('hello')
// })

// ListenToKey('ctrl+p', () => {
//     console.log('hello')
// })
// ListenToKey('control+z', () => {
//     console.log('hello')
// })

// test to check number of listeners
test('Key combination array should not have duplicate', () => {
    expect(keycom.length).toBe(3)
})
it('should have 2 listeners', () => {
    expect(keyController.getCombinations().length).toBe(keycom.length)
})


//duplicate should be removed
test(`no duplicate should be found`, () => {
    expect(keyController.getCombinations().length).not.toBeGreaterThan(keycom.length)
})

test('Control is converted to ctrl', () => {
    expect(keyController.getCombinationWith('ctrl+z')).not.toBeNull()
    expect(keyController.getCombinationWith('ctrl+z')).toBeDefined()
})

test('Getting a particular combination', () => {
    expect(keyController.getCombinationWith('p+q')).not.toBeNull()
    expect(keyController.getCombinationWith('p+q+z')).not.toBeDefined()
})

test('Will return general combination (***) if set', () => {
    addListener('***')
    expect(keyController.getCombinationWith('p+q+z').combination).toBe('***')
})

test(`last combination should be '***'`, () => {
    expect(keyController.getCombinations()[keyController.getCombinations().length - 1].combination).toBe('***')
})

test(`Clear Method is working `, () => {
    keyController.clear()
    expect(keyController.getCombinations().length).toBe(0)
})

test('restore method is working' , () => {
    keyController.restore()
    console.log(keyController.getCombinations())
    expect(keyController.getCombinations().length).toBe(keycom.length)
})

test('setting property has all default props', () => {
    expect(keyController.settings).toHaveProperty(['element'])
    expect(keyController.settings).toHaveProperty(['listener_type'])
    expect(keyController.settings).toHaveProperty(['allow_default'])
    expect(keyController.settings).toHaveProperty(['case_sensitive'])
})

test('set method chanages the property value', () => {
    expect(keyController.set({
        case_sensitive: false
    }).settings).toHaveProperty('case_sensitive', false)
})

