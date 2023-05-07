import { Patch } from '../../src/decorators';

describe('decorators/Patch', () => {
	it('Has type "function"', () => expect(typeof Patch).toBe('function'));
	it('Creates static object', () => {
		class A {
			@Patch()
			method() {/**/}
		}
		expect((<any>A.prototype).paths).toBeInstanceOf(Array);
	});
	it('Method correctly adds to the object', () => {
		class A {
			@Patch('foo')
			method() {/**/}
		}
		expect((<any>A.prototype).paths[0]).toMatchObject({
			method: 'PATCH',
			path: '/foo',
			executor: 'method'
		});
	});
});
