import { decorator } from '../utils/decorator';

/**
 * REST API GET
 * @param path Pathname in URL
 * @returns {MethodDecorator}
 */
export default function Get(path?: string) {
	return decorator('GET', path);
}
