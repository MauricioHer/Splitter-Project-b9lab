//var ConvertLib = artifacts.require("./ConvertLib.sol");
var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
  deployer.deploy(Splitter,{gas:1000000});
};
