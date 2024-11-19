import { Element, Node, RootElement, Text } from 'ckeditor5';

export const getPlainText = (element: Element | Node | RootElement | Text) => {
	if (element.is('$text')) {
		return element.data.replace(/\[\[cursor\]\]/g, '');
	}
	if (element.is('element')) {
		if (element.isEmpty) {
			if (element.name === 'ghostText') {
				return '[[cursor]]';
			}
			return '';
		}

		return (
			Array.from(element.getChildren())
				.map((node) => getPlainText(node))
				.join('') + '\r\n'
		);
	}
	return '';
};

export function calculateParameters(accuracy: number) {
	return {
		temperature: 0.5 + (0.9 - 0.5) * (accuracy / 100),
		top_k: Math.round(10 + (100 - 10) * (accuracy / 100)),
		repeat_penalty: 1.0 + (1.5 - 1.0) * (accuracy / 100),
		mirostat: accuracy < 34 ? 0 : accuracy <= 66 ? 1 : 2,
		num_ctx: Math.round(1024 + (4096 - 1024) * (accuracy / 100)),
		num_predict: 50,
	};
}
