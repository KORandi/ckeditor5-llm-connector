import { Frequency } from './frequency';
import { Model } from './model';

export interface LlmConnectorData {
	temperature: number;
	frequency: Frequency;
	model: Model;
}
