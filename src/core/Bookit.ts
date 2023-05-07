import { Server } from 'http';
import HttpWrapper from './HttpWrapper';
import HttpWrapperConfig from '../utils/interfaces/HttpWrapperConfig';
import Metadata from '../utils/interfaces/Metadata';
import Logger from '../utils/Logger';
import LogType from '../utils/enums/LogType';

/** BOOKit server class */
export default class Bookit {
	
	/** HttpWrapper instance */
	public readonly httpWrapper: HttpWrapper;
	
	public constructor();
	public constructor(config: Partial<HttpWrapperConfig>);
	
	public constructor(config?: Partial<HttpWrapperConfig>) {
		this.httpWrapper = new HttpWrapper(config);
	}
	
	/** Define routers */
	public addRouters(...routers: { new(...args: any[]): any }[]): void {
		for (const router of routers) {
			const instance = new router();
			const meta = instance.meta as Metadata;
			
			if (!meta) {
				Logger.out(LogType.warning, 'Router', router.name, 'doesn\'t have metadata');
				continue;
			}
			
			for (const path of meta.paths) {
				let prefix = meta.prefix.trim();
				if (!prefix.startsWith('/')) prefix = '/' + prefix;
				if (prefix.charAt(prefix.length - 1) === '/')
					prefix = prefix.substring(0, prefix.length - 1);
				
				let pathname = path.path.trim();
				if (!pathname.startsWith('/')) pathname = '/' + pathname;
				
				const pathParts = pathname.split('/').filter(Boolean);
				
				// Register request
				this.httpWrapper.onRequest((req, res) => {
					if (req.method !== path.method) return;
					
					const url = new URL(req.url);
					const urlParts = url.pathname.split('/').filter(Boolean);
					if (urlParts.length !== pathParts.length) return;
					
					const params: {
						name: string,
						value: string,
					}[] = [];
					
					for (let i = 0; i < urlParts.length; i++) {
						const inUrl = urlParts[i];
						const inPath = pathParts[i];
						if (inPath.startsWith(':')) {
							params.push({
								name: inPath.substring(1),
								value: inUrl
							});
							continue;
						}
						if (inUrl !== inPath) return;
					}
					
					// All ok, call method
					instance[path.executor]({
						request: { ...req, params: params },
						response: res
					});
				});
			}
		}
	}
	
	/** Start server */
	public get start(): HttpWrapper['start'] {
		return this.httpWrapper.start;
	}
	
	/** Stop server */
	public get stop(): HttpWrapper['stop'] {
		return this.httpWrapper.stop;
	}
	
	/** http.Server instance getter */
	public get server(): Server {
		return this.httpWrapper.server;
	}
}
