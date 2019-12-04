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
    'inputMask',
    'mage/translate'
], function ($, _, registry, urlBuilder, Abstract, inputMask, i18n) {
    'use strict';

    return Abstract.extend({
        defaults: {
            imports: {
                update: '${ $.parentName }.country_id:value'
            }
        },

        /**
         * @param {String} value
         */
        update: function (value) {
            var country = registry.get(this.parentName + '.' + 'country_id'),
                options = country.indexedOptions,
                option;

            if (!value) {
                return;
            }

            option = options[value];

            if (option['is_zipcode_optional']) {
                this.error(false);
                this.validation = _.omit(this.validation, 'required-entry');
            } else {
                this.validation['required-entry'] = true;
            }

            this.required(!option['is_zipcode_optional']);
        },

        /**
         * Callback that fires when 'value' property is updated.
         */
        onUpdate: function () {
            console.log('custom post-code.js in action!');
            
            this.bubble('update', this.hasChanged());

            this.validate();

            var value = this.value();
            
            if(value.length == 9){

                var parentName = this.parentName;
                var serviceUrl = urlBuilder.build('brautocomplete/index/addressautocomplete');

                $.ajax({
                    showLoader: true,
                    url: serviceUrl,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        postcode: value
                    },
                    complete: function(response) {
                        var errorMsg;
                        var data = response.responseJSON;
                        if(data.code === 200){
                            $('input[name="postcode"]').trigger('change');
                            $('input[name="street[0]"]').val(data.logradouro).trigger('change');
                            $('input[name="street[2]"]').val(data.complemento).trigger('change');
                            $('input[name="street[3]"]').val(data.bairro).trigger('change');
                            $('input[name="city"]').val(data.localidade).trigger('change');
                            $('select[name="region_id"]').val(data.region_id).trigger('change');
                            $('input[name="street[1]"]').focus();
                        } else {
                            $('input[name="street[0]"]').focus();
                            errorMsg = i18n("Can't autocomplete address:");
                            console.log(errorMsg + data);
                        }
                    },
                    error: function (xhr, status, errorThrown) {
                        errorMsg = i18n("Can't autocomplete address:");
                        console.log(errorMsg + status);
                        return;
                    }
                });
            
            }
        }
    });
});

