# Sample ERC20 Project

This project create an ERC20s standard token, deploy and testing its function.

1. Testnet test:
   if you want to connect another account.
   first, need to add another private key (PRIVATE_KEY_2) in your hardhat.config, like this:
    ```shell
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY, PRIVATE_KEY_2],
            chainId: 11155111,
            blockConfirmations: 6,
        }
    }
    ```
    then, connect this account with contract:
    ```shell
    accounts = await ethers.getSigners()
    deployer = accounts[0] // this is PRIVATE_KEY
    connector = accounts[1] // this is PRIVATE_KEY_2
    Contract = await ethers.getContractAt("contractName","contractAddress",deployer)
    connectorConnect = Contract.connect(connector)
    ```
