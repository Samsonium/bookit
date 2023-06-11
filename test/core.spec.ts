import { default as Bookit, Router, Get } from '../src/index';
import { Server } from 'http';
import { get } from 'http';

function fetch(path: URL): Promise<any> {
	return new Promise(r => {
		get(path, res => {
			let data = '';
			res.on('data', chunk => data += chunk);
			res.on('end', () => r(data || res.statusCode));
		});
	});
}

describe('Core', () => {
	let kit: Bookit;
	afterEach(() => {
		kit?.stop();
		kit = null;
	});

	it('Can instantiate', () => expect(new Bookit).toBeInstanceOf(Bookit));
	it('http.Server can instantiate', () => {
		kit = new Bookit;
		expect(kit.server).toBeInstanceOf(Server);
	});
	it('Should routers can be added', () => {
		kit = new Bookit;
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

		kit = new Bookit;
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

		kit = new Bookit;
		kit.addRouters(R);
		kit.start(7916).then(() => {
			fetch(new URL(`/hello/${testName}`, 'http://localhost:7916')).then(data => {
				expect(data).toBe(`Hello, ${testName}`);
				done();
			});
		});
	});
	it('Server stops with specified reason', done => {
		const spy = jest.spyOn(console, 'log').mockImplementation(() => {/**/});

		kit = new Bookit;
		kit.start(7992);
		kit.stop('Stopped').then(() => {
			expect(spy.mock.lastCall[1]).toContain('Stopped');
			spy.mockRestore();
			done();
		});
	});
	it('Can main class log registered paths', done => {
		const spy = jest.spyOn(console, 'log').mockImplementation(() => {/**/});

		@Router()
		class R {

			@Get('test-route')
			test() {/**/}
		}

		kit = new Bookit({
			logs: true
		});
		kit.addRouters(R);
		kit.start(7922).then(() => {
			expect(spy.mock.calls[0].join(' ')).toContain('test-route');
			spy.mockRestore();
			done();
		});
	});
	it('Whether a message is displayed in the log if there are no registered paths', done => {
		const spy = jest.spyOn(console, 'log').mockImplementation(() => {/**/});

		kit = new Bookit({
			logs: true
		});
		kit.start(7921).then(() => {
			expect(spy.mock.calls[0].join(' ')).toContain('No routes are registered');
			spy.mockRestore();
			done();
		});
	});
	it('Should 404 work', done => {
		kit = new Bookit();
		kit.start(7924).then(() => {
			fetch(new URL('http://localhost:7924')).then(data => {
				expect(data).toBe(404);
				done();
			});
		});
	});
	it('Should 404 work with defined routes', done => {
		kit = new Bookit();

		@Router()
		class R {

			@Get()
			hello() {
				return 'Hello, World!';
			}
		}

		kit.addRouters(R);
		kit.start(7953).then(() => {
			fetch(new URL('http://localhost:7953')).then(data => {
				expect(data).toBe('Hello, World!');
				fetch(new URL('/abc', 'http://localhost:7953')).then(data => {
					expect(data).toBe(404);
					done();
				});
			});
		});
	});
});
