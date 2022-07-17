# Group 2
## Encode Solidity Bootcamp Week 1 Project
YES, these keys are compromised. This was done intentionally to allow our team to test the project with short setup time. :) Please don't try this at home, kids!
### Initialize the project
<pre><code>yarn install
yarn hardhat compile
</code></pre>

### Instructions:
* Structure scripts to
  * Deploy :white_check_mark:
  * Query proposals :white_check_mark:
  * Give vote right passing an address as input :white_check_mark:
  * Cast a vote to a ballot passing contract address and proposal as input and using the wallet in environment :white_check_mark:
  * Delegate my vote passing  user address as input and using the wallet in environment :white_check_mark:
  * Query voting result and print to console
* Publish the project in Github
* Run the scripts with a set of proposals, cast and delegate votes and inspect results
* Write a report detailing the addresses, transaction hashes, description of the operation script being executed and console output from script execution for each step (Deployment, giving voting rights, casting/delegating and querying results).
* (Extra) Use TDD methodology

## Commands:

### Deploy contract:

Substitute the [] with proposal names!
<pre><code>yarn run ts-node --files ./scripts/Ballot/deployment.ts [No1] [No2] [No3]
</code></pre>


### Query proposals:

To query a single proposal, use the commmand below specifying the contract address and proposal index.
<pre><code>yarn run ts-node --files ./scripts/Ballot/queryProposals.ts [ballotAddress] [proposalIndex]
</code></pre>
E.g. you could run the following command on our ballot:
<pre><code>yarn run ts-node --files ./scripts/Ballot/queryProposals.ts "0x73165A21db8EF6b5becC580102d1a9F4A0e7Ee09" 1
</code></pre>

### Give vote right:

Giving vote rights to the address specified as first argument.
<pre><code>yarn run ts-node --files ./scripts/Ballot/giveVotingRights.ts [ballotAddress] [votingAddress]
</code></pre>

E.g. you could run the following command on our ballot:
<pre><code>yarn run ts-node --files ./scripts/Ballot/giveVotingRights.ts "0x73165A21db8EF6b5becC580102d1a9F4A0e7Ee09" "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
</code></pre>

### Cast vote to ballot:

<pre><code>yarn run ts-node --files ./scripts/Ballot/castVote.ts [ballotAddress] [proposalIndex]
</code></pre>

### Delegate vote:

<pre><code>yarn run ts-node --files ./scripts/Ballot/delegateVote.ts [ballotAddress] [userAddress]
</code></pre>

### Query voting result:

<pre><code>yarn run ts-node --files ./scripts/Ballot/queryResults.ts [ballotAddress]
</code></pre>