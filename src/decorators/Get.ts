import Metadata from './interfaces/Metadata';

export default function Get(path?: string) {
	return (target: any, pk: string | symbol) => {
		target['paths'] ||= [];
		(target['paths'] as Metadata['paths'][number][]).push({
			method: 'GET',
			path: path?.trim()?.startsWith('/')
				? path.trim() : '/' + (path?.trim() ?? ''),
			executor: pk
		});
	};
}
