const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert, expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle unit tests", function () {
          let deployer, receiver, ourTokenContract, ourToken
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              receiver = accounts[1]
              ourTokenContract = await ethers.getContractAt(
                  "OurToken",
                  "0xf97294a9eB7816a486E83BCda8940e6baEd70106",
                  deployer,
              )
              ourToken = ourTokenContract.connect(deployer)
              receiverToken = ourTokenContract.connect(receiver)
          })
          describe("constructor", () => {
              it("have initial supply of 10000", async () => {
                  console.log(receiver.address)
                  console.log(`Token address: ${await ourToken.getAddress()}`)
                  //   assert.equal(await ourToken.balanceOf(deployer), ethers.parseEther("10000"))
                  console.log(await ourToken.totalSupply())
                  assert.equal(await ourToken.totalSupply(), ethers.parseEther("10000"))
                  console.log(await ourToken.name())
                  assert.equal("OurToken", await ourToken.name())
                  console.log(await ourToken.symbol())
                  assert.equal("OT", await ourToken.symbol())
              })
          })
          describe("transfers", () => {
              it("Should be able to transfer tokens successfully to an address, emits an transfer event when an transfer occurs", async () => {
                  const tx = await ourToken.transfer(receiver, ethers.parseEther("11"))
                  const txReceipt = await tx.wait(1)
                  console.log(txReceipt.logs[0].args)
              })
          })
          describe("allowances", () => {
              it("Should approve other address to spend token", async () => {
                  await ourToken.approve(receiver, ethers.parseEther("10"))
                  const receiverBalance = await ourToken.balanceOf(receiver)
                  console.log(`receiver old Balance ${receiverBalance}`)
                  const tx = await receiverToken.transferFrom(
                      deployer,
                      receiver,
                      ethers.parseEther("10"),
                  )
                  await tx.wait(5)
                  assert.equal(
                      await ourToken.balanceOf(receiver),
                      receiverBalance + ethers.parseEther("10"),
                  )
              })
              it("doesn't allow an unnaproved member to do transfers", async () => {
                  await expect(
                      receiverToken.transferFrom(deployer, receiver, ethers.parseEther("10")),
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
              //   it("emits an approval event, when an approval occurs", async () => {
              //       await expect(ourToken.approve(receiver, ethers.parseEther("3"))).to.emit(
              //           ourToken,
              //           "Approval",
              //       )
              //   })
              it("the allowance being set is accurate", async () => {
                  await ourToken.approve(receiver, ethers.parseEther("1"))
                  //   const tx = await ourToken.approve(receiver, ethers.parseEther("747"))
                  //   const txReceipt = await tx.wait(1)
                  //   const approveNumber = txReceipt.logs[0].args.value
                  const approveNumber = await ourToken.allowance(deployer, receiver)
                  assert.equal(approveNumber, ethers.parseEther("1"))
              })
              it("won't allow a user to go over the allowance", async () => {
                  await ourToken.approve(receiver, ethers.parseEther("1"))
                  await expect(
                      receiverToken.transferFrom(deployer, receiver, ethers.parseEther("2")),
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
          })
      })
