import { decorator } from '../utils/decorator';

export default function Post(path?: string) {
	return decorator('POST', path);
}
