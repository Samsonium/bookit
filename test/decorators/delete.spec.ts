import { Delete } from '../../src/decorators';

describe('decorators/Delete', () => {
	it('Has type "function"', () => expect(typeof Delete).toBe('function'));
	it('Creates static object', () => {
		class A {
			@Delete()
			method() {/**/}
		}
		expect((<any>A.prototype).paths).toBeInstanceOf(Array);
	});
	it('Method correctly adds to the object', () => {
		class A {
			@Delete('foo')
			method() {/**/}
		}
		expect((<any>A.prototype).paths[0]).toMatchObject({
			method: 'DELETE',
			path: '/foo',
			executor: 'method'
		});
	});
});
