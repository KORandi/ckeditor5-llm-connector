import { ContentFetcherProps } from '@thesis/ckeditor5-ghost-text/dist/interfaces/content-fetcher';
import { getPlainText } from '../src/utils';
import { Frequency } from '../src/interfaces/frequency';

const API_URL = 'http://localhost:3000/llama/autocomplete';

const REGEX = {
	onWordComplete: /\p{L}\s\[\[cursor\]\]|\n\[\[cursor\]\]/u,
	onSentenceComplete: /[\!\.\?]\s\[\[cursor\]\]/g,
};

/**
 * Sets up event listeners to update parameters dynamically.
 * @param onConfigUpdate Callback to handle configuration updates.
 */
const setupParameterConfigListener = (
	onConfigUpdate: (accuracy: number, frequency: Frequency) => void
) => {
	window.addEventListener('load', () => {
		window.editor.on(
			'parameterConfig:submit',
			(
				_: unknown,
				data: {
					accuracy: number;
					frequency: Frequency;
				}
			) => {
				onConfigUpdate(data.accuracy, data.frequency);
			}
		);
	});
};

/**
 * Validates whether text meets the required conditions based on frequency.
 * @param text Input text to validate.
 * @param frequency Frequency mode to validate against.
 * @returns `true` if valid, `false` otherwise.
 */
const isTextValidForFrequency = (
	text: string,
	frequency: Frequency
): boolean => {
	switch (frequency) {
		case 'disabled':
			return false;
		case 'onKeyPress':
			return text.includes('[[cursor]]');
		case 'onWordComplete':
			return REGEX.onWordComplete.test(text);
		case 'onSentenceComplete':
			return REGEX.onSentenceComplete.test(text);
		default:
			return false;
	}
};

/**
 * Sends a request to the LLaMA backend for autocompletion.
 * @param text Input text for completion.
 * @param temperature Temperature for completion generation.
 * @param signal AbortSignal for request cancellation.
 * @returns Completion string from the LLaMA backend.
 * @throws Error if the request fails or the response is invalid.
 */
const fetchCompletion = async (
	text: string,
	temperature: number,
	signal: AbortSignal
): Promise<string> => {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text, temperature }),
		signal,
	});

	if (!response.ok) {
		throw new Error(
			`Failed to fetch completion. Status: ${response.status}`
		);
	}

	const json = await response.json();
	if (!json.completion) {
		throw new Error('Invalid response: Missing "completion" field.');
	}

	return json.completion;
};

export const llamaConnector = (
	temperature = 80,
	frequency: Frequency = 'onWordComplete'
) => {
	// Setup parameter configuration listener
	setupParameterConfigListener((accuracy, newFrequency) => {
		temperature = accuracy;
		frequency = newFrequency;
	});

	return async ({ editor, signal }: ContentFetcherProps): Promise<string> => {
		const text = getPlainText(editor.model.document.getRoot());

		if (!isTextValidForFrequency(text, frequency)) {
			return '';
		}

		return fetchCompletion(text, temperature, signal);
	};
};
