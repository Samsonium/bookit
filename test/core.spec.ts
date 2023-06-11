import { default as Bookit, Router, Get } from '../src/index';
import { Server } from 'http';
import { get } from 'http';

function fetch(path: URL): Promise<any> {
	return new Promise(r => {
		get(path, res => {
			let data = '';
			res.on('data', chunk => data += chunk);
			res.on('end', () => r(data));
		});
	});
}

describe('Core', () => {
	let kit: Bookit;
	beforeEach(() => kit = new Bookit);
	afterEach(() => kit.stop());

	it('Can instantiate', () => expect(new Bookit).toBeInstanceOf(Bookit));
	it('http.Server can instantiate', () => {
		expect(kit.server).toBeInstanceOf(Server);
	});
	it('Should routers can be added', () => {
		expect(kit.server.listenerCount('request')).toBe(0);

		@Router()
		class R {
			@Get()
			hw() {/**/}
		}

		kit.addRouters(R);
		expect(kit.server.listenerCount('request')).toBe(1);
	});
	it('Server normally responds for base route', (done) => {
		const testString = 'Hello, World!';

		@Router()
		class R {
			@Get()
			hw() {
				return testString;
			}
		}

		kit.addRouters(R);
		kit.start(7915).then(() => {
			fetch(new URL('http://localhost:7915/')).then(data => {
				expect(data).toBe(testString);
				done();
			});
		});
	});
	it('Can path params write to the context', done => {
		const testName = 'Samsonium';

		@Router('hello')
		class R {
			@Get(':name')
			greets({ request }) {
				return `Hello, ${ request.params.name }`;
			}
		}

		kit.addRouters(R);
		kit.start(7916).then(() => {
			fetch(new URL(`/hello/${testName}`, 'http://localhost:7916')).then(data => {
				expect(data).toBe(`Hello, ${testName}`);
				done();
			});
		});
	});
});
