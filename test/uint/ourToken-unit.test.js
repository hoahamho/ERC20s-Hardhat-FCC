const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("OurToken Unit Test", function () {
          let sender, receiver, ourToken, receiverToken
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              sender = accounts[0]
              receiver = accounts[1]
              //   deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["ourtoken"])
              const ourTokenContract = await ethers.getContract("OurToken")
              ourToken = ourTokenContract.connect(sender)
              receiverToken = ourTokenContract.connect(receiver)
          })
          it("was deployed", async () => {
              console.log(`Token address: ${await ourToken.getAddress()}`)
              assert(await ourToken.getAddress())
          })
          describe("constructor", () => {
              it("Should have correct INITIAL_SUPPLY of token ", async () => {
                  console.log(`Total supply: ${await ourToken.totalSupply()}`)
                  assert.equal(ethers.parseEther("10000"), await ourToken.totalSupply())
              })
              it("initializes the token with the correct name and symbol ", async () => {
                  console.log(await ourToken.name())
                  assert.equal("OurToken", await ourToken.name())
                  console.log(await ourToken.symbol())
                  assert.equal("OT", await ourToken.symbol())
              })
          })
          describe("transfers", () => {
              //   beforeEach(async () => {
              //       const tx = await ourToken.transfer(receiver, ethers.parseEther("1000"))
              //       const txRC = await tx.wait(1)
              //       console.log(await ourToken.balanceOf(receiver.getAddress()))
              //       console.log(txRC.logs[0].args)
              //       // 1000 000 00000 00000 00000n decimals of 18
              //   })
              it("Should be able to transfer tokens successfully to an address", async () => {
                  await ourToken.transfer(receiver, ethers.parseEther("1000"))
                  assert.equal(
                      await ourToken.balanceOf(receiver.getAddress()),
                      ethers.parseEther("1000"),
                  )
              })
              it("emits an transfer event, when an transfer occurs", async () => {
                  await expect(
                      await ourToken.transfer(receiver, ethers.parseEther("1000")),
                  ).to.emit(ourToken, "Transfer")
              })
          })
          describe("allowances", () => {
              it("Should approve other address to spend token", async () => {
                  await ourToken.approve(receiver, ethers.parseEther("10"))
                  await receiverToken.transferFrom(sender, receiver, ethers.parseEther("10"))
                  assert.equal(await receiverToken.balanceOf(receiver), ethers.parseEther("10"))
              })
              it("doesn't allow an unnaproved member to do transfers", async () => {
                  await expect(
                      receiverToken.transferFrom(sender, receiver, ethers.parseEther("10")),
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
              it("emits an approval event, when an approval occurs", async () => {
                  await expect(ourToken.approve(receiver, ethers.parseEther("10"))).to.emit(
                      ourToken,
                      "Approval",
                  )
              })
              it("the allowance being set is accurate", async () => {
                  await ourToken.approve(receiver, ethers.parseEther("747"))
                  //   const tx = await ourToken.approve(receiver, ethers.parseEther("747"))
                  //   const txReceipt = await tx.wait(1)
                  //   const approveNumber = txReceipt.logs[0].args.value
                  const approveNumber = await ourToken.allowance(sender, receiver)
                  assert.equal(approveNumber, ethers.parseEther("747"))
              })
              it("won't allow a user to go over the allowance", async () => {
                  await ourToken.approve(receiver, ethers.parseEther("747"))
                  await expect(
                      receiverToken.transferFrom(sender, receiver, ethers.parseEther("757")),
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
          })
      })
