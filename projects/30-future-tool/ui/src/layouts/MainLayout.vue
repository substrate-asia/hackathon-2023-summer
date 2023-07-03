<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Future Tool - Battleship
        </q-toolbar-title>

    <ConnectWalletButton
      :address="address"
      :txnCount="0"
      :dark="false"
      @click="connect"
    >
      <!-- Override the default text on the "Connect Wallet" button -->
      Connect Wallet!

      <template #pending>
        <!-- Override the blue pending transaction div -->
      </template>

      <template #spinner>
        <!-- Use your own Spinner (svg, css, image, etc.) -->
      </template>

      <template #identicon>
        <!-- Use your own identicon library. Jazzicon is the default -->
      </template>

      <template #connectWalletButton>
        <!-- Use your own button for the "Connect Wallet" state when no address is provided -->
      </template>

      <template #addressButton>
        <!-- Use your own button to display the address when address is provided. Does not remove the pending transaction div -->
      </template>
    </ConnectWalletButton>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ConnectWalletButton, useMetaMaskWallet } from 'vue-connect-wallet';


const wallet = useMetaMaskWallet();
console.log(wallet);

const address = ref('');

wallet.onAccountsChanged((accounts: string[]) => {
  console.log('account changed to: ', accounts[0]);
});
wallet.onChainChanged((chainId: number) => {
  console.log('chain changed to:', chainId);
});

const connect = async () => {
  console.log('connect');
  const accounts = await wallet.connect();
  if (typeof accounts === 'string') {
    console.log('An error occurred' + accounts);
  }
  address.value = accounts[0];
};

const switchAccount = async () => {
  await wallet.switchAccounts();
  connect();
};

const isConnected = async () => {
  const accounts = await wallet.getAccounts();
  if (typeof accounts === 'string') return false;
  return accounts.length > 0;
};

isConnected().then((value) => {
  if (value) connect();
});
</script>
