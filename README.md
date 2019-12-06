# Techspot - BrAutocomplete - Magento 2 Module

The Tech Spot Br Autocomplete Module for Magento 2 enable autocomplete address for Brazilian Stores in checkout shipping page.

Hide address form while email is empty
Hide street address form while postcode is empty

### Install

Install via composer:

```
cd <your Magento install dir>
composer require techspot/brautocomplete
php bin/magento module:enable --clear-static-content Techspot_BrAutocomplete
php bin/magento setup:static-content:deploy //ou php bin/magento setup:static-content:deploy pt_BR
```

## Authors

* **Bruno Monteiro** - *Initial work* - [TechSpot](https://github.com/techspotbr)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Donation
If this project help you reduce time to develop, you can give me a cup of coffee :) 
Se este projeto te ajudou a reduzir o tempo de desenvolvimento, doe-nos uma xícara de café :()
[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=techspot%40techspot%2ecom%2ebr&lc=BR&item_name=TechSpot&currency_code=BRL&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

