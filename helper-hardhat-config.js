const { ethers } = require("hardhat")

const INITIAL_SUPPLY = (1e18).toString()

const networkConfig = {
    31337: {
        name: "localhost",
    },
    4: {
        name: "rinkeby",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
    INITIAL_SUPPLY,
}
