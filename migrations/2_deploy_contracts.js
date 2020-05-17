var Elevator = artifacts.require("./Elevator.sol");

module.exports = function(deployer) {
  deployer.deploy(Elevator);
};
