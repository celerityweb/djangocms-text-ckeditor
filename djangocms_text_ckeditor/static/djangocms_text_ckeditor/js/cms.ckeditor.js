/*##################################################|*/
/* #CMS.CKEDITOR# */
(function($) {
// CMS.$ will be passed for $
$(document).ready(function () {
	/*!
	 * CMS.CKEditor
	 * @version: 1.1.0
	 * @description: Adds cms specific plugins to CKEditor
	 */
	CMS.CKEditor = {

		options: {
			// ckeditor default settings, will be overwritten by CKEDITOR_SETTINGS
			'language': 'en',
			'skin': 'moono',
			'toolbar_CMS': [
				['Undo', 'Redo'],
				['cmsplugins', '-', 'ShowBlocks'],
				['Format', 'Styles'],
				['TextColor', 'BGColor', '-', 'PasteText', 'PasteFromWord'],
				['Maximize', ''],
				'/',
				['Bold', 'Italic', 'Underline', '-', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
				['JustifyLeft', 'JustifyCenter', 'JustifyRight'],
				['HorizontalRule'],
				['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Table'],
				['Source']
			],
			'toolbar_HTMLField': [
				['Undo', 'Redo'],
				['ShowBlocks'],
				['Format', 'Styles'],
				['TextColor', 'BGColor', '-', 'PasteText', 'PasteFromWord'],
				['Maximize', ''],
				'/',
				['Bold', 'Italic', 'Underline', '-', 'Subscript', 'Superscript', '-', 'RemoveFormat'],
				['JustifyLeft', 'JustifyCenter', 'JustifyRight'],
				['HorizontalRule'],
				['Link', 'Unlink'],
				['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Table'],
				['Source']
			],

			'allowedContent': true,
			'toolbarCanCollapse': false,
			'removePlugins': 'resize',
			'extraPlugins': 'cmsplugins,cmsresize'
		},

		init: function (container, options, settings) {
			if ($('#' + container).length > 0) {
				this.container = $('#' + container);
				// add additional settings to options
				this.options.toolbar = settings.toolbar;
				this.options = $.extend(false, {
					'settings': settings
				}, this.options, options);

				// add additional plugins (autoloads plugins.js)
				CKEDITOR.plugins.addExternal('cmsplugins', settings.static_url + '/ckeditor_plugins/cmsplugins/');
				CKEDITOR.plugins.addExternal('cmsresize', settings.static_url + '/ckeditor_plugins/cmsresize/');

				// render ckeditor
				this.editor = CKEDITOR.replace(container, this.options);

				// add additional styling
				CKEDITOR.on('instanceReady', $.proxy(CMS.CKEditor, 'setup'));
			}
		},

		// setup is called after ckeditor has been initialized
		setup: function () {
			// auto maximize modal if alone in a modal
			if (this._isAloneInModal()) {
				this.editor.execCommand('maximize');
			}

			// add css tweks to the editor
			this.styles();
			this._resizing();
		},

		styles: function () {
			// add styling to source and fullscreen view
			$('.cke_button__maximize, .cke_button__source').parent()
				.css('margin-right', 0).parent()
				.css('float', 'right');
		},

		_resizing: function () {
			$('.cms-ckeditor-resizer').on('pointerdown', function (e) {
				e.preventDefault();
				var event = CMS.$.Event('mousedown');
				$.extend(event, {
					screenX: e.originalEvent.screenX,
					screenY: e.originalEvent.screenY
				});
				$(this).trigger(event);
			});
		},

		_isAloneInModal: function () {
			// return true if the ckeditor is alone in a modal popup
			return this.container.parents('body.app-djangocms_text_ckeditor.model-text').length > 0 // Django >= 1.7
				|| this.container.parents('body.djangocms_text_ckeditor-text').length > 0; // Django < 1.7
		}

	};

});
})(CMS.$);
