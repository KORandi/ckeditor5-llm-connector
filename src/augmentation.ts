import type ParameterConfigUI from './parameter-config-ui';

declare module '@ckeditor/ckeditor5-core' {
	interface PluginsMap {
		[ParameterConfigUI.pluginName]: ParameterConfigUI;
	}
}
