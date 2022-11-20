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

const ListenToKey = (key, ...data) => keyController.ListenToKey(key, ...data)

ListenToKey('q+p', () => {
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