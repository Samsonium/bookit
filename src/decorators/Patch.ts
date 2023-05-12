import { decorator } from '../utils/decorator';

/**
 * REST API PATCH
 * @param path Pathname in URL
 * @returns {MethodDecorator}
 */
export default function Patch(path?: string) {
	return decorator('PATCH', path);
}
