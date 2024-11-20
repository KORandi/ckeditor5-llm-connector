import {
	View,
	LabeledFieldView,
	createLabeledInputText,
	submitHandler,
	FocusTracker,
	KeystrokeHandler,
	InputTextView,
} from 'ckeditor5';

// Define types for better readability and maintainability
type Locale = any; // Replace `any` with the actual type if available

export class ParameterFormView extends View {
	focusTracker: FocusTracker;
	keystrokes: KeystrokeHandler;
	accuracySwitchView: View<HTMLElement>;
	frequencyRadioGroupView: View<HTMLElement>;
	metadataInputView: LabeledFieldView<InputTextView>;
	frequency: string;
	metadata: string;
	accuracy: number;

	constructor(locale: Locale) {
		super(locale);

		// Initialize properties
		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();
		this.setDefaults();

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

	public getData() {
		const { frequency, metadata, accuracy } = this;
		return {
			frequency,
			metadata,
			accuracy,
		};
	}

	private setDefaults(): void {
		this.set('accuracy', 80);
		this.set('frequency', 'onWordComplete');
		this.set('metadata', '');
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
		this.metadataInputView.focus();
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

		const options = [
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

	private createFrequencyRadioOption(value: string): View<HTMLElement> {
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
	private createMetadataInputView(): LabeledFieldView<InputTextView> {
		const labeledInput = new LabeledFieldView(
			this.locale,
			createLabeledInputText
		);

		labeledInput.label = 'Metadata';
		labeledInput.fieldView.value = this.metadata;

		labeledInput.fieldView.on('input', () => {
			this.set('metadata', labeledInput.fieldView.element!.value.trim());
		});

		return labeledInput;
	}
}
