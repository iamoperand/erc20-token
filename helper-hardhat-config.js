const { ethers } = require("hardhat")

const networkConfig = {
    31337: {
        name: "localhost",
        initialSupply: (1e18).toString(),
    },
    4: {
        name: "rinkeby",
        initialSupply: (1e18).toString(),
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
