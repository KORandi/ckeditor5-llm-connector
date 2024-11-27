import { LlmConnectorData } from './llm-connector-data';

export interface LlmConnectorConfig {
	icon?: string;
	label?: string;
	initData?: LlmConnectorData;
	onParameterSubmit?: (data: LlmConnectorData) => void;
}
