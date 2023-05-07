import { Router, getRouterMeta } from '../../src/decorators';

describe('decorators/Router', () => {
	it('Has type "function"', () => expect(typeof Router).toBe('function'));
	it('Has return type "function"', () => expect(typeof Router()).toBe('function'));
	it('Has metadata on use', () => {
		@Router()
		class TestClass {}
		
		const classMeta = getRouterMeta(TestClass);
		expect(Object.keys(classMeta)).toContain('prefix');
	});
	it('Metadata sets correctly', () => {
		@Router()
		class A {}
		expect(getRouterMeta(A).prefix).toBe('/');
		
		@Router('some-prefix')
		class B {}
		expect(getRouterMeta(B).prefix).toBe('/some-prefix');
	});
});
