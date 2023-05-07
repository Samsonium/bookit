import LogType from './enums/LogType';

/** Log utils */
export default class Logger {
	private static messageTypes = {
		[LogType.info]: 'INF',
		[LogType.warning]: 'WRN',
		[LogType.error]: 'ERR',
	};
	
	/** Datetime formatter */
	private static dtFormat = new Intl.DateTimeFormat('ru-RU', {
		hourCycle: 'h23',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		day: '2-digit',
		month: '2-digit',
		year: '2-digit'
	});
	
	/** Message prefix generation method */
	private static getPrefix(type: LogType): string {
		const date = this.dtFormat.format(new Date()).replace(', ', '-');
		const typePrefix = Logger.messageTypes[type];
		return `[${date}][${typePrefix}]:`;
	}
	
	/** Write message to console with specified type */
	public static out(type: LogType, ...parts: unknown[]): void {
		if (parts.length) console.log(
			Logger.getPrefix(type),
			...parts
		);
		else console.log(Logger.getPrefix(type), '<empty>');
	}
}
