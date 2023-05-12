import { decorator } from '../utils/decorator';

/**
 * REST API PUT
 * @param path Pathname in URL
 * @returns {MethodDecorator}
 */
export default function Put(path?: string) {
	return decorator('PUT', path);
}
