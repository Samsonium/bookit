import { decorator } from '../utils/decorator';

export default function Patch(path?: string) {
	return decorator('PATCH', path);
}
