pragma solidity >=0.4.21 <0.7.0;

contract Report {
  string drugName;
  string drugStoreAddress;
  string imageHash;
  
event reportEvent(string drugName, string drugStoreAddress, string ipfsHash);

  function set(string memory dn, string memory dsa, string memory ih) public {
    drugName = dn;
    imageHash = dsa;
    imageHash = ih;
    emit reportEvent(dn, dsa, ih);
  }

  function getDrugName() public view returns (string memory) {
    return drugName;
  }

  function getDrugStoreAddress() public view returns (string memory) {
    return drugStoreAddress;
  }

  function getImageHash() public view returns (string memory) {
    return imageHash;
  }

}
