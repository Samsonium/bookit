import Logger from '../src/utils/Logger';
import LogType from '../src/utils/enums/LogType';

describe('Logger class', () => {
	test('Has "out" static method', () => expect(typeof Logger.out).toBe('function'));
	test('Has "out" is callable', () => {
		const spy = jest.spyOn(console, 'log').mockImplementation();
		
		Logger.out(LogType.info, 'Hello,', 'World!');
		expect(spy.mock.calls[0].join(' ')).toContain('Hello, World!');
		
		spy.mockRestore();
	});
	test('Has "out(info)" works properly', () => {
		const spy = jest.spyOn(console, 'log').mockImplementation();
		
		Logger.out(LogType.info, '1');
		expect(spy.mock.calls[0][0]).toContain('INF');
		
		spy.mockRestore();
	});
	test('Has "out(warning)" works properly', () => {
		const spy = jest.spyOn(console, 'log').mockImplementation();
		
		Logger.out(LogType.warning, '1');
		expect(spy.mock.calls[0][0]).toContain('WRN');
		
		spy.mockRestore();
	});
	test('Has "out(error)" works properly', () => {
		const spy = jest.spyOn(console, 'log').mockImplementation();
		
		Logger.out(LogType.error, '1');
		expect(spy.mock.calls[0][0]).toContain('ERR');
		
		spy.mockRestore();
	});
});
