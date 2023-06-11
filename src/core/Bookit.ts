import HttpWrapperConfig from '../utils/interfaces/HttpWrapperConfig';
import RequestHandler from '../utils/interfaces/RequestHandler';
import Metadata from '../utils/interfaces/Metadata';
import LogType from '../utils/enums/LogType';
import HttpWrapper from './HttpWrapper';
import Logger from '../utils/Logger';
import { Server } from 'http';

/** BOOKit server class */
export default class Bookit {
	private readonly routes: string[];
	private readonly handlers: RequestHandler[];

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
		this.routes = [];
		this.handlers = [];
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

		return '/' + (prefix + '/' + pathname).split('/').filter(Boolean).join('/');
	}

	/**
	 * Creates route handler
	 * @param path
	 * @param router
	 * @private
	 */
	private makeRouteHandler(path: Metadata['paths'][number], router: any): void {
		const prepared = this.prepareRoutePath(router.meta.prefix, path.path);
		this.routes.push(prepared);

		const expected = prepared.split('/').filter(Boolean);

		// Register request
		this.handlers.push({
			path: prepared,
			method: path.method,
			handler: async (req, res) => {
				const got = (new URL(req.url)).pathname.split('/').filter(Boolean);

				// Create params list
				const params: {
					[name: string]: string,
				} = {};

				for (let i = 0; i < got.length; i++) {
					if (!expected[i].startsWith(':') && got[i] !== expected[i]) return;
					else if (expected[i].startsWith(':'))
						params[expected[i].substring(1)] = got[i];
				}

				// Extract cookies
				const cookie: {
					[name: string]: string
				} = {};
				if (req.headers.cookie) {
					const receivedCookie = req.headers.cookie.split(';')?.filter(Boolean)?.map(c => c.trim());
					for (const c of receivedCookie ?? []) {
						const data = c.split('=').map(item => item.trim());
						cookie[data[0]] = data[1];
					}
				}

				// All ok, call method
				const result = router[path.executor]({
					request: { ...req, params, cookie },
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
			}
		});
	}

	/** Start the server */
	public start(): Promise<void>;

	/** Start the server on specified port */
	public start(port: number): Promise<void>;

	public async start(port?: number): Promise<void> {
		this.httpWrapper.onRequest(async (req, res) => {
			let found: RequestHandler['handler'] = null;

			for (const h of this.handlers) {
				const { method, path, handler } = h;
				const expected = path.split('/').filter(Boolean);
				const got = (new URL(req.url)).pathname.split('/').filter(Boolean);
				if (method !== req.method || got.length !== expected.length)
					continue;

				found = handler;
			}

			if (found) await found(req, res);
			else {
				res.statusCode = 404;
				res.end();
			}
		});

		if (this.httpWrapper.config.logs) {
			if (this.routes.length) {
				const result = this.routes.join('\n- ');
				Logger.out(LogType.info, 'Registered routes:', '\n -' + result);
			} else Logger.out(LogType.info, 'No routes are registered');
		}

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

	/** Server running state */
	public get isRunning(): boolean {
		return this.httpWrapper.isRunning;
	}

	/** Using port */
	public get port(): number {
		return this.httpWrapper.usingPort;
	}

	/** Get listeners count */
	public get listenerCount(): number {
		return this.handlers.length;
	}
}
