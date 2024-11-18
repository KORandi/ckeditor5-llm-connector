import { ContentFetcherProps } from '@thesis/ckeditor5-ghost-text/dist/interfaces/content-fetcher';
import { getPlainText } from './utils';

export const llamaConnector = async ({
	editor,
	signal,
}: ContentFetcherProps) => {
	const content: string = getPlainText(editor.model.document.getRoot());

	if (!content.includes('[[cursor]]')) {
		return;
	}

	const text = `${content}`;

	const response = await fetch('http://localhost:3000/llama/autocomplete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text }),
		signal,
	});

	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}

	const json = await response.json();
	return json.completion;
};
