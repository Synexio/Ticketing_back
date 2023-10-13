import {ethers, upgrades} from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe('Ticketing', function () {


    async function deployFixture() {

        const [owner, otherAccount] = await ethers.getSigners();

        const Ticketing = await ethers.getContractFactory('Ticketing');
        const ticketing = await upgrades.deployProxy(Ticketing, [10, 1, owner.address], { initializer: "initialize" });
        await ticketing.waitForDeployment();

        return { ticketing, owner, otherAccount };
    }
    

    // Tests
    it('Should mint a ticket', async function () {
        const { ticketing, otherAccount } = await loadFixture(deployFixture);
        await ticketing.connect(otherAccount).mint({ value: 1 });
        expect(await ticketing.balanceOf(otherAccount.address)).to.equal(1);
    });


    it('Should not mint without enough MATIC', async function () {
        const { ticketing, otherAccount } = await loadFixture(deployFixture);
        await expect(ticketing.connect(otherAccount).mint({ value: 0 })).to.be.revertedWith('Not enough MATIC!');
    });

    it('Should not mint if there are no available tickets', async function () {
        const { ticketing, otherAccount } = await loadFixture(deployFixture);
        // Mint all available tickets
        for (let i = 0; i < 10; i++) {
            await ticketing.connect(otherAccount).mint({ value: 1 });
        }
        await expect(ticketing.connect(otherAccount).mint({ value: 1 })).to.be.revertedWith('Not enough tickets');
    });

    it('Should trasnfer a ticket', async function () {
        const { ticketing, owner, otherAccount } = await loadFixture(deployFixture);
        await ticketing.mint({ value: 1 });
        await ticketing.transferFrom(owner.address, otherAccount.address, 0);
        expect(await ticketing.balanceOf(otherAccount.address)).to.equal(1);
    });

    it('Should withdraw contract balance to the owner', async function () {
        const { ticketing, owner, otherAccount } = await loadFixture(deployFixture);
        await ticketing.connect(otherAccount).mint({ value: 1000000000000000 });
        const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
        await ticketing.withdraw();
        const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
        expect(Number(finalOwnerBalance)).to.be.gt(Number(initialOwnerBalance));
    });


});
