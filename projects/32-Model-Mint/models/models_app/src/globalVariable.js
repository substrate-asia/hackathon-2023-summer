// globalVariable.js
let _currentUserWalletAddress = "bc1p47p87wz85uqjphjf6elcrg8yhg0je3kratjhm79uyfnqa399a3usknp50z";

export function setCurrentUserWalletAddress(address) {
  _currentUserWalletAddress = address;
}

export function getCurrentUserWalletAddress() {
  return _currentUserWalletAddress;
}


let _currentUserOpenAIKey = null;

export function setCurrentUserOpenAIKey(key) {
  _currentUserOpenAIKey = key;
}

export function getCurrentUserOpenAIKey() {
  return _currentUserOpenAIKey;
}

const hostAddress = "localhost";

export {hostAddress};

