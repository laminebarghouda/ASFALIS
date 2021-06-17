var Ownable = artifacts.require("./Ownable.sol");
var LocalAuthority = artifacts.require("./LocalAuthority.sol");
var OMS = artifacts.require("./OMS.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(OMS);
  deployer.deploy(LocalAuthority);
};
