import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
  }

async function main() {
    if (process.argv.length < 2) throw new Error("No proposal index specified");

    const index = process.argv[2];

    let ballotAddress = "0xe7f67981bab970fA28A09D51e8a32c59fe26ee08";
    let voterAddress = "0x4AdeF044692817daa6bB18CE1f8D3594EaBc6dC0";

    //allow for user entered contract and voter address
    //for easier running and testing we hardcode the addresses above
    if (process.argv.length >= 4) {
        ballotAddress = process.argv[3];
        voterAddress = process.argv[4];
    }

    const provider = new ethers.providers.AlchemyProvider('rinkeby', process.env.API_KEY);

    const ballotContract : Ballot = new Contract(
        ballotAddress,
        ballotJson.abi,
        provider
    ) as Ballot;


    const proposal = await ballotContract.proposals(index);

    //console.log(proposal);

    console.log(`The proposal "${ethers.utils.parseBytes32String(proposal.name)}" with index ${index} has ${proposal.voteCount} votes.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });