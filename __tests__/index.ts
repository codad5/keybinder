/**
 * @jest-environment jsdom
 */
import {jest} from '@jest/globals';

jest.useFakeTimers();
import KeyBinder from '../src/index'


const keyController = new KeyBinder({
    listener_type: 'keydown',
    element: window,
    case_sensitive: false
})

const ListenToKey = (key : string, ...data : any[]) => keyController.ListenToKey(key, ...data)

ListenToKey('q+p', () => {
    console.log('hello')
})

ListenToKey('***', () => {
    console.log('hello')
})
ListenToKey('ctrl+p', () => {
    console.log('hello')
})

ListenToKey('ctrl+p', () => {
    console.log('hello')
})

//test
describe('Keybinder', () => {
    it('should be defined', () => {
        expect(KeyBinder).toBeDefined()
    })
})

// test to check number of listeners
test('should have 3 listeners', () => {
    expect(keyController.getCombinations().length).toBe(3)
})

//duplicate should be removed
test(`no duplicate should be found`, () => {
    expect(keyController.getCombinations().length).toBe(3)
})

test(`last combination should be '***'`, () => {
    expect(keyController.getCombinations()[keyController.getCombinations().length - 1].combination).toBe('***')
})

test(`all combination are cleared`, () => {
    keyController.clear()
    expect(keyController.getCombinations().length).toBe(0)
})

test('restore method is working' , () => {
    keyController.restore()
    expect(keyController.getCombinations().length).toBe(3)
})