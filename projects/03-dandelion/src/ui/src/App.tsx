import "./App.css";
import {WagmiConfig} from "wagmi";
import {wagmiClient} from "./web3/wagmi/WagmiClient";
import {ConnectorDemo} from "./view/demo/ConnectorDemo";

function App() {
  return <WagmiConfig client={wagmiClient}>
    <div className="App">App</div>
    <ConnectorDemo/>
  </WagmiConfig>
}

export default App;
