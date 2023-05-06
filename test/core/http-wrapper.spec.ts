import HttpWrapper from '../../src/core/HttpWrapper';

describe('core/HttpWrapper', () => {
	let spy: jest.SpyInstance;
	beforeEach(() => (spy = jest.spyOn(console, 'log').mockImplementation(() => {/**/})));
	afterEach(() => spy.mockRestore());
	
	test('Should initialize', () => expect(new HttpWrapper).toBeInstanceOf(HttpWrapper));
	test('Has "isRunning" getter', () => expect(new HttpWrapper().isRunning).not.toBe(undefined));
	test('Has "usingPort" getter', () => expect(new HttpWrapper().usingPort).not.toBe(undefined));
	test('Has public field named "config"', () => {
		const httpWrapper = new HttpWrapper();
		expect(httpWrapper.config).toBeInstanceOf(Object);
	});
	test('Config contains necessary fields with default values', () => {
		const httpWrapper = new HttpWrapper();
		
		// Common config
		expect(httpWrapper.config.port).toBe(8080);
		expect(httpWrapper.config.logs).toBe(false);
		
		// Requests config
		expect(httpWrapper.config.requests).toBeInstanceOf(Object);
		expect(httpWrapper.config.requests.timeout).toBe(false);
		expect(httpWrapper.config.requests.bodyLimit).toBe(1024 * 1024); // 1 MiB
		expect(httpWrapper.config.requests.caseSensitive).toBe(true);
		expect(httpWrapper.config.requests.ignoreTrailingSlash).toBe(false);
		
		// Response config
		expect(httpWrapper.config.response).toBeInstanceOf(Object);
		expect(httpWrapper.config.response.timeout).toBe(false);
	});
	test('Can start and stop', () => {
		const httpWrapper = new HttpWrapper();
		httpWrapper.start();
		expect(httpWrapper.isRunning).toBe(true);
		httpWrapper.stop();
		expect(httpWrapper.isRunning).toBe(false);
	});
	test('Can start and stop with specified port', () => {
		const httpWrapper = new HttpWrapper();
		httpWrapper.start(7910);
		expect(httpWrapper.isRunning).toBe(true);
		expect(httpWrapper.usingPort).toBe(7910);
		httpWrapper.stop();
		expect(httpWrapper.isRunning).toBe(false);
	});
	test('Can start and stop with startup message', async () => {
		const httpWrapper = new HttpWrapper();
		await httpWrapper.start(7910, 'Hello, world!');
		expect(spy.mock.calls[0][1]).toBe('Hello, world!');
		await httpWrapper.stop();
	});
	test('Can stop with stop reason message', async () => {
		const httpWrapper = new HttpWrapper();
		const reason = 'Some reason';
		await httpWrapper.start(7910);
		await httpWrapper.stop(reason);
		expect(reason).toBe(reason);
	});
	test('Method "onRequest" works properly', () => {
		const httpWrapper = new HttpWrapper();
		const beforeCount = httpWrapper.server.listenerCount('request');
		httpWrapper.onRequest(() => []);
		const afterCount = httpWrapper.server.listenerCount('request');
		expect(afterCount).toBe(beforeCount + 1);
	});
});
