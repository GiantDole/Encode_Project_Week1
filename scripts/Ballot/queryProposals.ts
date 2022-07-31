import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";



/**
 * Entry point to queuery proposals in ballot contract - expecting contract adress and proposal index to be passed in
 */
async function main() {
    if (process.argv.length < 2) throw new Error("No contract address specified.");
    const ballotAddress = process.argv[2];

    if (process.argv.length < 3) throw new Error("No proposal index specified.");
    let index = process.argv[3];


    const provider = new ethers.providers.AlchemyProvider('rinkeby', process.env.API_KEY);

    const ballotContract : Ballot = new Contract(
        ballotAddress,
        ballotJson.abi,
        provider
    ) as Ballot;


    const proposal = await ballotContract.proposals(index);
    console.log(`The proposal "${ethers.utils.parseBytes32String(proposal.name)}" with index ${index} has ${proposal.voteCount} votes.`);
}

/**
 * A check for any errors - will print to console if something goes wrong
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });