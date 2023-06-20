import "./App.css";
import {WagmiConfig} from "wagmi";
import {wagmiClient} from "./web3/wagmi/WagmiClient";
import {Demo} from "./view/demo/Demo";

function App() {
  return <WagmiConfig client={wagmiClient}>
    <div className="App">App</div>
    <Demo/>
  </WagmiConfig>
}

export default App;
