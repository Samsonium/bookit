import { createServer, Server } from 'http';
import Logger from '../utils/Logger';

// Types
import LogType from '../utils/enums/LogType';
import HttpWrapperConfig from './interfaces/HttpWrapperConfig';

export default class HttpWrapper {
	
	/** Server configuration */
	public readonly config: HttpWrapperConfig;
	
	/** NodeJS server instance */
	public readonly server: Server;
	
	public constructor() {
		this.config = {
			port: 8080,
			logs: false,
			requests: {
				timeout: false,
				bodyLimit: 1048576,
				caseSensitive: true,
				ignoreTrailingSlash: false
			},
			response: {
				timeout: false
			}
		};
		this.server = createServer();
	}
	
	/** Launch server */
	public start(): Promise<void>;
	
	/** Launch server on specified port */
	public start(port: number): Promise<void>;
	
	/** Launch server on specified port and write message */
	public start(port: number, startup: string): Promise<void>;
	
	public start(port?: number, startup?: string) {
		return new Promise<void>((resolve, reject) => {
			const startOnPort = port ?? this.config.port;
			const onStartup = () => {
				if (startup) Logger.out(LogType.info, startup);
				resolve();
			};
			
			try {
				this.server.listen(startOnPort, onStartup);
			} catch (e) {
				Logger.out(LogType.error, 'Server stopped. Reason:', e.message ?? 'not provided\n', e);
				reject();
			}
		});
	}
	
	/** Stop server */
	public stop(): Promise<void>;
	
	/** Stop server and write to console message */
	public stop(reason: string): Promise<void>;
	
	public stop(reason?: string) {
		return new Promise<void>(resolve => {
			this.server.close(() => {
				if (reason) Logger.out(LogType.info, reason);
				resolve();
			});
		});
	}
	
	/** Server running state getter */
	public get isRunning(): boolean {
		return this.server.listening;
	}
	
	/** Server listening port getter */
	public get usingPort(): number {
		const address = this.server.address();
		if (address) {
			if (typeof address === 'string')
				return parseInt(new URL(address).port);
			else return address.port;
		} else return this.config.port;
	}
}
