import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
// eslint-disable-next-line node/no-missing-import
import { Ballot } from "../../typechain";

/**
 * Entry point to delegate votes in a ballot contract - expecting ballot adress and address to delegate to
 */
async function main() {

    if(process.argv.length < 2) throw new Error("No user address specified!");
    const ballotAddress = process.argv[2];

    if(process.argv.length < 3) throw new Error("No user address specified!");
    const address = process.argv[3];

    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!);
    const provider = new ethers.providers.AlchemyProvider("rinkeby", process.env.API_KEY);
    const signer = wallet.connect(provider);

    const balanceBN = await signer.getBalance();
    const balance = Number(ethers.utils.formatEther(balanceBN));
    console.log(`Wallet balance ${balance}`);
    if (balance < 0.01) {
        throw new Error("Not enough ether");
    }

    const ballotContract :Ballot = new Contract(
        ballotAddress,
        ballotJson.abi,
        signer
    ) as Ballot;

    const tx = await ballotContract.delegate(address);

    console.log("Awaiting confirmation...");
    await tx.wait();
    console.log(`Transaction Hash: ${tx.hash}`);
}

/**
 * A check for any errors - will print to console if something goes wrong
 */
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });