'use strict'

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');

const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')

var _FAMILY_NAME = 'bloodregister';
var _NAMESPACE = _hash(_FAMILY_NAME).substring(0,6);

function _hash(data) {
  return crypto.createHash('sha512').update(data).digest('hex');
}

function getbloodAddress(bloodName){
  let nameHash = _hash(_FAMILY_NAME)
  let bloodHash = _hash(bloodName)
  let field ="00"
  return nameHash.slice(0,6) +field+bloodHash.slice(0,62)
}

function getEmployeebloodAddress(bloodName,userPublicKey){
   let nameHash = _hash(_FAMILY_NAME)
   let bloodHash = _hash(bloodName)
   let pubKeyHash = _hash(userPublicKey)
   let field ="01"
   return nameHash.slice(0,6) +field+pubKeyHash.slice(0,32)+bloodHash.slice(0,30)
}

function writeToStore(context, address, data){
  let dataBytes = encoder.encode(data)
  let entries = {
    [address]: dataBytes
  }
  return context.setState(entries);
}

function addblood (context,bloodName,bloodType,acquireStatus) {
  let blood_Address = getbloodAddress(bloodName)
  let blood_detail =[bloodName,bloodType,acquireStatus]

  return context.getState([blood_Address]).then(function(data){
    if(data[blood_Address] == null || data[blood_Address] == "" || data[blood_Address] == []){
      return writeToStore(context,blood_Address,blood_detail);
    }else{
      //console.log("blood name already exists!")
      throw new InvalidTransaction("blood name already exists!");
    }
  })
}


function addEmployeeblood(context,bloodName,userPublicKey){
  let address = getbloodAddress(bloodName)
  return context.getState([address]).then(function(data){
    // console.log("data",data)
    if(data[address] == null || data[address] == "" || data[address] == []){
      throw new InvalidTransaction("Invalid blood name!");
      // console.log("Invalid blood name!")
    }
    else{
      let stateJSON = decoder.decode(data[address])
      let bloodDetails = stateJSON.split(',');
      if(bloodDetails[2] == "false"){
        let newData = [bloodDetails[0],bloodDetails[1],"true"];
        writeToStore(context,address,newData);
        let empAddress = getEmployeebloodAddress(bloodDetails[0],userPublicKey);
        let empblood =[bloodDetails[0],bloodDetails[1]];
        writeToStore(context,empAddress,empblood);
      } 
      else{
        throw new InvalidTransaction("blood is not free!");
        // console.log("blood is not free!")
      }
    }
  }) 
}

//function to display the errors
var _toInternalError = function (err) {
  console.log(" in error message block");
  var message = err.message ? err.message : err;
  throw new InternalError(message);
};


//transaction handler class

class bloodRegisterHandler extends TransactionHandler{
  constructor(){
      super(_FAMILY_NAME, ['1.0'], [_NAMESPACE]);
  }
//apply function
  apply(transactionProcessRequest, context){
    try{
      var header = transactionProcessRequest.header;
      var userPublicKey = header.signerPublicKey;
      let PayloadBytes = decoder.decode(transactionProcessRequest.payload)
      let Payload = PayloadBytes.toString().split(',')
      let action = Payload[0]
      if (action === "add"){
        return addblood(context,Payload[1],Payload[2],Payload[3])
      }
      else if(action === "acquire"){
        return addEmployeeblood(context,Payload[1],userPublicKey);
      }  
    }
    catch(err){
      _toInternalError(err);
    }   
  }
}

module.exports = bloodRegisterHandler;