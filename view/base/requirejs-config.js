var config = {
    map: {
        '*': {
            addressAutoComplete: 'Techspot_BrAutocomplete/js/address-autocomplete'
        }
    },
    config: {
        mixins: {
            'Magento_Ui/js/form/element/abstract': {
                'Techspot_BrAutocomplete/js/input-mask': true
            }
        }
    }
};