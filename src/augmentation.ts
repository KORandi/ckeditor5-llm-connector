import type { LlmConnector } from './index.js';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ LlmConnector.pluginName ]: LlmConnector;
	}
}
