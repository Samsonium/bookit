import { decorator } from '../utils/decorator';

export default function Delete(path?: string) {
	return decorator('DELETE', path);
}
