
/** Metadata format */
interface Metadata {
	prefix: string,
	paths: {
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
		path: string,
		executor: string | symbol
	}[]
}

export default Metadata;
