/*
 * @package     Techspot_BrAutocomplete
 * @copyright   Copyright (c) 2019 Techspot Web (http://www.techspot.com.br/)
 * @author      Bruno Monteiro <babumsouza1@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'uiRegistry',
    'mage/url',
    'Magento_Ui/js/form/element/abstract',
    'mage/translate',
    'Magento_Checkout/js/checkout-data'
], function ($, _, registry, urlBuilder, Abstract, i18n, checkoutData) {
    'use strict';

    return Component.extend({
        /** @inheritdoc */
        initialize: function () {
            this._super();
            
            console.log('BrAutocomplete Module: fieldset loaded. ');
            return this;
        }
    });
});