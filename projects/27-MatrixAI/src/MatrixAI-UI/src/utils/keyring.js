import { Keyring } from "@polkadot/api";

class MyKeyring extends Keyring {
  constructor() {
    super({ type: "sr25519", ss58Format: 42 });
  }
  getPublicKeyFromMnemonic(mnemonic) {
    const pair = this.createFromUri(mnemonic);
    return "0x" + this.toHexString(pair.publicKey);
  }
  getPublicKeyFromAccountId(accountId) {
    const pair = this.addFromAddress(accountId);
    return "0x" + this.toHexString(pair.publicKey);
  }
  toHexString(arr) {
    return Array.from(arr, (i) => i.toString(16).padStart(2, "0")).join("");
  }
}

export default MyKeyring;
