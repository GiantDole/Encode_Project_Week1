import { BigNumber, Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";


/**
 * Entry point to queuery results in ballot contract - expecting contract adress
 */
async function main() {
    if (process.argv.length < 2) throw new Error("No contract address specified.");
    const ballotAddress = process.argv[2];

    const provider = new ethers.providers.AlchemyProvider('rinkeby', process.env.API_KEY);

    const ballotContract : Ballot = new Contract(
        ballotAddress, 
        ballotJson.abi,
        provider
    ) as Ballot;

    const index = await ballotContract.winningProposal();

    const winningProposal = await ballotContract.proposals(index);

    console.log(`The proposal "${ethers.utils.parseBytes32String(winningProposal.name)}" with index ${index} has won with ${winningProposal.voteCount} votes.`);
}

/**
 * A check for any errors - will print to console if something goes wrong
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });