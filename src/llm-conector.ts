import { Dialog, Plugin } from 'ckeditor5';
import LlmConnectorParameterConfigUI from './llm-connector-parameter-config-ui';

export default class LlmConnector extends Plugin {
	static get requires() {
		return [Dialog, LlmConnectorParameterConfigUI];
	}

	public static get pluginName(): 'LlmConnector' {
		return 'LlmConnector';
	}
}
