import { decorator } from '../utils/decorator';

export default function Put(path?: string) {
	return decorator('PUT', path);
}
