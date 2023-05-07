import { createServer, Server } from 'http';
import Logger from '../utils/Logger';

// Types
import LogType from '../utils/enums/LogType';
import HttpWrapperConfig from '../utils/interfaces/HttpWrapperConfig';

export default class HttpWrapper {
	
	/** Server configuration */
	public readonly config: HttpWrapperConfig;
	
	/** NodeJS server instance */
	public readonly server: Server;
	
	public constructor();
	public constructor(config: Partial<HttpWrapperConfig>);
	
	public constructor(config?: Partial<HttpWrapperConfig>) {
		this.config = {
			port: config?.port ?? 8080,
			logs: config?.logs ?? false,
			requests: {
				timeout: config?.requests?.timeout ?? false,
				bodyLimit: config?.requests?.bodyLimit ?? 1048576,
				caseSensitive: config?.requests?.caseSensitive ?? true,
				ignoreTrailingSlash: config?.requests?.ignoreTrailingSlash ?? false
			},
			response: {
				timeout: config?.response?.timeout ?? false
			}
		};
		this.server = createServer();
		this.server.requestTimeout = this.config.requests.timeout === false
			? 0 : this.config.requests.timeout;
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
	
	/** Add request event listener */
	public onRequest(fn: (req: InstanceType<typeof Request>, res: InstanceType<typeof Response>) => unknown): void {
		this.server.addListener('request', fn);
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
