<template>
  <div>
    <div class="row">
      <div class="col">
        <q-card class="q-ma-lg">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Deploy your fleet</div>
            <!-- <div class="text-subtitle2">by John Doe</div> -->
          </q-card-section>

          <q-separator />

          <q-list bordered separator>
            <q-item clickable v-ripple v-for="ship in ships" :key="ship.id">
              <q-item-section>
                <q-item-label>
                  <img
                    :src="'/images/' + ship.id + '.svg'"
                    :width="ship.length * 32"
                  />
                  <div class="float-right">{{ ship.name }}</div>
                </q-item-label>
                <!-- <q-item-label caption class="float-right">{{ ship.name }}</q-item-label> -->
                <q-item-label>
                  <div class="row">
                    <div class="cell" v-for="i of ship.length" :key="i"></div>
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
      <div class="col">
        <q-card class="q-ma-lg">
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Your fleet</div>
            <!-- <div class="text-subtitle2">by John Doe</div> -->
          </q-card-section>

          <q-separator />
          <q-card-section>
            <div class="map" @click="clickOnMapEmpty()">
              <div class="row" v-for="y of 10" :key="'y-' + y">
                <div
                  class="cell hoverable"
                  v-for="x of 10"
                  :key="x + '|' + y"
                  @click="clickOnMap(x, y)"
                >
                  <template v-for="(ship, id) of fleet">
                    <div
                      v-if="
                        x == ship.x &&
                        y == ship.y &&
                        ships.filter((_) => _.id == id)[0]
                      "
                      :key="id"
                    >
                      <img
                        :src="'/images/' + id + '.svg'"
                        :width="ships.filter((_) => _.id == id)[0].length * 32"
                        class="overlay-ship"
                        :class="{ rotate: ship.z == 1 }"
                      />
                    </div>
                  </template>
                </div>
              </div>
              <q-menu touch-position>
                <div class="no-wrap q-pa-md">
                  <div v-if="selX > -1 && selY > -1" class="text-h6">
                    ({{ selX }}, {{ selY }})
                  </div>
                  <!-- <div v-else class="text-h6">Nothing selected</div> -->
                  <div v-else class="text-h6">(?, ?)</div>
                </div>
                <template v-if="selFleetShip">
                  <div class="row no-wrap q-pa-md">
                    <q-toggle v-model="selZ" label="Rotate" />

                    <q-separator vertical inset class="q-mx-lg" />

                    <div class="column items-center">
                      <img
                        height="16"
                        :src="'/images/' + selFleetShip + '.svg'"
                      />

                      <div class="q-mt-md q-mb-xs">
                        {{ ships.filter((_) => _.id == selFleetShip)[0]?.name }}
                      </div>

                      <q-btn
                        color="negative"
                        label="Remove"
                        push
                        size="sm"
                        v-close-popup
                        @click="remove(selFleetShip)"
                      />
                    </div>
                  </div> </template
                ><template
                  v-if="
                    !selFleetShip &&
                    undeployedFleetShips.length > 0 &&
                    selX > -1 &&
                    selY > -1
                  "
                >
                  <div class="q-pa-md">
                    <template v-for="ship in undeployedFleetShips" :key="ship">
                      <q-btn
                        color="secondary"
                        push
                        class="q-mt-sm"
                        :label="ships.filter((_) => _.id == ship)[0]?.name"
                        :icon="'img:/images/' + ship + '.svg'"
                        @click="deploy(ship)"
                      />
                      <br />
                    </template>
                  </div>
                </template>
              </q-menu>
            </div>
          </q-card-section>

          <q-card-section class="bg-green-1 text-white">
            <q-btn
              color="secondary"
              label="Submit"
              class="full-width"
              push
              @click="submit()"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
// import { Todo, Meta } from './models';
import { useMetaMaskWallet } from 'vue-connect-wallet';
import { ethers, JsonRpcSigner } from 'ethers';
import { BrowserProvider, parseUnits } from 'ethers';
import { Game__factory } from 'src/contracts';
import BigNumber from 'bignumber.js';
// import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';
// import { JsonRpcSigner, Web3Provider } from 'ethers';

