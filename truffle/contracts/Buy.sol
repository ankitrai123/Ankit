
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;
contract Buy {
    string public name;
    uint public productCount=0;
    mapping(uint => Product) public products;

    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated (
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );
    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
       string purchased
    );
    
    constructor() public{
        name = "The Hyper Mart";
    }
   
   function creatProduct(string memory _name, uint _price) public{

        require(bytes(_name).length>0);
        require(_price > 0);
        productCount++ ;
        products[productCount]= Product(productCount, _name, _price, payable(msg.sender), false);

   }

   function purchaseProduct(uint _id) public payable  {

    Product memory _product = products[_id];
    
    address payable _seller =_product.owner;
    require(_product.id > 0 && _product.id <= productCount);
    require(msg.value >= _product.price);
    require(!_product.purchased);
     require(_seller != msg.sender);
    _product.owner= payable(msg.sender);
    _product.purchased=true;
    products[_id]=_product; 
   payable(address(_seller)).transfer(msg.value);
   string memory status ="Puccessfully Purchased";
    emit ProductPurchased(productCount,_product.name,_product.price,payable(msg.sender),status);

   }
   
}