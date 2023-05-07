import Bookit from '../../src/core/Bookit';
import { Server } from 'http';

describe('core/Bookit', () => {
	it('Can initialize', () => expect(new Bookit).toBeInstanceOf(Bookit));
	it('Has "addRouters" method to use routers', () => {
		expect(typeof new Bookit().addRouters).not.toBe(undefined);
	});
	it('Has "server" field (http.Server instance)', () => {
		const kit = new Bookit();
		expect(kit.server).toBeInstanceOf(Server);
	});
});
