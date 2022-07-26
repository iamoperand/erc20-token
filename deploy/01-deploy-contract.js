const { ethers } = require("hardhat")

const { developmentChains, networkConfig, INITIAL_SUPPLY } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const args = [INITIAL_SUPPLY]

    const contract = await deploy("Token", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Token deployed at ${contract.address}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(contract.address, args)
    }
}

module.exports.tags = ["all", "token"]
