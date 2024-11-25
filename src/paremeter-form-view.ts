import {
	View,
	LabeledFieldView,
	createLabeledInputText,
	submitHandler,
	FocusTracker,
	KeystrokeHandler,
	InputTextView,
	Locale,
} from 'ckeditor5';
import { LlmConnectorData } from './interfaces/llm-connector-data';
import { Frequency } from './interfaces/frequency';

export class ParameterFormView extends View {
	focusTracker: FocusTracker;
	keystrokes: KeystrokeHandler;
	accuracySwitchView: View<HTMLElement>;
	frequencyRadioGroupView: View<HTMLElement>;
	metadataInputView: View<HTMLElement>;
	public declare frequency: Frequency;
	public declare metadata: string;
	public declare accuracy: number;

	constructor(locale: Locale, formData: LlmConnectorData) {
		super(locale);

		// Initialize properties
		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();
		this.setDefaults(formData);

		// Initialize sub-views
		this.accuracySwitchView = this.createAccuracySliderView();
		this.frequencyRadioGroupView = this.createFrequencyRadioGroupView();
		this.metadataInputView = this.createMetadataInputView();

		// Set up template
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

	public getData(): LlmConnectorData {
		const { frequency, metadata, accuracy } = this;
		return {
			frequency,
			metadata,
			accuracy,
		};
	}

	private setDefaults(formData: LlmConnectorData): void {
		this.set('accuracy', formData.accuracy);
		this.set('frequency', formData.frequency);
		this.set('metadata', formData.metadata);
	}

	render(): void {
		super.render();

		// Handle form submission
		submitHandler({ view: this });

		// Add elements to focus tracker
		this.addToFocusTracker(this.accuracySwitchView.element);
		this.addToFocusTracker(this.frequencyRadioGroupView.element);
		this.addToFocusTracker(this.metadataInputView.element);

		this.keystrokes.listenTo(this.element);
	}

	private addToFocusTracker(element: HTMLElement | null): void {
		if (element) {
			this.focusTracker.add(element);
		}
	}

	destroy(): void {
		super.destroy();
		this.focusTracker.destroy();
		this.keystrokes.destroy();
	}

	focus(): void {
		this.metadataInputView.element.querySelector('textarea').focus();
	}

	// Create the accuracy slider view
	private createAccuracySliderView(): View<HTMLElement> {
		const container = new View(this.locale);

		// Create slider input
		const sliderInput = this.createSliderInput();

		// Create label
		const label = this.createLabel('Accuracy');

		// Create display value
		const displayValue = this.createAccuracyDisplayValue();

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
				label,
				{
					tag: 'div',
					attributes: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: '10px',
						},
					},
					children: [sliderInput, displayValue],
				},
			],
		});

		return container;
	}

	private createSliderInput(): View<HTMLElement> {
		const slider = new View(this.locale);
		slider.setTemplate({
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

		// Update accuracy on input
		slider.on('render', () => {
			slider.element.addEventListener('input', (event: Event) => {
				const target = event.target as HTMLInputElement;
				this.set('accuracy', parseInt(target.value, 10));
			});
		});

		return slider;
	}

	private createAccuracyDisplayValue(): View<HTMLElement> {
		const display = new View(this.locale);
		display.setTemplate({
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
						(value: number) => `${value}%`
					),
				},
			],
		});

		return display;
	}

	private createLabel(text: string): View<HTMLElement> {
		const label = new View(this.locale);
		label.setTemplate({
			tag: 'label',
			children: [text],
		});
		return label;
	}

	// Create the frequency radio group view
	private createFrequencyRadioGroupView(): View<HTMLElement> {
		const fieldset = new View(this.locale);

		const options: Frequency[] = [
			'disabled',
			'onKeyPress',
			'onWordComplete',
			'onSentenceComplete',
		];
		fieldset.setTemplate({
			tag: 'fieldset',
			attributes: { class: 'ck-frequency-fieldset' },
			children: [
				{ tag: 'legend', children: ['Frequency'] },
				...options.map((value) =>
					this.createFrequencyRadioOption(value)
				),
			],
		});

		return fieldset;
	}

	private createFrequencyRadioOption(value: Frequency): View<HTMLElement> {
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
				value
					.replace(/([A-Z])/g, ' $1')
					.trim()
					.toLowerCase(),
			],
		});

		inputView.on('render', () => {
			inputView.element.addEventListener('change', () => {
				this.set('frequency', value);
			});
		});

		return labelView;
	}

	// Create the metadata input view
	private createMetadataInputView(): View<HTMLElement> {
		const textarea = new View(this.locale);

		const options = [
			'disabled',
			'onKeyPress',
			'onWordComplete',
			'onSentenceComplete',
		];
		textarea.setTemplate({
			tag: 'div',
			attributes: { class: 'flex flex-col' },
			children: [
				{
					tag: 'label',
					children: 'Metadata',
				},
				{
					tag: 'textarea',
					attributes: {
						value: this.bindTemplate.to('metadata'),
						style: {
							display: 'block',
							padding: '10px',
							width: '100%',
							fontSize: '0.875rem',
							color: '#1f2937',
							backgroundColor: '#f9fafb',
							borderRadius: '0.5rem',
							border: '1px solid #d1d5db',
							outline: 'none',
							transition: 'border-color 0.2s, box-shadow 0.2s',
							resize: 'none',
						},
					},
				},
			],
		});

		textarea.on('render', () => {
			textarea.element
				.querySelector('textarea')
				.addEventListener('input', (event: Event) => {
					const target = event.target as HTMLInputElement;
					this.set('metadata', target.value);
				});
		});

		return textarea;
	}
}
