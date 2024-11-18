import type { LlmConnector } from './index';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[LlmConnector.pluginName]: LlmConnector;
	}
}
