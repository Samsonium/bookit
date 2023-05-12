import { decorator } from '../utils/decorator';

/**
 * REST API DELETE
 * @param path Pathname in URL
 * @returns {MethodDecorator}
 */
export default function Delete(path?: string) {
	return decorator('DELETE', path);
}
