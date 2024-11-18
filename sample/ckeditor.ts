declare global {
	interface Window {
		editor: ClassicEditor;
	}
}

import {
	ClassicEditor,
	Autoformat,
	Base64UploadAdapter,
	BlockQuote,
	Bold,
	Code,
	CodeBlock,
	Essentials,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	Indent,
	Italic,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	Table,
	TableToolbar,
	Editor,
} from 'ckeditor5';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

import { GhostText } from '@thesis/ckeditor5-ghost-text';

import 'ckeditor5/ckeditor5.css';
import '@thesis/ckeditor5-ghost-text/index.css';
import { chatGPTConnector } from './chatgpt-connector';
import { llamaConnector } from './llama-connector';

ClassicEditor.create(document.getElementById('editor')!, {
	plugins: [
		GhostText,
		Essentials,
		Autoformat,
		BlockQuote,
		Bold,
		Heading,
		Image,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		Indent,
		Italic,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		Table,
		TableToolbar,
		CodeBlock,
		Code,
		Base64UploadAdapter,
	],
	toolbar: [
		'undo',
		'redo',
		'|',
		'ghostTextButton',
		'|',
		'heading',
		'|',
		'bold',
		'italic',
		'link',
		'code',
		'bulletedList',
		'numberedList',
		'|',
		'outdent',
		'indent',
		'|',
		'uploadImage',
		'blockQuote',
		'insertTable',
		'mediaEmbed',
		'codeBlock',
		'logPlainTextWithCursor',
	],
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'imageTextAlternative',
		],
	},
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
	},
	ghostText: {
		debounceDelay: 300,
		contentFetcher: llamaConnector,
	},
})
	.then((editor) => {
		window.editor = editor;
		CKEditorInspector.attach(editor);
		window.console.log('CKEditor 5 is ready.', editor);
	})
	.catch((err) => {
		window.console.error(err.stack);
	});
