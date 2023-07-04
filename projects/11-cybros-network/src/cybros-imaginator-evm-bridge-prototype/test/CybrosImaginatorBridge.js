const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CybrosImaginatorBridge", function () {
  it("test initial value", async function () {
    const deployedContract = await ethers.deployContract("CybrosImaginatorBridge");
    const [owner] = await ethers.getSigners();
    expect(await deployedContract.owner()).to.equal(owner.address);
  });

  it("not enough value error", async function () {
    const deployedContract = await ethers.deployContract("CybrosImaginatorBridge");
    const testPrompt = "test";
    const amount = 1_000;
    await expect(deployedContract.requestSimple(testPrompt, {
      value: amount
    })).to.be.revertedWith("Amount is less than the minimum required");
  });
});
