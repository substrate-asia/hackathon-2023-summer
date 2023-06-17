import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";

const web3auth = new Web3AuthNoModal({
  clientId: "YOUR_WEB3AUTH_CLIENT_ID",
  web3AuthNetwork: "cyan",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155, // SOLANA, OTHER
    chainId: "0x1",
  },
});

const openloginAdapter = new OpenloginAdapter({
    adapterSettings: {
      clientId: "YOUR-WEB3AUTH-CLIENT-ID", //Optional - Provide only if you haven't provided it in the Web3Auth Instantiation Code
      uxMode: "redirect",
      loginConfig: {
        jwt: {
          name: "Name of your choice",
          verifier: "YOUR-VERIFIER-NAME-ON-WEB3AUTH-DASHBOARD",
          typeOfLogin: "jwt",
          clientId: "YOUR-WEB3AUTH-CLIENT-ID",
        },
      },
    },
  });
  
  web3auth.configureAdapter(openloginAdapter);

  await web3auth.init();