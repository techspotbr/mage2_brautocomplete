/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

/**
 * @api
 */
define([
    'jquery',
    'underscore',
    'uiComponent'
], function ($, _, Component) {
    'use strict';

    return Component.extend({
        defaults: {
            content:        '',
            showSpinner:    false,
            loading:        false,
            visible:        true,
            template:       'ui/content/content',
            additionalClasses: {},
            ignoreTmpls: {
                content: true
            }
        },

        /**
         * Extends instance with default config, calls 'initialize' method of
         *     parent, calls 'initAjaxConfig'
         */
        initialize: function () {
            this._super();

            console.log('BrAutocomplete Module: after-address loaded. ');
            console.log('BrAutocomplete Module: hide address form. ');
            $('#shipping-new-address-form').hide();
            return this;
        },

        /**
         * Calls 'initObservable' method of parent, initializes observable
         * properties of instance
         *
         * @return {Object} - reference to instance
         */
        initObservable: function () {
            this._super()
                .observe('content loading visible');

            return this;
        }
    });
});
