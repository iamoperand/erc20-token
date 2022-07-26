const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { INITIAL_SUPPLY, developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Token Unit Tests", function () {
          const multiplier = 10 ** 18
          let tokenContract, deployer, user1, user2

          beforeEach(async function () {
              const accounts = await getNamedAccounts()
              deployer = accounts.deployer
              user1 = accounts.user1
              user2 = accounts.user2

              await deployments.fixture("all")
              tokenContract = await ethers.getContract("Token", deployer)
          })

          it("Was deployed", async () => {
              assert(tokenContract.address)
          })

          describe("Constructor", () => {
              it("Should have correct INITIAL_SUPPLY", async () => {
                  const totalSupply = await tokenContract.totalSupply()
                  assert.equal(totalSupply.toString(), INITIAL_SUPPLY)
              })

              it("Initializes the token with the correct name and symbol", async () => {
                  const name = (await tokenContract.name()).toString()
                  assert.equal(name, "Token")

                  const symbol = (await tokenContract.symbol()).toString()
                  assert.equal(symbol, "OT")
              })
          })

          describe("Minting", () => {
              it("User cannot mint", async () => {
                  try {
                      await tokenContract._mint(deployer, 100)
                      assert(false)
                  } catch (e) {
                      assert(e)
                  }
              })
          })

          describe("Transfers", () => {
              it("Should be able to transfer tokens successfully to an address", async () => {
                  const tokensToSend = ethers.utils.parseEther("0.01")
                  await tokenContract.transfer(user1, tokensToSend)
                  expect(await tokenContract.balanceOf(user1)).to.equal(tokensToSend)
              })

              it(`Emits a "transfer" event when a transfer occurs`, async () => {
                  await expect(
                      tokenContract.transfer(user1, (0.01 * multiplier).toString())
                  ).to.emit(tokenContract, "Transfer")
              })
          })

          describe("Allowances", () => {
              let tokenContract1, tokenContract2
              const amount = (0.02 * multiplier).toString()

              beforeEach(async () => {
                  tokenContract1 = await ethers.getContract("Token", user1)
                  tokenContract2 = await ethers.getContract("Token", user2)
              })

              it("Should approve other addresses to spend token", async () => {
                  const tokensToSpend = ethers.utils.parseEther("0.02")
                  await tokenContract.approve(user1, tokensToSpend)

                  await tokenContract1.transferFrom(deployer, user1, tokensToSpend)
                  expect(await tokenContract.balanceOf(user1)).to.equal(tokensToSpend)
              })

              it("Doesn't allow an unapproved member to do transfers", async () => {
                  await expect(
                      tokenContract1.transferFrom(deployer, user2, amount)
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })

              it("Emits an approval event, when an approval occurs", async () => {
                  await expect(tokenContract.approve(user1, amount)).to.emit(
                      tokenContract,
                      "Approval"
                  )
              })

              it("The allowance being set is accurate", async () => {
                  await tokenContract.approve(user1, amount)
                  const allowance = await tokenContract.allowance(deployer, user1)
                  assert.equal(allowance.toString(), amount)
              })

              it("Won't allow a user to go over the allowance", async () => {
                  await tokenContract.approve(user1, amount)
                  await expect(
                      tokenContract1.transferFrom(deployer, user1, (0.04 * multiplier).toString())
                  ).to.be.revertedWith("ERC20: insufficient allowance")
              })
          })
      })
