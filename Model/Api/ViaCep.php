<?php
namespace Techspot\BrAutocomplete\Model\Api;

use Magento\Framework\ObjectManagerInterface;


class ViaCep 
{
    
    /**
     * @var \Zend\Http\Client $zendClient
     */
    protected $zendClient;

     /**
     * @var \Magento\Framework\Json\Helper\Data
     */
    protected $jsonHelper;
    
    private $_regionFactory;

    public function __construct(
        \Zend\Http\Client $zendClient,
        \Magento\Framework\Json\Helper\Data $jsonHelper,
        \Magento\Directory\Model\RegionFactory $regionFactory
    ) {
        $this->zendClient = $zendClient;
        $this->jsonHelper = $jsonHelper;
        $this->_regionFactory = $regionFactory;
    }


    public function getAddressByPostcode($postcode)
    {
        $serviceUri = "https://viacep.com.br/ws/".$postcode."/json/";
        try
        {
            $this->zendClient->reset();
            $this->zendClient->setUri($serviceUri);
            $this->zendClient->setMethod(\Zend\Http\Request::METHOD_GET); 
        
       	    $this->zendClient->setHeaders([
                'Content-Type' => 'application/json'
            ]);
            
            $response           = $this->zendClient->send();
            $result             = $response->getBody();

            if($response->getStatusCode() == 200){
                $result             = $this->jsonHelper->jsonDecode($result);
                if(!isset($result['erro'])){
                    $result['code']     = $response->getStatusCode();
                    $result['region_id'] = $this->getRegionIdByCode($result['uf']);
                }
            } else {
                $result = array();
                $result['code']     = $response->getStatusCode();
            }
            return $result;
        }
        catch (\Magento\Framework\Exception\LocalizedException $localizedException)
        {
            $result = array();
            $result['code'] = 500;
            $result['message'] = $localizedException->getMessage();
            return $result;
        }
    }

    /**
     * @param string $region
     * @return string[]
     */
    protected function getRegionIdByCode(string $code)
    {
        return $this->_regionFactory->create()
            ->loadByCode($code, 'BR')
            ->getId();
    }
}