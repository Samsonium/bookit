import Bookit from '../../src/core/Bookit';
import { Server } from 'http';
import { Router, Get } from '../../src/decorators';
import { get } from 'http';

describe('core/Bookit', () => {
	it('Can initialize', () => expect(new Bookit).toBeInstanceOf(Bookit));
	it('Has "addRouters" method to use routers', () => {
		expect(typeof new Bookit().addRouters).not.toBe(undefined);
	});
	it('Has "start" method', () => {
		expect(typeof new Bookit().start).not.toBe(undefined);
	});
	it('Has "stop" method', () => {
		expect(typeof new Bookit().stop).not.toBe(undefined);
	});
	it('Has "server" field (http.Server instance)', () => {
		const kit = new Bookit();
		expect(kit.server).toBeInstanceOf(Server);
	});
	it('Routers can add', () => {
		const kit = new Bookit();
		expect(kit.server.listenerCount('request')).toBe(0);
		
		@Router()
		class SomeRouter {
			@Get()
			helloWorld() {/**/}
		}
		
		kit.addRouters(SomeRouter);
		expect(kit.server.listenerCount('request')).toBe(1);
	});
	it('Server normally responds for base router', (resolve) => {
		const kit = new Bookit();

		@Router()
		class BaseRouter {

			@Get()
			helloWorld() {
				return '<h1>Hello, World!</h1>';
			}
		}

		kit.addRouters(BaseRouter);
		kit.start(7910).then(() => {
			get(new URL('http://localhost:7910/'), (res) => {
				let data = '';

				res.on('data', chunk => data += chunk);
				res.on('end', () => {
					expect(data).toBe('<h1>Hello, World!</h1>');
					kit.stop().then(resolve);
				});
			}).on('error', () => kit.stop().then(resolve));
		});
	});
});
