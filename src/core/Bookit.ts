import { Server } from 'http';
import HttpWrapper from './HttpWrapper';
import HttpWrapperConfig from '../utils/interfaces/HttpWrapperConfig';
import Metadata from '../utils/interfaces/Metadata';
import Logger from '../utils/Logger';
import LogType from '../utils/enums/LogType';
import * as path from 'path';

/** BOOKit server class */
export default class Bookit {

	/** HttpWrapper instance */
	public readonly httpWrapper: HttpWrapper;

	public constructor();
	public constructor(config: Partial<HttpWrapperConfig>);

	public constructor(config?: Partial<HttpWrapperConfig>) {
		let httpConfig: HttpWrapperConfig = {
			logs: false,
			requests: {
				timeout: false,
				bodyLimit: 1048576,
				caseSensitive: true,
				ignoreTrailingSlash: false,
			},
			response: {
				timeout: false,
			},
		};

		if (config) httpConfig = Object.assign(httpConfig, config);

		this.httpWrapper = new HttpWrapper(httpConfig);
	}

	/**
	 * Define routers
	 * @param routers Routers to be active
	 */
	public addRouters(...routers: FakeClass[]): void {
		for (const router of routers) {
			const instance = new router();
			const meta = instance.meta as Metadata;

			if (!meta) {
				Logger.out(LogType.warning, 'Router', router.name, 'doesn\'t have metadata');
				continue;
			}

			for (const path of meta.paths)
				this.makeRouteHandler(path, instance);
		}
	}

	/**
	 * Prepare full pathname
	 * @param prefix Router prefix
	 * @param pathname Path to handling function
	 * @private
	 */
	private prepareRoutePath(prefix: string, pathname: string): string {
		prefix = prefix.trim();
		pathname = pathname.trim();

		// Check for start slash
		if (!/\/(.+)?/.test(prefix))
			prefix = '/' + prefix;

		// Check for trailing slash
		if (/.+\//.test(prefix)) {
			if (/\/(.+)?/.test(pathname))
				pathname = pathname.substring(0, pathname.length - 1);
			else pathname = '/' + pathname;
		}

		return prefix + pathname;
	}

	/**
	 * Creates route handler
	 * @param path
	 * @param router
	 * @private
	 */
	private makeRouteHandler(path: Metadata['paths'][number], router: any): void {
		const expected = this.prepareRoutePath(router.meta.prefix, path.path)
			.split('/').filter(Boolean);

		// Register request
		this.httpWrapper.onRequest((req, res) => {
			if (req.method !== path.method) return;

			// Get requested pathname
			const got = req.url.split('/').filter(Boolean);
			if (got.length !== expected.length) return;

			// Create params list
			const params: {
				[name: string]: string,
			} = {};

			for (let i = 0; i < got.length; i++) {
				if (!expected[i].startsWith(':') && got[i] !== expected[i]) return;
				else if (expected[i].startsWith(':'))
					params[expected[i].substring(1)] = got[i];
			}

			// All ok, call method
			const result = router[path.executor]({
				request: { ...req, params },
				response: res,
			});

			// Set status if not set
			if (!res.statusCode)
				res.statusCode = 200;

			// Check for handler returned value type
			if (typeof result === 'object') {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(result));
			} else if (typeof result === 'function') {
				throw new Error('Cannot write out function');
			} else res.end(result);
		});
	}

	/** Start the server */
	public start(): Promise<void>;

	/** Start the server on specified port */
	public start(port: number): Promise<void>;

	public async start(port?: number): Promise<void> {
		await this.httpWrapper.start(port);
	}

	/** Stop the server */
	public async stop(): Promise<void>;

	/** Stop the server with specified reason */
	public async stop(reason: string): Promise<void>;

	public async stop(reason?: string) {
		await this.httpWrapper.stop(reason);
	}

	/** http.Server instance getter */
	public get server(): Server {
		return this.httpWrapper.server;
	}
}
