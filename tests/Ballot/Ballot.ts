/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { assert } from "console";
import { ethers } from "hardhat";
import { Ballot } from "../../typechain";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(strings: string[]): string[] {
  return strings.map((string) => ethers.utils.formatBytes32String(string));
}

describe("Ballot", function () {
  let contract: Ballot;
  let accounts: SignerWithAddress[];

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("Ballot");
    contract = await contractFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await contract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await contract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await contract.proposals(index);
        expect(proposal.voteCount).to.eq(0);
      }
    });

    it("sets the deployer address as chairperson", async function () {
      const address = await contract.chairperson();
      const deployer = accounts[0].address;
      expect(address).to.eq(deployer);
    });

    it("sets the voting weight for the chairperson as 1", async function () {
      const chairpersonVoter = await contract.voters(accounts[0].address);
      expect(chairpersonVoter.weight).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      let newVoter = await contract.voters(accounts[1].address);
      expect(newVoter.weight).to.eq(0);
      const tx = await contract.giveRightToVote(accounts[1].address);
      await tx.wait();
      newVoter = await contract.voters(accounts[1].address);
      expect(newVoter.weight).to.eq(1);
    });

    it("can not give right to vote for someone that has voted", async function () {
      const tx = await contract.giveRightToVote(accounts[1].address);
      await tx.wait();
      const voteTx = await contract.connect(accounts[1]).vote(2);
      await voteTx.wait();
      await expect(
        contract.giveRightToVote(accounts[1].address)
      ).to.be.revertedWith("The voter already voted.");
    });

    it("can not give right to vote for someone that already has voting rights", async function () {
      const tx = await contract.giveRightToVote(accounts[1].address);
      await tx.wait();
      await expect(
        contract.giveRightToVote(accounts[1].address)
      ).to.be.revertedWith("");
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    it("they are set to voted", async function () {
      const tx = await contract.giveRightToVote(accounts[1].address);
      await tx.wait();
      const beforeVotingVoter = await contract.voters(accounts[1].address);
      expect(beforeVotingVoter.voted).to.eq(false);
      const voteTx = await contract.connect(accounts[1]).vote(1)
      await voteTx.wait();
      const afterVotingVoter = await contract.voters(accounts[1].address);
      expect(afterVotingVoter.voted).to.eq(true);
    });    
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    it("will allow another user with vote permission to get another vote", async function () {
      const tx = await contract.giveRightToVote(accounts[1].address);
      const tx2 = await contract.giveRightToVote(accounts[2].address);
      await tx.wait();
      await tx2.wait();
      const voteTx = await contract.connect(accounts[1]).delegate(accounts[2].address)
      await voteTx.wait();
      const voter1 = await contract.voters(accounts[1].address);
      const voter2 = await contract.voters(accounts[2].address);
      assert(voter1.voted);
      assert(!voter2.voted);
      expect(voter2.weight).to.eq(2);
      });
    });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    it("will cause state to be reverted", async function () { 
      await expect(
        contract.connect(accounts[1]).giveRightToVote(accounts[2].address)
      ).to.be.revertedWith("Only chairperson can give right to vote.'");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    it("will cause state to be reverted", async function () {
      await expect(
        contract.connect(accounts[1]).vote(2)
      ).to.be.revertedWith("Has no right to vote");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    it("will cause state to be reverted", async function () {
      await expect(
        contract.connect(accounts[1]).delegate(accounts[2].address)
      ).to.be.revertedWith("");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    it("will default to first proposal winning", async function () {
      const winningProposalIndex = await contract.connect(accounts[1]).winningProposal();
      expect(winningProposalIndex).to.eq(0);
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    it("will show proposal with most votes as winner", async function () {
      const tx = await contract.giveRightToVote(accounts[1].address);
      await tx.wait();
      const voteTx = await contract.connect(accounts[1]).vote(1)
      await voteTx.wait();
      const winningProposalIndex = await contract.connect(accounts[1]).winningProposal();
      expect(winningProposalIndex).to.eq(1);
      });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    it("will default to first proposal winning", async function () {
      const winningProposal = await contract.connect(accounts[1]).winnerName();
      expect(ethers.utils.parseBytes32String(winningProposal)).to.eq("Proposal 1");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    it("will show proposal with most votes as winner", async function () {
      const tx = await contract.giveRightToVote(accounts[1].address);
      await tx.wait();
      const voteTx = await contract.connect(accounts[1]).vote(1)
      await voteTx.wait();
      const winningProposal = await contract.connect(accounts[1]).winnerName();
      expect(ethers.utils.parseBytes32String(winningProposal)).to.eq("Proposal 2");
      });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    it("will choose a winner with the most votes", async function () {
      const tx1 = await contract.giveRightToVote(accounts[1].address);
      const tx2 = await contract.giveRightToVote(accounts[2].address);
      const tx3 = await contract.giveRightToVote(accounts[3].address);
      const tx4 = await contract.giveRightToVote(accounts[4].address);
      const tx5 = await contract.giveRightToVote(accounts[5].address);
      await tx1.wait();
      await tx2.wait();
      await tx3.wait();
      await tx4.wait();
      await tx5.wait();
      const voteTx1 = await contract.connect(accounts[1]).vote(Math.floor(Math.random() * PROPOSALS.length));
      const voteTx2 = await contract.connect(accounts[2]).vote(Math.floor(Math.random() * PROPOSALS.length));
      const voteTx3 = await contract.connect(accounts[3]).vote(Math.floor(Math.random() * PROPOSALS.length));
      const voteTx4 = await contract.connect(accounts[4]).vote(Math.floor(Math.random() * PROPOSALS.length));
      const voteTx5 = await contract.connect(accounts[5]).vote(Math.floor(Math.random() * PROPOSALS.length));
      await voteTx1.wait();
      await voteTx2.wait();
      await voteTx3.wait();
      await voteTx4.wait();
      await voteTx5.wait();
      const winningProposalIndex = await contract.connect(accounts[1]).winningProposal();
      expect([0,1,2]).to.include(winningProposalIndex.toNumber());
      const winningProposal = await contract.connect(accounts[1]).winnerName();
      expect(PROPOSALS).to.include(ethers.utils.parseBytes32String(winningProposal));
    });
  });

  describe("when the contract is deployed", function () {
    it("has ability to get number of proposals", async function () {
      const numProposals = await contract.numProposals();
      expect(numProposals).to.eq(3);
    });
  });
});
