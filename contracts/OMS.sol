pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import './Ownable.sol';

    struct Medicament{
        string dci;
        string specialite;
        string dosage;
        string forme;
        string presentation;
        string conditionnement;
        string classement_VEIC; //change to enum
        string classe_therapeutic;
        string sous_classe;
        string laboratoire;
        string tableau;
        string duree_conservation;
        string indication;
        string generique_princeps;
        uint amm;
        string status;
    }

    struct Laboratoire{
        string nom;
        string countryCode;
    }

contract OMS is Ownable {

    mapping (string => address) countryToAddress;
    mapping (string => Medicament) DCITomedicamentsInterdis;
    mapping (string => Laboratoire) listLabos;

    event prohibitedDrugAdded(Medicament medicament);
    event localAuthorityAdded(string countryCode);


    //returns true if prohibited
    function checkProhibitedDrug(string memory dci) view public returns(bool){
        if (keccak256(abi.encodePacked(DCITomedicamentsInterdis[dci].dci)) == keccak256(abi.encodePacked(""))){
            return false;
        }else{
            return true;
        }
    }

    function addOrUpdateProhibitedDrug(Medicament memory medicament) public onlyOwner {
        DCITomedicamentsInterdis[medicament.dci] = medicament;
        emit prohibitedDrugAdded(medicament);
    }

    function addOrUpdateLocalAuthority(string memory countryCode, address localAuthority) public onlyOwner returns (address) {
        countryToAddress[countryCode] = localAuthority;
        emit localAuthorityAdded(countryCode);
        return countryToAddress[countryCode];
    }




}
