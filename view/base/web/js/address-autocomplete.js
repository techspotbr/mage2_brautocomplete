require(['jquery', 'mage/mage', 'inputMask', 'mage/url', 'loader'], function($, mage, inputmask, urlBuilder){
    'use strict';
    
    $(document).ready(
        function(){
            console.log('AutoComplete Enabled!');
            var postcode = $('input[name="postcode"]');
            var streetAddress = Array(
                $('.street-1'),
                $('.street-2'),
                $('.street-3'),
                $('.street-4'),
            );
            
            if(!postcode.val()){
                streetAddress.forEach(addressLine => {
                    addressLine.hide();
                });
            }
            
            postcode.inputmask("99999-999");
            postcode.on('keypress', function(){
                searchAddress($(this).val());
            });

            var searchAddress = function(postcodeVal){
                var postcodeVal = postcodeVal.replace(/\D/g, '');
                if (postcodeVal != "") {
                    var postcodeValidation = /^[0-9]{8}$/;
                    if(postcodeValidation.test(postcodeVal)) {
                        console.log('Debug: Consultando CEP:'+ postcodeVal);
                        
                        var serviceUrl = urlBuilder.build('brautocomplete/index/addressautocomplete');
                        $.ajax({
                            showLoader: true,
                            url: serviceUrl,
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                postcode: postcodeVal
                            },
                            complete: function(response) {
                                console.log('Debug: CEP localizado, preenchendo endereco ...')
                                var data = response.responseJSON;
                                addressAutocomplete(data);
                                console.log(data);
                            },
                            error: function (xhr, status, errorThrown) {
                                console.log("BrAutocomplete Module: Can't autocomplete address:" + status);
                                var data = {
                                    code: 400,
                                    logradouro: '',
                                    complemento: '',
                                    bairro: '',
                                    localidade: '',
                                    uf: '',
                                    region_id: ''
                                }
                                addressAutocomplete(data);
                            }
                        });

                        var addressAutocomplete = function(data) {

                            $('.street-1').find('input').val(data.logradouro).trigger('change');
                            
                            var fieldsMap = {
                                ".street-1" : { type : 'input', value: data.logradouro },
                                ".street-3" : { type : 'input', value: data.complemento},
                                ".street-4" : { type : 'input', value: data.bairro},
                                ".city" : {type : 'input', value: data.localidade },
                                ".region": {type : 'select', value: data.region_id }
                            }
                            
                            $.each( fieldsMap, function( k, v ) {
                                $(k).find(v.type).val(v.value).trigger('change');
                            });
                            
                            streetAddress.forEach(addressLine => {
                                addressLine.show();
                            });
                        }
                    }
                }                
            }


            /*
            console.log('Postcode Value='+ postcodeEl.val());
            if(postcodeEl.val().length == 0){
                $('.street-1').hide();
                $('.street-2').hide();
                $('.street-3').hide();
                $('.street-4').hide();
            } else {
                console.log('not null');
            }*/
            
        }
    );
});