// interface Props {
//   title: string;
//   todos?: Todo[];
//   meta: Meta;
//   active: boolean;
// }
// const props = withDefaults(defineProps<Props>(), {
//   todos: () => [],
// });

const ships = [
  {
    length: 5,
    name: 'Carrier',
    id: 'carrier',
  },
  {
    length: 4,
    name: 'Battle Ship',
    id: 'battleship',
  },
  {
    length: 3,
    name: 'Cruiser',
    id: 'cruiser',
  },
  {
    length: 3,
    name: 'Submarine',
    id: 'submarine',
  },
  {
    length: 2,
    name: 'Destroyer',
    id: 'destroyer',
  },
];
//console.log(await ships[0].image)

const fleet: Ref<{ [key: string]: { x: number; y: number; z: -1 | 0 | 1 } }> =
  ref({
    carrier: { x: 1, y: 1, z: 0 },
    battleship: { x: 3, y: 3, z: 1 },
    cruiser: { x: 5, y: 2, z: 1 },
    submarine: { x: 8, y: 5, z: 0 },
    destroyer: { x: 6, y: 7, z: 0 },
    // carrier: { x: -1, y: -1, z: -1 },
    // battleship: { x: -1, y: -1, z: -1 },
    // cruiser: { x: -1, y: -1, z: -1 },
    // submarine: { x: -1, y: -1, z: -1 },
    // destroyer: { x: -1, y: -1, z: -1 },
  });

const selX = ref(-1);
const selY = ref(-1);

function clickOnMapEmpty() {
  console.log('clickOnMapEmpty');
  selX.value = -1;
  selY.value = -1;
}
function clickOnMap(x: number, y: number) {
  setTimeout(() => {
    console.log('clickOnMap', x, y);
    selX.value = x;
    selY.value = y;
  }, 100);
}

function deploy(id: string | undefined) {
  if (!id || !fleet.value.hasOwnProperty(id)) return;
  const ship = fleet.value[id];
  ship.x = selX.value;
  ship.y = selY.value;
  ship.z = 0;
}

function remove(id: string | undefined) {
  if (!id || !fleet.value.hasOwnProperty(id)) return;
  const ship = fleet.value[id];
  ship.x = -1;
  ship.y = -1;
  ship.z = -1;
}

const selFleetShip = computed(() => {
  return Object.entries(fleet.value)
    .filter((pair) => pair[1].x == selX.value && pair[1].y == selY.value)
    .filter((pair) => pair[1].x != -1 && pair[1].y != -1)
    .at(0)?.[0];
});
const undeployedFleetShips = computed(() => {
  return Object.entries(fleet.value)
    .filter((pair) => pair[1].x == -1 && pair[1].y == -1)
    .map((_) => _[0]);
});
const selZ = computed({
  get(): boolean {
    const sfs = selFleetShip.value;
    const z = !sfs
      ? undefined
      : !fleet.value.hasOwnProperty(sfs)
      ? undefined
      : fleet.value[sfs]?.z;
    return z == 1;
  },
  set(newValue: boolean) {
    const sfs = selFleetShip.value;
    console.log('set0', sfs, newValue);
    if (!sfs || !fleet.value.hasOwnProperty(sfs)) return;
    console.log('set', sfs, newValue, fleet.value[sfs].z);
    fleet.value[sfs].z = newValue ? 1 : 0;
  },
});

const proofResult = ref('');

