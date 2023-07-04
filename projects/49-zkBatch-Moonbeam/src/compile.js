// 1. Import packages
const fs = require('fs');
const solc = require('solc');

// 2. Get path and load contract
const source = fs.readFileSync('verifier.sol', 'utf8');

// 3. Create input object
const input = {
   language: 'Solidity',
   sources: {
      'verifier.sol': {
         content: source,
      },
   },
   settings: {
      outputSelection: {
         '*': {
            '*': ['*'],
         },
      },
   },
};
// 4. Compile the contract
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
const contractFile = tempFile.contracts['verifier.sol']['Verifier'];

// 5. Export contract data
module.exports = contractFile;
