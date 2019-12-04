<?php
/**
 * The Tech Spot Br Autocomplete module is a comercial module
 * Copyright (C) 2019  Tech Spot 
 * 
 * This file is part of Techspot/BrAutocomplete.
 * 
 * Techspot/BrAutocomplete is  a Not For Resale (NFR) software.
 * 
 * You should have received a copy of the Not For Resale (NFR) License
 * along with this program.
 */
namespace Techspot\BrAutocomplete\Controller\Index;

use Magento\Framework\Controller\ResultFactory;

class AddressAutoComplete extends \Magento\Framework\App\Action\Action
{
    /**
     * @var \Magento\Framework\Json\Helper\Data
     */
    protected $_jsonHelper;

    /**
     * @var \Techspot\BrAutocomplete\Model\Api\ViaCep
     */
    protected $viacep;
    
    /**
     * Constructor.
     * 
     * @param \Magento\Framework\Json\Helper\Data $jsonHelper
     * @param \Techspot\BrAutocomplete\Model\Api\ViaCep $viacep
     */
    public function __construct(
        \Magento\Framework\App\Action\Context $context,
        \Magento\Framework\Json\Helper\Data $jsonHelper,
        \Techspot\BrAutocomplete\Model\Api\ViaCep $viacep
    ){
        $this->_jsonHelper = $jsonHelper;
        $this->viacep = $viacep;
        parent::__construct($context);
    }

    /**
     * Return Json address if located
     *
     * @return void
     */
    public function execute()
    {
        $postcode = $this->getRequest()->getParam('postcode');
        $responseData = array();

        if($postcode){
            $responseData  = $this->viacep->getAddressByPostcode($postcode);

            $response = $this->resultFactory->create(ResultFactory::TYPE_RAW);
            $response->setHeader('Content-type', 'text/plain');
            
            $response->setContents(
                $this->_jsonHelper->jsonEncode($responseData)            
            );
            return $response;
        }
        return false;
    }
}