import { Plugin } from 'ckeditor5';

export default class LlmConnector extends Plugin {
	public static get pluginName() {
		return 'LlmConnector' as const;
	}

	public init(): void {}
}
