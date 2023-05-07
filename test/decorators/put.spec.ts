import { Put } from '../../src/decorators';

describe('decorators/Put', () => {
	it('Has type "function"', () => expect(typeof Put).toBe('function'));
	it('Creates static object', () => {
		class A {
			@Put()
			method() {/**/}
		}
		expect((<any>A.prototype).paths).toBeInstanceOf(Array);
	});
	it('Method correctly adds to the object', () => {
		class A {
			@Put('foo')
			method() {/**/}
		}
		expect((<any>A.prototype).paths[0]).toMatchObject({
			method: 'PUT',
			path: '/foo',
			executor: 'method'
		});
	});
});
