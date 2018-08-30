pragma solidity ^0.4.18;

contract Splitter{
    address[] public addressKeeper;   //Guarda las direcciones de Alice,Bob y Carol
    bool public bobPending;           // Indica si Bob tiene pendiente pago
    bool public carolPending;         //  Carol tiene pendiente pago
    address public owner;             //dueño del contrato
    
    event Logcreator(address owner, address Bob, address Carol);
    
    modifier onlyOwner(){
        require(owner==msg.sender);   //Solo el dueño puede modificar
        _;
    }
  
    function Splitter() public payable{
        owner=msg.sender;		//cuando se crea el contrato, declara quien es el dueño 
    }

       function() public payable{	//función fallback
	}
	
//guardar las direcciones de Alice, Bob y Carol (Solo el dueño la puede modificar).

    function setReceivers(address _Bob, address _Carol) onlyOwner public{
	require(msg.sender!=_Bob && msg.sender!=_Carol && _Bob!=_Carol);
        addressKeeper.push(msg.sender);
        addressKeeper.push(_Bob);
        addressKeeper.push(_Carol);
        bobPending=true;
        carolPending=true;
        Logcreator(msg.sender,_Bob,_Carol);
	}  

    function withDrawOne() payable public{		//Permite retirar el dinero pendiente.
        require(msg.sender==addressKeeper[1]);		//solo el indicado puede
        require(bobPending==true);			//debe tener pendiente
            if(carolPending==true){			//si Carol no ha retirado, puede quitar la mitad del balance
            addressKeeper[1].transfer(address(this).balance/2);
            }
            else {
            addressKeeper[1].transfer(address(this).balance); //si Carol ya retiró, puede quitar todo el balance
            }
        bobPending=false;
    }
            
function withDrawTwo() payable public{
        require(msg.sender==addressKeeper[2]);
        require(carolPending==true);
            if(bobPending==true){
            addressKeeper[2].transfer(address(this).balance/2);
            }
            else {
            addressKeeper[2].transfer(address(this).balance); 
            }
            carolPending=false;
    }
    
    function contractBalance() public view returns(uint){	//devuelve el balance del contrato
        return( address(this).balance);
    }
    
    function participantBalance() public view returns( uint, uint, uint){	//entrega el balance de los participantes
        return(addressKeeper[0].balance,addressKeeper[1].balance,addressKeeper[2].balance);
    }
    
    function emergency()public onlyOwner payable{
        require(address(this).balance>0);   //si el balance es mayor a 0
        owner.transfer(address(this).balance); //devuelva el dinero del contrato al dueño
        selfdestruct(owner);  //que se destruya el contrato
    }
    
}
