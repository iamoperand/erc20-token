// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    /// @dev initialSupply has 18 decimals
    constructor(uint256 initialSupply) ERC20("Token", "OT") {
        _mint(msg.sender, initialSupply);
    }
}
