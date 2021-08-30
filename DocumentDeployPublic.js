const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

const CONTRACT_NAME = 'Document';
const DOCUMENT_TITLE = 'Titulo';
const DOCUMENT_URL = 'url';
const ACCOUNT_ADDRESS = 'zz4AF92bF32A3824641c813013e108e5C1aAD90Czz';
const PRIVATE_KEY = 'zz1059fbefe95a7e28ceb4955dd3afbe2bf0455bc7473c73649d90ceaf336azz';
const WEB3_PROVIDER_URL = 'https://ropsten.infura.io/v3/zzf94f23797c47ecb5fb633740ae8ezz';
const web3 = new Web3(WEB3_PROVIDER_URL);

//console.log('CONTRACT_NAME>>>>>>');
//console.log(CONTRACT_NAME);
//console.log('___');

(async function() {
  //const rawCodeFs = fs.readFileSync(`${__dirname}/${CONTRACT_NAME}.sol`);
   const rawCodeFs = fs.readFileSync('Document.sol');
   //console.log(rawCodeFs);
   const rawcode = rawCodeFs.toString();
   //console.log(rawcode);
   //console.log ([`${CONTRACT_NAME}`]);
   //console.log (`${CONTRACT_NAME}`);
   

   const input = {
     language: 'Solidity',
     sources: { [`${CONTRACT_NAME}`]: { content: rawcode } },
     settings: { outputSelection: { '*': { '*': ['*'] } } }
   };

   //console.log(input);
   //console.log('-4-');
   const contractBytecode = JSON.parse(solc.compile(JSON.stringify(input))).contracts[`${CONTRACT_NAME}`][`${CONTRACT_NAME}`].evm.bytecode.object;
   //console.log('-5-');
   const encodedParameters = web3.eth.abi.encodeParameters(
     [ 'string', 'string'],
     [DOCUMENT_TITLE, DOCUMENT_URL]
   ).slice(2);
   const bytecodeWithEncodedParameters = contractBytecode + encodedParameters;

   const nonce = await web3.eth.getTransactionCount(ACCOUNT_ADDRESS);
   //const gasPrice = await web3.eth.getGasPrice();
   //const gasLimit = await web3.eth.estimateGas({ bytecodeWithEncodedParameters });
   const privateKey = Buffer.from(PRIVATE_KEY, 'hex');

   const txObject = {
     nonce: web3.utils.toHex(nonce),
     gasLimit: web3.utils.toHex(1000000),
     gasPrice: web3.utils.toHex( web3.utils.toWei('2', 'gwei')),
     data: `0x${bytecodeWithEncodedParameters}`,
     chainId: 3
   };

   //const tx = new Tx(txObject);
   const tx = new Tx(txObject, {'chain':'ropsten'});
   tx.sign(privateKey);

   const serializedTx = tx.serialize();
   const raw = '0x' + serializedTx.toString('hex');

   const txReceipt = await web3.eth.sendSignedTransaction(raw);
   console.log('Contract Address:', txReceipt.contractAddress);
   console.log('Transaction Hash:', txReceipt.transactionHash); 
})();