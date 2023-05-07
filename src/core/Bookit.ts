import { Server } from 'http';
import HttpWrapper from './HttpWrapper';
import HttpWrapperConfig from '../utils/interfaces/HttpWrapperConfig';

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
	public addRouters(...routers: { new(...args: any[]): any[] }[]): void {
		//
	}
	
	/** http.Server instance getter */
	public get server(): Server {
		return this.httpWrapper.server;
	}
}
