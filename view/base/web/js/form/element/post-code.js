/*
 * @package     Techspot_BrAutocomplete
 * @copyright   Copyright (c) 2019 Techspot Web (http://www.techspot.com.br/)
 * @author      Bruno Monteiro <babumsouza1@gmail.com>
 */

define([
    'jquery',
    'underscore',
    'ko',
    'uiRegistry',
    'mage/url',
    'Magento_Ui/js/form/element/abstract',
    'mage/translate',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/shipping-rate-registry',
    'Magento_Checkout/js/model/shipping-rates-validator',
    'Magento_Customer/js/model/customer',
    'Magento_Checkout/js/model/checkout-data-resolver',
    'Magento_Checkout/js/checkout-data'
], function ($, _, ko, registry, urlBuilder, Abstract, i18n, quote, rateRegistry, shippingRatesValidator, customer, checkoutDataResolver, checkoutData) {
    'use strict';

    return Abstract.extend({
        defaults: {
            imports: {
                update: '${ $.parentName }.country_id:value'
            }
        },
        initialize: function () {
            this._super();
            console.log('BrAutocomplete Module: post-code loaded. ');
            //wait for element rendering
            $.async(
                'input',
                this,
                this.afterElemenRender.bind(this)
            );
            
            return this;
        },

        afterElemenRender: function (input) {
            new IMask(input, this.inputMask);
            this.showAddressForm();
            $('select[name="country_id"]').val('BR').trigger('change');
        },

        showAddressForm: function (){
            
            if(!customer.isLoggedIn()){
                console.log('BrAutocomplete Module: Customer is not logged. ');                
                if(!$('#customer-email').val()){
                    this.hideAllForm();  
                } else {
                    $('#shipping-new-address-form').show();
                    this.hideAddressFields();
                }
            } else {
                console.log('BrAutocomplete Module: Customer is logged. ');
                this.hideAddressFields();
            }
        },
        hideAddressFields: function (){
            var value = this.value();
            if(value.length != 9){
                $('fieldset.street').hide();
                $('div[name="shippingAddress.city"]').hide();
                $('div[name="shippingAddress.region_id"]').hide();
                if(!customer.isLoggedIn()){
                    $('#opc-shipping_method').hide();
                }
            } else {
                $('#opc-shipping_method').show();
            }
        },
        hideAllForm: function (){
            $('#shipping-new-address-form').hide();
            $('#opc-shipping_method').hide();
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
           
            this.bubble('update', this.hasChanged());

            this.validate();

            var value = this.value();

            if(value.length != 9){
                $('fieldset.street').hide();
                $('div[name="shippingAddress.city"]').hide();
                $('div[name="shippingAddress.region_id"]').hide();
                $('#opc-shipping_method').hide();
            }
            
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
                        this.showAddressFields();
                        var data = response.responseJSON;
                        var focusAfterComplete = 'input[name="street[1]"]';

                        if(!data){
                            console.log('BrAutocomplete Module: ViaCep data undefined. ');
                            return;
                        } else if(data.erro && data.code !== 200){
                            focusAfterComplete = 'input[name="street[0]"]';
                            console.log('BrAutocomplete Module: ViaCep Api error response = ' + data.erro);
                        }
                        
                        this.addressAutocomplete(data);
                        //this.estimateShipping();

                        if(!$(focusAfterComplete).is(":focus")){
                            $(focusAfterComplete).focus();
                        }
                        
                        return;
                    },
                    error: function (xhr, status, errorThrown) {
                        console.log("BrAutocomplete Module: Can't autocomplete address:" + status);
                        this.showAddressFields();
                        return;
                    },
                    showAddressFields: function(isVisible = true){
                        var fieldsMap = {
                            0: 'fieldset.street',
                            1: 'div[name="shippingAddress.city"]',
                            2: 'div[name="shippingAddress.region_id"]',
                            3: '#opc-shipping_method'
                        };
                        $.each( fieldsMap, function( k, v ) {
                            (isVisible) ? $(v).show() : $(v).hide();
                        });
                    },
                    addressAutocomplete: function(data) {
                        var fieldsMap = {
                            "street[0]" : { type : 'input', value: data.logradouro},
                            "street[2]" : { type : 'input', value: data.complemento},
                            "street[3]" : { type : 'input', value: data.bairro},
                            "city" : {type : 'input', value: data.localidade },
                            "region_id": {type : 'select', value: data.region_id }
                        }
                        $('input[name="street[1]"]').val("").trigger('change');
                        $.each( fieldsMap, function( k, v ) {
                            $(''+v.type+'[name="'+k+'"]').val(v.value).trigger('change');
                        });
                    },
                    estimateShipping: function(){
                        
                        checkoutDataResolver.resolveShippingAddress();
                        quote.shippingMethod.subscribe(function () {
                            //this.errorValidationMessage(false);
                        });
                        var fieldsetName = 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset';
                        registry.async('checkoutProvider')(function (checkoutProvider) {
                            var shippingAddressData = checkoutData.getShippingAddressFromData();
            
                            if (shippingAddressData) {
                                checkoutProvider.set(
                                    'shippingAddress',
                                    $.extend(true, {}, checkoutProvider.get('shippingAddress'), shippingAddressData)
                                );
                            }
                            checkoutProvider.on('shippingAddress', function (shippingAddrsData) {
                                checkoutData.setShippingAddressFromData(shippingAddrsData);
                            });
                            shippingRatesValidator.initFields(fieldsetName);
                        });
                    }
                });
            }
        }
    });
});

