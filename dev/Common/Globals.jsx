
import window from 'window';
import _ from '_';
import $ from '$';
import key from 'key';
import ko from 'ko';
import {KeyState} from 'Common/Enums';

const $win = $(window);
$win.__sizes = [0, 0];

export {$win};

export const $doc = $(window.document);

export const $html = $('html');

export const $body = $('body');

export const $div = $('<div></div>');

export const startMicrotime = (new window.Date()).getTime();

/**
 * @type {boolean}
 */
export const community = RL_COMMUNITY;

/**
 * @type {?}
 */
export const dropdownVisibility = ko.observable(false).extend({rateLimit: 0});

/**
 * @type {boolean}
 */
export const useKeyboardShortcuts = ko.observable(true);

/**
 * @type {string}
 */
export const sUserAgent = 'navigator' in window && 'userAgent' in window.navigator &&
		window.navigator.userAgent.toLowerCase() || '';

/**
 * @type {boolean}
 */
export const bIE = -1 < sUserAgent.indexOf('msie');

/**
 * @type {boolean}
 */
export const bChrome = -1 < sUserAgent.indexOf('chrome');

/**
 * @type {boolean}
 */
export const bSafari = !bChrome && -1 < sUserAgent.indexOf('safari');

/**
 * @type {boolean}
 */
export const bMobileDevice =
	(/android/i).test(sUserAgent) ||
	(/iphone/i).test(sUserAgent) ||
	(/ipod/i).test(sUserAgent) ||
	(/ipad/i).test(sUserAgent) ||
	(/blackberry/i).test(sUserAgent);

/**
 * @type {boolean}
 */
export const bDisableNanoScroll = bMobileDevice;

/**
 * @type {boolean}
 */
export const bAnimationSupported = !bMobileDevice && $html.hasClass('csstransitions') && $html.hasClass('cssanimations');

/**
 * @type {boolean}
 */
export const bXMLHttpRequestSupported = !!window.XMLHttpRequest;

/**
 * @type {boolean}
 */
export const bIsHttps = window.document && window.document.location ? 'https:' === window.document.location.protocol : false;

/**
 * @type {Object}
 */
export const oHtmlEditorDefaultConfig = {
	'title': false,
	'stylesSet': false,
	'customConfig': '',
	'contentsCss': '',
	'toolbarGroups': [
		{name: 'spec'},
		{name: 'styles'},
		{name: 'basicstyles', groups: ['basicstyles', 'cleanup', 'bidi']},
		{name: 'colors'},
		bMobileDevice ? {} : {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align']},
		{name: 'links'},
		{name: 'insert'},
		{name: 'document', groups: ['mode', 'document', 'doctools']},
		{name: 'others'}
	],

	'removePlugins': 'liststyle',
	'removeButtons': 'Format,Undo,Redo,Cut,Copy,Paste,Anchor,Strike,Subscript,Superscript,Image,SelectAll,Source',
	'removeDialogTabs': 'link:advanced;link:target;image:advanced;images:advanced',

	'extraPlugins': 'plain,signature',

	'allowedContent': true,
	'extraAllowedContent': true,

	'fillEmptyBlocks': false,
	'ignoreEmptyParagraph': true,
	'disableNativeSpellChecker': false,

	'font_defaultLabel': 'Arial',
	'fontSize_defaultLabel': '13',
	'fontSize_sizes': '10/10px;12/12px;13/13px;14/14px;16/16px;18/18px;20/20px;24/24px;28/28px;36/36px;48/48px'
};

/**
 * @type {Object}
 */
export const oHtmlEditorLangsMap = {
	'bg_bg': 'bg',
	'de_de': 'de',
	'el_gr': 'el',
	'es_es': 'es',
	'fr_fr': 'fr',
	'hu_hu': 'hu',
	'is_is': 'is',
	'it_it': 'it',
	'ja_jp': 'ja',
	'ko_kr': 'ko',
	'lt_lt': 'lt',
	'lv_lv': 'lv',
	'nl_nl': 'nl',
	'bg_no': 'no',
	'pl_pl': 'pl',
	'pt_pt': 'pt',
	'pt_br': 'pt-br',
	'ro_ro': 'ro',
	'ru_ru': 'ru',
	'sk_sk': 'sk',
	'sl_si': 'sl',
	'sv_se': 'sv',
	'tr_tr': 'tr',
	'uk_ua': 'ru',
	'zh_tw': 'zh',
	'zh_cn': 'zh-cn'
};

/**
 * @type {boolean}
 */
let bAllowPdfPreview = !bMobileDevice;

if (bAllowPdfPreview && window.navigator && window.navigator.mimeTypes)
{
	bAllowPdfPreview = !!_.find(window.navigator.mimeTypes, function(oType) {
		return oType && 'application/pdf' === oType.type;
	});

	if (!bAllowPdfPreview)
	{
		bAllowPdfPreview = 'undefined' !== typeof window.navigator.mimeTypes['application/pdf'];
	}
}

export {bAllowPdfPreview};

export const aViewModels = {
	settings: [],
	'settings-removed': [],
	'settings-disabled': []
};

export const leftPanelDisabled = ko.observable(false);
export const leftPanelType = ko.observable('');
export const leftPanelWidth = ko.observable(0);

// popups
export const popupVisibilityNames = ko.observableArray([]);

export const popupVisibility = ko.computed(() => 0 < popupVisibilityNames().length);

popupVisibility.subscribe((bValue) => {
	$html.toggleClass('rl-modal', bValue);
});

// keys
export const keyScopeReal = ko.observable(KeyState.All);
export const keyScopeFake = ko.observable(KeyState.All);

export const keyScope = ko.computed({
	owner: this,
	read: () => keyScopeFake(),
	write: function(sValue) {

		if (KeyState.Menu !== sValue)
		{
			if (KeyState.Compose === sValue)
			{
				// disableKeyFilter
				key.filter = function() {
					return useKeyboardShortcuts();
				};
			}
			else
			{
				// restoreKeyFilter
				key.filter = function(event) {

					if (useKeyboardShortcuts())
					{
						var
							oElement = event.target || event.srcElement,
							sTagName = oElement ? oElement.tagName : '';

						sTagName = sTagName.toUpperCase();
						return !('INPUT' === sTagName || 'SELECT' === sTagName || 'TEXTAREA' === sTagName ||
							(oElement && 'DIV' === sTagName && ('editorHtmlArea' === oElement.className || 'true' === '' + oElement.contentEditable))
						);
					}

					return false;
				};
			}

			keyScopeFake(sValue);
			if (dropdownVisibility())
			{
				sValue = KeyState.Menu;
			}
		}

		keyScopeReal(sValue);
	}
});

keyScopeReal.subscribe(function(sValue) {
//	window.console.log('keyScope=' + sValue); // DEBUG
	key.setScope(sValue);
});

dropdownVisibility.subscribe(function(bValue) {
	if (bValue)
	{
		keyScope(KeyState.Menu);
	}
	else if (KeyState.Menu === key.getScope())
	{
		keyScope(keyScopeFake());
	}
});

/**
 * @type {*}
 */
export const data = {
	__APP__: null,
	iAjaxErrorCount: 0,
	iTokenErrorCount: 0,
	aBootstrapDropdowns: [],
	iMessageBodyCacheCount: 0,
	bUnload: false
};
