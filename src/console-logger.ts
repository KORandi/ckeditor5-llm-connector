import { Command, Element, Node, Plugin, RootElement, Text } from 'ckeditor5';

class LogPlainTextWithCursorCommand extends Command {
	async execute() {
		const editor = this.editor;
		const model = editor.model;
		const tree = this.getPlainText(model.document.getRoot());
		console.log(tree);
	}

	getPlainText(element: Element | Node | RootElement | Text) {
		if (element.is('$text')) {
			return element.data;
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
					.map((node) => this.getPlainText(node))
					.join('') + '\r\n'
			);
		}
		return '';
	}
}

export default class ConsoleLogger extends Plugin {
	init() {
		const editor = this.editor;

		// Register the logPlainTextWithCursor command
		editor.commands.add(
			'logPlainTextWithCursor',
			new LogPlainTextWithCursorCommand(editor)
		);

		// Start a timer to execute the command every 5 seconds
		this.startPeriodicLogging();
	}

	startPeriodicLogging() {
		const editor = this.editor;
		const interval = 5000; // 5 seconds

		setInterval(() => {
			editor.execute('logPlainTextWithCursor');
		}, interval);
	}
}
