import { describe, expect, it } from 'vitest';
import { LlmConnector as LlmConnectorDll, icons } from '../src/index.js';
import LlmConnector from '../src/llmconnector.js';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 LlmConnector DLL', () => {
	it( 'exports LlmConnector', () => {
		expect( LlmConnectorDll ).to.equal( LlmConnector );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
