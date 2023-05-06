import HttpWrapperConfig from './interfaces/HttpWrapperConfig';

export default class HttpWrapper {
	
	/** Server configuration */
	public readonly config: HttpWrapperConfig;
	
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
	}
}
