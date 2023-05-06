import Router from '../../src/decorators/router';

describe('decorators/Router', () => {
	it('Has type "function"', () => expect(typeof Router).toBe('function'));
	it('Has return type "function"', () => expect(typeof Router()).toBe('function'));
});
