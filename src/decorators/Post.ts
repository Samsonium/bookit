import { decorator } from '../utils/decorator';

/**
 * REST API POST
 * @param path Pathname in URL
 * @returns {MethodDecorator}
 */
export default function Post(path?: string) {
	return decorator('POST', path);
}
