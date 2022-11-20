import { defaults } from 'jest-config';
const config = {
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts'],
    transform: {}
};
export default config;
