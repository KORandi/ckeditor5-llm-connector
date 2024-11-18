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
