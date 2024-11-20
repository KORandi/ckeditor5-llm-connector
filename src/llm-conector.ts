import { Dialog, Plugin } from 'ckeditor5';

export default class LlmConnector extends Plugin {
	static get requires() {
		return [Dialog];
	}

	public static get pluginName(): 'LlmConnector' {
		return 'LlmConnector';
	}
}
