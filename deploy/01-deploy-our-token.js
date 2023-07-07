const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    const initialSupply = ethers.parseEther("10000")
    const args = [initialSupply]
    const ourToken = await deploy("OurToken", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Our Token: ${ourToken.address}`)

    log("---------------------------------------------------")
}

module.exports.tags = ["all", "ourtoken"]
