import { Frequency } from './frequency';

export interface LlmConnectorData {
	temperature: number;
	frequency: Frequency;
	model: string;
}
