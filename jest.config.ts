import type {Config} from 'jest';
import {defaults} from 'jest-config';

const config: Config = {
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
  transform: {},
  preset: 'ts-jest',
  //dom environment
  testEnvironment: 'jsdom',
};

export default config;