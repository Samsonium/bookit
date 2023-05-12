
/** HttpWrapper class configuration */
interface HttpWrapperConfig {
	
	/** Should server log requests. Default: false */
	logs: boolean,
	
	/** Configuration for requests */
	requests: {
		
		/** Request timeout in milliseconds. Default: false */
		timeout: number | false,
		
		/** Request body size limit in bytes. Default: 1 MiB (1048576) */
		bodyLimit: number,
		
		/** Should be route case-sensitive. Default: true.
		 * Before changing this option, read this: https://tools.ietf.org/html/rfc3986#section-6.2.2.1 */
		caseSensitive: boolean,
		
		/** Should the router ignore the "/" character at the end. Default: false */
		ignoreTrailingSlash: boolean,
	},
	
	/** Configuration for responses */
	response: {
		
		/** Server response timeout in milliseconds. Default: false */
		timeout: number | false
	}
}

export default HttpWrapperConfig;
