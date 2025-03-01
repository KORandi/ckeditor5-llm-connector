import { LlmConnectorConfig } from './interfaces/llm-connector-config';
import type LlmConnector from './llm-conector';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[LlmConnector.pluginName]: LlmConnector;
	}

	interface EditorConfig {
		llmConnector?: LlmConnectorConfig;
	}
}
