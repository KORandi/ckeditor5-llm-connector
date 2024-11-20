import { ContentFetcherProps } from '@thesis/ckeditor5-ghost-text/dist/interfaces';
import { getPlainText } from '../src/utils';
import { Frequency } from '../src/interfaces/frequency';

export const gptConnector = () => {
	let accuracy = 80;
	let frequency: Frequency = 'onKeyPress';
	let metadata = '';

	window.addEventListener('load', () => {
		window.editor.on(
			'parameterConfig:submit',
			(
				_,
				data: {
					accuracy: number;
					frequency: Frequency;
					metadata: string;
				}
			) => {
				accuracy = data.accuracy;
				frequency = data.frequency;
				metadata = data.metadata;
			}
		);
	});

	return async ({ editor, signal }: ContentFetcherProps) => {
		const content: string = getPlainText(editor.model.document.getRoot());

		switch (frequency) {
			case 'disabled':
				return;
			case 'onKeyPress':
				if (!content.includes('[[cursor]]')) {
					return;
				}
				break;
			case 'onWordComplete':
				// any letter + space + cursor
				const regexWord = /\p{L}\s\[\[cursor\]\]/u;
				if (!regexWord.test(content)) {
					return;
				}
				break;
			case 'onSentenceComplete':
				const regexSentence = /[\!\.\?]\s\[\[cursor\]\]/g;
				if (!regexSentence.test(content)) {
					return;
				}
				break;
			default:
				return;
		}

		const text = `${content}`;

		const response = await fetch('http://localhost:3000/gpt/autocomplete', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ text, accuracy, metadata }),
			signal,
		});

		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		return json.completion;
	};
};
