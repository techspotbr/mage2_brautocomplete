require(['Magento_Ui/js/modal/alert','jquery', 'mage/mage', 'inputMask', 'mage/url', 'loader'], function(alert, $, mage, inputmask, urlBuilder){
    'use strict';
    
    $(document).ready(
        function(){
            // Fields Mask
            var postcode = $('.zip').find('input');
            var postcodeErrorDiv = "<div class=\"mage-error\" generated=\"true\" id=\"postcode-error\"></div>";
            var postcodeErrorMessage = $.mage.__("We can't find the address, you can fill it in manually ...");

            var addressFormMask = {
                ".telephone" : { type : 'input', mask: '(99) 99999-9999', initVisible: 'visible', autocomplete: false},
                ".cellphone" : { type : 'input', mask: '(99) 9999-9999' , initVisible: 'visible', autocomplete: false},
                ".zip" : { type : 'input', mask: '99999-999', initVisible: 'visible', autocomplete: false},
                ".street-1": { type : 'input', mask: false, initVisible: 'hidden', autocomplete: true, addressData_key: 'logradouro'},
                ".street-2": { type : 'input', mask: false, initVisible: 'hidden', autocomplete: false},
                ".street-3": { type : 'input', mask: false, initVisible: 'hidden', autocomplete: false},
                ".street-4": { type : 'input', mask: false, initVisible: 'hidden', autocomplete: true, addressData_key: 'bairro'},
                ".city": { type : 'input', mask: false, initVisible: 'hidden', autocomplete: true, addressData_key: 'localidade'},
                ".region": { type : 'select', mask: false, initVisible: 'hidden', autocomplete: true, addressData_key: 'region_id'},
                ".country": { type : 'select', mask: false, initVisible: 'hidden', autocomplete: false},
            };

            $.each(addressFormMask, function( k, v ) {
                // Mask
                if(v.mask){
                    $(k).find(v.type).inputmask(v.mask, {placeholder: ""});
                }
                
                // Initial Visible
                var fieldValue;
                switch(v.type){
                    case 'input':
                            fieldValue = $(k).find(v.type).val();
                        break;

                    case 'select':
                        fieldValue = $(k).find(v.type).children("option:selected").val();
                        break;
                }  
                if(fieldValue === "" && postcode.val() === "" && v.initVisible === 'hidden'){
                    $(k).hide();
                }
            });

            // Dispatch Ajax
            postcode.on('keypress blur', function(){
                var postcodeVal = postcode.val().replace(/\D/g, '');
                if (postcodeVal != "") {
                    var postcodeValidation = /^[0-9]{8}$/;
                    if(postcodeValidation.test(postcodeVal)) {
                        ajaxAddressSearch(postcodeVal);
                    }
                }
            });

            var ajaxAddressSearch = function(postcodeVal){
                var serviceUrl = urlBuilder.build('brautocomplete/index/addressautocomplete');
                $.ajax({ showLoader: true, url: serviceUrl, type: 'POST', dataType: 'json', data: { postcode: postcodeVal },
                    success: function(response) {
                        var addressData = response;
                        populateAddress(addressData);
                    },
                    error: function (xhr, status, errorThrown) {
                        console.log('BrAutoComplete Error...');
                        return false;
                    }
                });
            }

            var populateAddress = function(addressData){
                if(undefined !== addressData && addressData["erro"] === undefined){
                    $.each(addressFormMask, function( k, v ) {
                        if(v.autocomplete == true){
                            var key = v.addressData_key,
                                fieldValue = "";
                            
                            if(addressData[key] !== ""){
                                fieldValue = addressData[key];
                            }
                            $(k).find(v.type).val(fieldValue).trigger('change');
                        }
                        $(k).show();
                    });
                } else {
                    $.each(addressFormMask, function( k, v ) {
                        $(k).show();
                    });

                    if(!$('#postcode-error').is(":visible")){
                        postcode.parent().append(postcodeErrorDiv);
                    }
                    $('#postcode-error').html(postcodeErrorMessage);
                    console.log('VIA CEP: Endereço não localizado');
                }
            }
        }
    );
});