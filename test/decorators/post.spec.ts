import { Post } from '../../src/decorators';

describe('decorators/Post', () => {
	it('Has type "function"', () => expect(typeof Post).toBe('function'));
	it('Creates static object', () => {
		class A {
			@Post()
			method() {/**/}
		}
		expect((<any>A.prototype).paths).toBeInstanceOf(Array);
	});
	it('Method correctly adds to the object', () => {
		class A {
			@Post('foo')
			method() {/**/}
		}
		expect((<any>A.prototype).paths[0]).toMatchObject({
			method: 'POST',
			path: '/foo',
			executor: 'method'
		});
	});
});
