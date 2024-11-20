import { Plugin } from 'ckeditor5';
import ParameterConfigUI from './parameter-config-ui';

export default class LlmConnector extends Plugin {
	static get requires() {
		return [ParameterConfigUI];
	}

	public static get pluginName(): 'ParameterConfigUI' {
		return 'ParameterConfigUI';
	}
}
