import {
	ButtonView,
	Dialog,
	View,
	Plugin,
	LabeledFieldView,
	createLabeledInputText,
	submitHandler,
	FocusTracker,
	KeystrokeHandler,
	InputTextView,
} from 'ckeditor5';

// Create a plugin that provides a dialog for parameter configuration.
export default class ParameterConfigDialog extends Plugin {
	get requires() {
		return [Dialog];
	}

	init() {
		const t = this.editor.locale.t;
		// Add a button to the component factory so it is available for the editor.
		this.editor.ui.componentFactory.add('parameterConfig', (locale) => {
			const buttonView = new ButtonView(locale);

			buttonView.set({
				label: 'Show a modal',
				tooltip: true,
				withText: true,
			});

			// Define the button behavior on press.
			buttonView.on('execute', () => {
				const dialog = this.editor.plugins.get('Dialog');

				// If the button is turned on, hide the modal.
				if (buttonView.isOn) {
					dialog.hide();
					buttonView.isOn = false;

					return;
				}

				buttonView.isOn = true;

				// Otherwise, show the modal.
				// First, create a view with some simple content. It will be displayed as the dialog's body.
				const textView = new View(locale);

				const formView = new ParameterFormView(locale);

				textView.setTemplate({
					tag: 'div',
					attributes: {
						style: {
							padding: 'var(--ck-spacing-large)',
							whiteSpace: 'initial',
							width: '100%',
							maxWidth: '500px',
						},
						tabindex: -1,
					},
					children: [formView],
				});

				// Tell the plugin to display a modal with the title, content, and one action button.
				dialog.show({
					isModal: true,
					title: 'Configure Parameters',
					content: textView,
					actionButtons: [
						{
							label: t('Cancel'),
							withText: true,
							onExecute: () => dialog.hide(),
						},
						{
							label: t('Accept'),
							class: 'ck-button-action',
							withText: true,
							onExecute: () => dialog.hide(),
						},
					],
					onHide() {
						buttonView.isOn = false;
					},
					id: 'abc',
				});
			});

			return buttonView;
		});
	}
}

export class ParameterFormView extends View {
	focusTracker: FocusTracker;
	keystrokes: KeystrokeHandler;
	accuracySwitchView: View<HTMLElement>;
	frequencyRadioGroupView: View<HTMLElement>;
	metadataInputView: LabeledFieldView<InputTextView>;
	frequency: string;
	metadata: string;
	accuracy: number;

	constructor(locale) {
		super(locale);

		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();

		this.set('accuracy', 0);
		this.set('frequency', 'onKeyPress');
		this.set('metadata', '');

		this.accuracySwitchView = this._createAccuracySlider();
		this.frequencyRadioGroupView = this._createFrequencyRadioGroup();
		this.metadataInputView = this._createMetadataInput();

		this.setTemplate({
			tag: 'form',
			attributes: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
				},
				class: ['ck', 'ck-parameter-form', 'ck-responsive-form'],
				tabindex: '-1',
			},
			children: [
				this.accuracySwitchView,
				this.frequencyRadioGroupView,
				this.metadataInputView,
			],
		});
	}

	render() {
		super.render();

		submitHandler({ view: this });

		this.focusTracker.add(this.accuracySwitchView.element);
		this.focusTracker.add(this.frequencyRadioGroupView.element);
		this.focusTracker.add(this.metadataInputView.element);

		this.keystrokes.listenTo(this.element);
	}

	destroy() {
		super.destroy();
		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	focus() {
		this.metadataInputView.focus();
	}

	_createAccuracySlider() {
		const container = new View(this.locale);

		const sliderView = new View(this.locale);
		sliderView.setTemplate({
			tag: 'input',
			attributes: {
				type: 'range',
				min: '0',
				max: '100',
				step: '1',
				class: 'ck-slider',
				value: this.bindTemplate.to('accuracy'),
			},
		});

		sliderView.on('render', () => {
			sliderView.element.addEventListener('input', (event) => {
				const target = event.target as HTMLInputElement;
				if (target) {
					this.set('accuracy', parseInt(target.value, 10));
				}
			});
		});

		const labelView = new View(this.locale);
		labelView.setTemplate({
			tag: 'label',
			children: ['Accuracy'],
		});

		const displayValue = new View(this.locale);
		displayValue.setTemplate({
			tag: 'span',
			attributes: {
				style: {
					marginLeft: '8px',
					fontSize: '14px',
					fontWeight: 'bold',
				},
			},
			children: [
				{
					text: this.bindTemplate.to(
						'accuracy',
						(value) => `${value}%`
					),
				},
			],
		});

		container.setTemplate({
			tag: 'div',
			attributes: {
				style: {
					display: 'flex',
					flexDirection: 'column',
					padding: '0 10px',
				},
			},
			children: [
				labelView,
				{
					tag: 'div',
					attributes: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
						},
					},
					children: [sliderView, displayValue],
				},
			],
		});

		return container;
	}

	_createFrequencyRadioGroup() {
		const fieldsetView = new View(this.locale);

		fieldsetView.setTemplate({
			tag: 'fieldset',
			attributes: { class: 'ck-frequency-fieldset' },
			children: [
				{ tag: 'legend', children: ['Frequency'] },
				...['onKeyPress', 'onWordComplete', 'onSentenceComplete'].map(
					(value) => {
						const labelView = new View(this.locale);
						const inputView = new View(this.locale);

						inputView.setTemplate({
							tag: 'input',
							attributes: {
								type: 'radio',
								name: 'frequency',
								value,
								checked: value === this.frequency,
							},
						});

						labelView.setTemplate({
							tag: 'label',
							attributes: {
								style: {
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
								},
							},
							children: [
								inputView,
								value.replace(/([A-Z])/g, ' $1').trim(),
							],
						});

						labelView.on('change', () => {
							this.set('frequency', value);
						});

						return labelView;
					}
				),
			],
		});

		return fieldsetView;
	}

	_createMetadataInput() {
		const labeledInput = new LabeledFieldView(
			this.locale,
			createLabeledInputText
		);

		labeledInput.label = 'Metadata';
		labeledInput.fieldView.value = this.metadata;

		labeledInput.fieldView.on('input', () => {
			this.set('metadata', labeledInput.fieldView.element.value.trim());
		});

		return labeledInput;
	}
}
