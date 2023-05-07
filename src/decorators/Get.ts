import { decorator } from '../utils/decorator';

export default function Get(path?: string) {
	return decorator('GET', path);
}
