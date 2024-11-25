import { LlmConnectorData } from './llm-connector-data';

export interface LlmConnectorConfig {
	initData?: LlmConnectorData;
	onParameterSubmit?: (data: LlmConnectorData) => void;
}
