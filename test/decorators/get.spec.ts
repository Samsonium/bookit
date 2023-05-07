import { Get } from '../../src/decorators';

describe('decorators/Get', () => {
	it('Has type "function"', () => expect(typeof Get).toBe('function'));
	it('Creates static object', () => {
		class A {
			@Get()
			method() {/**/}
		}
		expect((<any>A.prototype).paths).toBeInstanceOf(Array);
	});
	it('Method correctly adds to the object', () => {
		class A {
			@Get('foo')
			method() {/**/}
		}
		expect((<any>A.prototype).paths[0]).toMatchObject({
			method: 'GET',
			path: '/foo',
			executor: 'method'
		});
	});
});
