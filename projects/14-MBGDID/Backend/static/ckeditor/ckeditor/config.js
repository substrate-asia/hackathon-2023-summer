/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	 config.uiColor = '#0000FF';   # 第三优先级，蓝色
	config.disallowedContent = 'img{width,height};img[width,height]';
	config.height = 50;

};
