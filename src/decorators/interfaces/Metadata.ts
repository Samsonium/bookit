
/** Metadata format */
interface Metadata {
	prefix: string,
	paths: {
		method: string,
		path: string,
		executor: string | symbol
	}[]
}

export default Metadata;
