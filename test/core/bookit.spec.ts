import Bookit from '../../src/core/Bookit';
import { Server } from 'http';
import { Router, Get } from '../../src/decorators';

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
});
