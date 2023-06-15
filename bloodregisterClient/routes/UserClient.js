const {createHash} = require('crypto')
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')
var encoder =new TextEncoder('utf8');

var FAMILY_NAME = 'bloodregister';


function hash(v) {
  return createHash('sha512').update(v).digest('hex');
}

function createTransaction(familyName,inputList,outputList,signer,payload,familyVersion = '1.0'){
  const payloadBytes = encoder.encode(payload)
    //create transaction header
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
      familyName: familyName,
      familyVersion: familyVersion,
      inputs: inputList,
      outputs: outputList,
      signerPublicKey: signer.getPublicKey().asHex(),
      nonce: "" + Math.random(),
      batcherPublicKey: signer.getPublicKey().asHex(),
      dependencies: [],
      payloadSha512: hash(payloadBytes),
    }).finish();
    // create transaction
    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signer.sign(transactionHeaderBytes),
      payload: payloadBytes
    });
    const transactions = [transaction];
    //create batch header
    const  batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();
    const batchSignature = signer.sign(batchHeaderBytes);
    //create batch 
    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: batchSignature,
      transactions: transactions,
    });
    //create batchlist
    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish();
    sendTransaction(batchListBytes);	
  }
  
  /*
  function to submit the batchListBytes to validator
  */
  async function sendTransaction(batchListBytes){
    let resp =await fetch('http://rest-api:8008/batches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream'},
      body: batchListBytes
    })
    console.log("response", resp);
  }


class UserClient{
  constructor(Key){
    const context = createContext('secp256k1');
    const secp256k1pk = Secp256k1PrivateKey.fromHex(Key.trim());
    this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
    this.publicKey = this.signer.getPublicKey().asHex();
    this.address = hash(FAMILY_NAME).slice(0, 6) ;
  }
 
  async addblood(action,blood,bloodType,acquirestatus){
    try{
      var address = this.address;
      var signer = this.signer;
    
      var inputAddressList = [address];
      var outputAddressList = [address];
      let payload = [action,blood,bloodType,acquirestatus].join(',')
      createTransaction(FAMILY_NAME,inputAddressList,outputAddressList,signer,payload);
    }
    catch(error) {
      console.error(error);
    } 	
  
  }

  async acquireblood(action,blood){
    try{
      var address = this.address;
      var signer = this.signer;
      var inputAddressList = [address];
      var outputAddressList = [address];
      let payload = [action,blood].join(',')
      createTransaction(FAMILY_NAME,inputAddressList,outputAddressList,signer,payload);

    }
    catch(error) {
      console.error(error);
    } 
  }


  /**
   * Get state from the REST API
   * @param {*} address The state address to get
   * @param {*} isQuery Is this an address space query or full address
   */
  async getState (address, isQuery) {
    let stateRequest = 'http://rest-api:8008/state';
    if(address) {
      if(isQuery) {
        stateRequest += ('?address=')
      } else {
        stateRequest += ('/address/');
      }
      stateRequest += address;
    }
    let stateResponse = await fetch(stateRequest);
    let stateJSON = await stateResponse.json();
    return stateJSON;
  }

  async getbloodListings() {
    let bloodAddress = hash(FAMILY_NAME).slice(0, 6) + "00";
    return this.getState(bloodAddress, true);
  }

  async getEmpbloodListings() {
    let keyHash  = hash(this.publicKey);
    let bloodAddress = hash(FAMILY_NAME).slice(0, 6) + "01" + keyHash.slice(0,32);
    return this.getState(bloodAddress, true);
  }

}

module.exports.UserClient = UserClient;