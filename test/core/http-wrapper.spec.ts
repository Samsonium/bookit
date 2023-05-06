import HttpWrapper from '../../src/core/HttpWrapper';

describe('core/HttpWrapper', () => {
	test('Should initialize', () => expect(new HttpWrapper).toBeInstanceOf(HttpWrapper));
	test('Has public field named "config"', () => {
		const httpWrapper = new HttpWrapper();
		expect(httpWrapper.config).toBeInstanceOf(Object);
	});
	test('Config contains necessary fields with default values', () => {
		const httpWrapper = new HttpWrapper();
		
		// Common config
		expect(httpWrapper.config.port).toBe(80);
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
});
