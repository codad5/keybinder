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

const ListenToKey = (key : string, ...data : any[]) => keyController.ListenToKey(key, ...data)

ListenToKey('q+p', () => {
    console.log('hello')
})

ListenToKey('ctrl+p', () => {
    console.log('hello')
})

ListenToKey('ctrl+p', () => {
    console.log('hello')
})

// test to check number of listeners
it('should have 2 listeners', () => {
    expect(keyController.getCombinations().length).toBe(2)
})

//duplicate should be removed
test(`no duplicate should be found`, () => {
    expect(keyController.getCombinations().length).not.toBe(3)
})

test('Getting a particular combination', () => {
    expect(keyController.getCombinationWith('p+q')).not.toBeNull()
    expect(keyController.getCombinationWith('p+q+z')).not.toBeDefined()
})

test('Will return general combination (***) if set', () => {
    ListenToKey('***', () => {console.log('hello')})
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
    expect(keyController.getCombinations().length).toBe(3)
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