async function submit() {
  console.log('submit');
  const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    {
      ships: [
        ['0', '0', '1'],
        ['1', '0', '1'],
        ['2', '0', '1'],
        ['3', '0', '1'],
        ['4', '0', '1'],
      ],
      trapdoor: '123121',
    },

    'circuits/BoardEligibility.wasm',
    'circuits/BoardEligibility_final.zkey'
  );

  proofResult.value = JSON.stringify(proof, null, 1);
  // console.log('proved', proof, publicSignals, proofResult);

  // const vkey = await fetch('circuits/BoardEligibility_vkey.json').then(
  //   function (res) {
  //     return res.json();
  //   }
  // );

  // const res = await window.snarkjs.groth16.verify(vkey, publicSignals, proof);
  // console.log(res);
  // const wallet = useMetaMaskWallet();
  // console.log(wallet);

  let signer: JsonRpcSigner | null = null;

  let provider;
  if (window.ethereum == null) {
    // // If MetaMask is not installed, we use the default provider,
    // // which is backed by a variety of third-party services (such
    // // as INFURA). They do not have private keys installed so are
    // // only have read-only access
    // console.log('MetaMask not installed; using read-only defaults');
    // // provider = ethers.getDefaultProvider();
    // provider = (ethers as any).getDefaultProvider();
    console.log('nothing');
  } else {
    // Connect to the MetaMask EIP-1193 object. This is a standard
    // protocol that allows Ethers access to make all read-only
    // requests through MetaMask.
    provider = new ethers.BrowserProvider(window.ethereum, 1287);
    // const RPC_HOST = 'https://moonbase-alpha.public.blastapi.io/';
    // provider = new ethers.JsonRpcProvider(RPC_HOST);
    // provider = new Web3Provider(window.ethereum);

    // It also provides an opportunity to request access to write
    // operations, which will be performed by the private key
    // that MetaMask manages for the user.
    signer = await provider.getSigner();
    console.log('get signer', provider, signer);

    const g = Game__factory.connect(
      '0x0327BdBc3cE56723B5319D90E106685755f42A8f',
      signer
    );
    // console.log('get game index');
    const gi = await g.gameIndex();
    console.log('index', gi);

    const ep = await window.snarkjs.groth16.exportSolidityCallData(
      proof,
      publicSignals
    );
    const eep = JSON.parse('[' + ep + ']');
    console.log('ep', eep);

    // console.log(
    //   '0x' + new BigNumber(publicSignals[0]).toString(16),
    //   ',',
    //   JSON.stringify(
    //     proof.pi_a
    //       .slice(0, 2)
    //       .map((_: any) => '0x' + new BigNumber(_).toString(16))
    //   ).replaceAll('"', ''),
    //   ',',
    //   JSON.stringify(
    //     proof.pi_b
    //       .slice(0, 2)
    //       .map((bb: any) =>
    //         bb.map((_: any) => '0x' + new BigNumber(_).toString(16))
    //       )
    //   ).replaceAll('"', ''),
    //   ',',
    //   JSON.stringify(
    //     proof.pi_c
    //       .slice(0, 2)
    //       .map((_: any) => '0x' + new BigNumber(_).toString(16))
    //   ).replaceAll('"', '')
    // );
    // console.log(
    //   publicSignals[0],
    //   ',',
    //   JSON.stringify(proof.pi_a.slice(0, 2)),
    //   ',',
    //   JSON.stringify(proof.pi_b.slice(0, 2)),
    //   ',',
    //   JSON.stringify(proof.pi_c.slice(0, 2))
    // );
    console.log('get game');
    const t = await g.startGame(eep[3][0], eep[0], eep[1], eep[2]);
    console.log('start game');
    await t.wait();
    console.log('waiting');
  }

  //   // The contract ABI (fragments we care about)
  // const abi = [
  //   "function decimals() view returns (uint8)",
  //   "function symbol() view returns (string)",
  //   "function balanceOf(address a) view returns (uint)"
  // ]

  // // Create a contract; connected to a Provider, so it may
  // // only access read-only methods (like view and pure)
  // contract = new Contract("dai.tokens.ethers.eth", abi, provider)

  // // The symbol name for the token
  // sym = await contract.symbol()
  // // 'DAI'

  // // The number of decimals the token uses
  // decimals = await contract.decimals()
  // // 18n

  // // Read the token balance for an account
  // balance = await contract.balanceOf("ethers.eth")
  // // 201469770000000000000000n

  // // Format the balance for humans, such as in a UI
  // formatUnits(balance, decimals)
}
</script>

<style lang="scss" scoped>
.cell {
  width: 28px;
  height: 28px;
  margin: 2px;
  background-color: wheat;
  border: 2px solid #777;
  position: relative;

  &.hoverable:hover {
    background-color: orange;
  }

  .overlay-ship {
    position: relative;
    left: -4px;
    z-index: 100;
    height: 28px;
    object-fit: cover;
    top: -4px;
    &.rotate {
      transform: rotate(90deg);
      transform-origin: 0% 100%;
      top: -34px;
    }
  }
}
</style>
