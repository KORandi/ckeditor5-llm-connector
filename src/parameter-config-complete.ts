import {
	ButtonView,
	Dialog,
	View,
	Plugin,
	Locale,
	LocaleTranslate,
} from 'ckeditor5';
import { ParameterFormView } from './paremeter-form-view';

export default class ParameterConfigDialog extends Plugin {
	static get requires(): Array<typeof Plugin> {
		return [Dialog];
	}

	init(): void {
		this._addParameterConfigButton();
	}

	/**
	 * Adds a parameter configuration button to the editor's component factory.
	 */
	private _addParameterConfigButton(): void {
		const t = this.editor.locale.t;

		this.editor.ui.componentFactory.add('parameterConfig', (locale) => {
			const buttonView = this._createButtonView(locale, t);

			// Define behavior for button execution.
			buttonView.on('execute', () =>
				this._handleButtonExecute(buttonView)
			);

			return buttonView;
		});
	}

	/**
	 * Creates the button view with the necessary properties.
	 * @param locale - The editor's locale.
	 * @param t - The translation function.
	 * @returns The configured button view.
	 */
	private _createButtonView(locale: Locale, t: LocaleTranslate): ButtonView {
		const buttonView = new ButtonView(locale);

		buttonView.set({
			label: t('Show a modal'),
			tooltip: true,
			withText: true,
			isOn: false, // Initialize button state
		});

		return buttonView;
	}

	/**
	 * Handles the button execution logic.
	 * @param buttonView - The button view instance.
	 */
	private _handleButtonExecute(buttonView: ButtonView): void {
		const dialog = this.editor.plugins.get('Dialog');

		if (buttonView.isOn) {
			this._hideDialog(dialog, buttonView);
		} else {
			this._showDialog(dialog, buttonView);
		}
	}

	/**
	 * Hides the dialog and updates the button state.
	 * @param dialog - The dialog plugin instance.
	 * @param buttonView - The button view instance.
	 */
	private _hideDialog(dialog: Dialog, buttonView: ButtonView): void {
		dialog.hide();
		buttonView.isOn = false;
	}

	/**
	 * Shows the dialog with the parameter configuration form.
	 * @param dialog - The dialog plugin instance.
	 * @param buttonView - The button view instance.
	 */
	private _showDialog(dialog: Dialog, buttonView: ButtonView): void {
		const locale = this.editor.locale;

		buttonView.isOn = true;

		const formView = new ParameterFormView(locale);
		const contentView = this._createDialogContentView(locale, formView);

		dialog.show({
			isModal: true,
			title: locale.t('Configure Parameters'),
			content: contentView,
			actionButtons: this._createDialogActionButtons(dialog),
			onHide: () => {
				buttonView.isOn = false;
			},
			id: 'parameterConfigDialog',
		});
	}

	/**
	 * Creates the dialog's content view with the parameter form.
	 * @param locale - The editor's locale.
	 * @param formView - The parameter form view.
	 * @returns The configured content view.
	 */
	private _createDialogContentView(locale: Locale, formView: View): View {
		const contentView = new View(locale);

		contentView.setTemplate({
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

		return contentView;
	}

	/**
	 * Creates the action buttons for the dialog.
	 * @param dialog - The dialog plugin instance.
	 * @returns An array of action button configurations.
	 */
	private _createDialogActionButtons(dialog: Dialog): Array<{
		label: string;
		withText: boolean;
		class?: string;
		onExecute: () => void;
	}> {
		const t = this.editor.locale.t;

		return [
			{
				label: t('Cancel'),
				withText: true,
				onExecute: () => dialog.hide(),
			},
			{
				label: t('Accept'),
				class: 'ck-button-action',
				withText: true,
				onExecute: () => {
					// Logic for accepting changes can be added here.
					dialog.hide();
				},
			},
		];
	}
}