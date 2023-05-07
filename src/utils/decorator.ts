import Metadata from './interfaces/Metadata';

export type RESTMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Get REST method decorator */
export function decorator(method: RESTMethods, path?: string): MethodDecorator {
	return (target, pk) => {
		target['paths'] ||= [];
		
		if (target['paths'].find(path => path.executor === pk))
			return;
		
		(target['paths'] as Metadata['paths']).push({
			method,
			path: path?.trim()?.startsWith('/')
				? path.trim() : '/' + (path?.trim() ?? ''),
			executor: pk
		});
	};
}
