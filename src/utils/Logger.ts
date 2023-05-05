import LogType from './enums/LogType';

/** Log utils */
export default class Logger {
	private static messageTypes = {
		[LogType.info]: 'INF',
		[LogType.warning]: 'WRN',
		[LogType.error]: 'ERR',
	};
	
	private static getPrefix(type: LogType): string {
		const date = new Date().toUTCString();
		const typePrefix = Logger.messageTypes[type];
		return `[${date}][${typePrefix}]:`;
	}
	
	/** Write message to console with specified type */
	public static out(type: LogType, ...parts: any[]): void {
		console.log(
			Logger.getPrefix(type),
			...parts
		);
	}
}
