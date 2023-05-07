import Logger from '../../src/utils/Logger';
import LogType from '../../src/utils/enums/LogType';

describe('utils/Logger class', () => {
	
	// Spy on console.log
	let spy: jest.SpyInstance;
	beforeEach(() => (spy = jest.spyOn(console, 'log').mockImplementation(() => {/**/})));
	afterEach(() => spy.mockRestore());
	
	// Method: Logger.out
	
	test('Has "out" static method', () => expect(typeof Logger.out).toBe('function'));
	test('Has "out" is callable', () => {
		Logger.out(LogType.info, 'Hello,', 'World!');
		expect(spy.mock.calls[0].join(' ')).toContain('Hello, World!');
	});
	test('Has "out(info)" works properly', () => {
		Logger.out(LogType.info, '1');
		expect(spy.mock.calls[0][0]).toContain('INF');
	});
	test('Has "out(warning)" works properly', () => {
		Logger.out(LogType.warning, '1');
		expect(spy.mock.calls[0][0]).toContain('WRN');
	});
	test('Has "out(error)" works properly', () => {
		Logger.out(LogType.error, '1');
		expect(spy.mock.calls[0][0]).toContain('ERR');
	});
	test('Has "out" doesnt write undefined with no message', () => {
		Logger.out(LogType.error);
		expect(spy.mock.calls[0][1]).not.toContain('undefined');
	});
	test('Has "out" write "<empty>" when no message provided', () => {
		Logger.out(LogType.error);
		expect(spy.mock.calls[0][1]).toContain('<empty>');
	});
});
