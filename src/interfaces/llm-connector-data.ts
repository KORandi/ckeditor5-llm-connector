import { Frequency } from './frequency';

export interface LlmConnectorData {
	accuracy: number;
	frequency: Frequency;
	model: string;
}
