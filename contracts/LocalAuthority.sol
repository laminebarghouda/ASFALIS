// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import "./OMS.sol";

contract LocalAuthority is Ownable {
    string countryCode;

    enum AMMStatus { Active, Suspended, Deleted }
    struct AMM{
        uint AMM;
        string dateAMM;
        AMMStatus status;
        string lab;
        Medicament medicament;
    }

    struct Reclamation{
        string drugName;
        string drugStoreAddress;
        string imageHash;
    }

    event reclamationEvent(string drugName, string drugStoreAddress, string ipfsHash);

    mapping (uint => AMM) listAMM;
    mapping (bytes => AMM) ammByMedicament;


    event AMMAdded(AMM amm);
    event AMMDeleted(AMM amm);
    event AMMSuspended(AMM amm);
    event reclamationReceived(Reclamation reclamation);

    function checkDrugVeracity(string memory dosage, string memory forme, string memory presentation) view public returns(bool) {
        AMM storage amm = ammByMedicament[abi.encodePacked(dosage,forme,presentation)];
        if (amm.status == AMMStatus.Active){
            return true;
        }else{
            return false;
        }
    }

    function addAMM(Medicament memory medicament,uint idAMM,string memory date) public onlyOwner {
        AMM storage amm = listAMM[idAMM];
        amm.AMM = idAMM;
        amm.dateAMM=date;
        amm.status = AMMStatus.Active;
        amm.medicament = medicament;
        ammByMedicament[abi.encodePacked(medicament.dosage,medicament.forme,medicament.presentation)] = listAMM[idAMM];
        emit AMMAdded(listAMM[idAMM]);
    }

    function updateAMM(Medicament memory medicament,uint idAMM,string memory date, AMMStatus status) public onlyOwner {
        AMM storage amm = listAMM[idAMM];
        amm.AMM = idAMM;
        amm.dateAMM=date;
        amm.status = status;
        amm.medicament = medicament;
        ammByMedicament[abi.encodePacked(medicament.dosage,medicament.forme,medicament.presentation)] = listAMM[idAMM];
        if (status == AMMStatus.Deleted){
            emit AMMDeleted(listAMM[idAMM]);
        }else if (status == AMMStatus.Suspended){
            emit AMMSuspended(listAMM[idAMM]);
        }
    }

function displayDrugDetails(string memory dosage, string memory forme, string memory presentation) view public returns(Medicament memory) {
AMM storage amm = ammByMedicament[abi.encodePacked(dosage,forme,presentation)];
return amm.medicament;
}


function sendReclamation(string memory dn, string memory dsa, string memory ih) public {
Reclamation memory reclamation = Reclamation(dn, dsa, ih);
emit reclamationReceived(reclamation);
}



}
