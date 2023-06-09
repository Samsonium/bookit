import Metadata from '../utils/interfaces/Metadata';

/**
 * Creates a new router
 * @param prefix Router prefix pathname in URL
 */
export default function Router(prefix?: string) {
	return <T extends { new(...args: any[]): any }>(base: T) => {
		return class extends base {
			public meta: Metadata;
			
			constructor(...args: any[]) {
				super(...args);
				
				const prefixChecked = prefix?.startsWith('/')
					? prefix?.trim() : '/' + (prefix?.trim() ?? '');
				
				const paths = base.prototype['paths'];
				
				this.meta = {
					prefix: prefixChecked,
					paths: paths ?? []
				};
			}
		};
	};
}

/** Get router metadata */
export function getRouterMeta(router: any): Metadata {
	return (new router()).meta satisfies Metadata;
}
