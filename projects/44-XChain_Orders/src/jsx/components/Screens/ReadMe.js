import React,{useContext} from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import PerfectScrollbar from "react-perfect-scrollbar";
import glmr100 from "../../../images/glmr100.png";
import ftm100 from "../../../images/ftm100.png";
import axl100 from "../../../images/axl100.png";
import bsc100 from "../../../images/bsc100.png";
import xchainlogopsw from "../../../images/xchainlogopsw.png";
import screenshot1 from "../../../images/screenshot1.png";

const ReadMe = () => {

	const { changeBackground, background } = useContext(ThemeContext);
	
	return(
		<>
			<div className="row">
				<div className="col-xl-12">
					<div className="row">
						<div className="col-xl-12 col-xxl-6 col-lg-6">
							<div className="card">
								<div className="card-body">
									<PerfectScrollbar
										style={{ height: "auto" }}
										id="DZ_W_TimeLine"
										className="widget-timeline dz-scroll height370 ps ps--active-y"

									>
										<ul className="timeline">
											<li>
												<div className="timeline-badge primary"></div>
												<p className="m-4 mt-4 text-white" style={{ fontSize:"40px"}}>
																		
												Polkadot Hackathon 2023 Summer<br></br>
												Category 2 - Smart Contract (And Related) <br></br>

												<br></br>
												<img src={xchainlogopsw} width="800" alt=""></img><br></br><br></br>

												</p>
												
												<p className="m-4 mt-4 text-dark" style={{ fontSize:"24px"}}>

												To showcase the project, the following chains and protocols were included:<br></br>

												<img src={glmr100} width="50" alt=""></img>
												<img src={ftm100} width="50" alt=""></img>
												<img src={axl100} width="50" alt=""></img>
												<img src={bsc100} width="50" alt=""></img>

										
												</p>

												<br></br>

												<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
												Links<br></br>

												<a href="https://youtu.be/iscvX_lmEtM"target="_blank" rel="noreferrer">Demo Video</a> <br></br>
												<a href="https:// TO BE ADDED"target="_blank" rel="noreferrer">Demo Website</a> <br></br>
												
												</p>
												<br></br>
												
												<p className="mx-4 mt-4 text-dark" style={{ fontSize:"24px"}}>
												<h2 className="">General Info</h2>
															
												When it comes to investments, managing risk is of paramount importance.<br></br>

												An approach of invest and forget has a very high risk of ruin for the individual investor and unfortunately this area is often overlooked during the process of forming a trading or investment plan.<br></br>

												The traditional finance industry uses a large variety risk management tools but even the most basic versions of these tools are still missing in DeFi applications.<br></br>

												These include order types such as:<br></br>

												- Limit Market Order<br></br>
												- Stop Market Order<br></br>
												- Bracket Order<br></br>
												- Dollar Cost Averaging (DCA)<br></br>

												<br></br>

												<h3 className="">Limit Market Order</h3>

												A Limit Market order to swap from tokenIn (eg. USDC) for another tokenOut (eg. DOT, WGLMR, ASTR) is an order that only executes the swap when the price of the tokenOut / USDC is lower than the Limit price that the user submitted.<br></br>

												<br></br>

												<h3 className="">Stop Market Order</h3>

												A Stop Market order to swap a tokenIn (eg. DOT, WGLMR, ASTR) for tokenOut (eg. USDC) is an order that executes when the price of tokenIn / USDC is below the Stop price that the user submitted.<br></br>

												<br></br>

												<h3 className="">Bracket</h3>

												A Bracket order is a combination of a special Limit Market and a Stop Market order. In one case the user may have exposure to an existing trade ad want to swap a tokenIn (e.g. DOT, WGLMR, ASTR) for tokenOut (eg. USDC) either when the tokenIn / USDC price is above the Limit price submitted (usually used to realise a profit) or when the tokenIn / USDC price falls below the submitted Stop Price (usually used to realise a loss). It is also possible for a user to use a Bracket Order to enter a trade to take advantage of increased volatility.<br></br>

												<br></br>

												<h3 className="">Dollar Cost Averaging (DCA)</h3>

												A Dollar Cost Average swap of tokenIn (eg. USDC) for tokenOut (eg. DOT, WGLMR, ASTR) with number of splits 3 (fully customizable) and block interval 10 (fully customizable), allows a user to split the USDC amount he wants to swap for the tokenOut (eg. DOT, WGLMR, ASTR) into 3 equal size orders and execute the swap at a predetermined fixed number of block intervals, minimizing slippage and achieving a more average price.<br></br>

												<br></br>

												With the above order types, the user can pre-plan when to maximize profits when to minimize losses.<br></br>

												In addition all the above do not require the user to always be in front of the screen. The order types in the project allow the trading opportunities and risk management to be fully automated.<br></br>
												</p>
												<br></br>

												<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
												<h2 className="">Interconnected Contracts</h2>

												Via the Interconnected Contracts technology, Moonbeam allows the Polkadot ecoysystem (using XCM technology) and native Moonbeam Projects to connect to a multitude of other ecosystems.<br></br>

												This opens up the possibilities for app design and UX to mutliple ecosystems, in turn utlizing the powerful dynamics of each chain.<br></br>

												For example in our case, before this technology, if a BSC or Fantom user wanted to have exposure to the main Polkadot Currencies (eg. DOT, WGLMR, ASTR) they either had to use a bridge to transfer funds across or invest in a version of these tokens natively brought to their chain but being non-native to their ecosystem, resulting in tokens suffering from limited availability and high DEX slippage.<br></br>

												Naturally, a BSC or Fantom user may want exposure to these currencies without having to change chains or transfer funds to those chains in those ways.<br></br>

												In our project a BSC / Fantom user interacts with a BSC / Fantom deployed smart contract (AxelarBinanceSatelite / AxelarFantomSatelite) to submit and delete orders.<br></br>

												They provide the necessary ERC20 approvals to this smart contract and their instructions are carried from BSC / Fantom to Moonbeam via Axelar resulting in the submission or deletiion of their orders.<br></br>

												It is important to note that at the stage of submitting an order the smart contract reads the user's balance, increasing their allowance to the smart contract for the token they want to swap in but no actual funds are being transferred.<br></br>
												<br></br>
												Note: Incase of deleting an existing order the user's allowance to the smart contract is reduced for the tokenIn reference accordingly. This active management of scaling up and down the users allowance for a tokenIn they were to swap for other tokens ensure responsible order and asset approval management.<br></br>

												When an order submitted by the BSC / Fantom user to the Moonbeam based Orderbook, it is pushed to the Moonbeam based execution engine (ExecutionEngineFromBinance / ExecutionEngineFromFantom smart contract) and instructions are sent from the Moonbeam based execution engine to the AxelarBinanceSatelite / AxelarFantomSatelite smart contract that the user apporoved for the relevant token originally.<br></br>

												Once the message is received in AxelarBinanceSatelite / AxelarFantomSatelite smart contract then it will attempt to transfer the relevant token (axlUSDC) from the user (as originally approved), transfer it via Axelar to the Moonbeam based Execution Engine so it can then be swapped for the desired tokenOut (eg. DOT, WGLMR, ASTR)<br></br>
												<br></br>
												Note: If the BSC / Fantom based users balance is not enough because in the meantime the user has used the funds elsewhere, forgetting to cancel his working order, then the AxelarBinanceSatelite / AxelarFantomSatelite smart contract instructs the Moonbeam based execution smart contract that the order size of the order ready for execution is zero which results in instant order cancelation.<br></br>
												<br></br>
												Once the BSC / Fantom user sees his Limit or DCA order being excuted successfully in swapping axlUSDC to DOT, WGLMT, ASTR the respective DOT, WGLMT, ASTR balances are kept in the Moonbeam based execution engine and this is the balance shown on the screen for a BSC / Fantom based user<br></br>

												In this way the BSC / Fantom user transfers axlUSDC only when their orders are ready for execution, benefitting from the Moonbeam/Polkadot maximum liquidity for the native tokens DOT, WGLMR, ASTR. Their tokens are stored in the Moonbeam based Execution Engine, ready to be swapped back to axlUSDC and transferred via Axelar to their BSC / Fantom based EVM account when they use Stop or Bracket Orders.<br></br>
												<br></br>
												Note: Of course the user could switch chains from BSC / Fantom to Moonbeam and ask to withdraw his tokens DOT, WGLMR, ASTR to his EVM account on Moonbeam. But we followed the approach that by definition a BSC / Fantom user is not obliged to switch chain to get exposure to his tokens but execute all functionality natively from their BSC / Fantom EVM account.<br></br>

												<br></br>
												</p>

												<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
												<h2 className="">Chains Used</h2>
												<img src={glmr100} width="50" alt=""></img><br></br>

												Moonbeam is a parachain that offers a fully compatible EVM environment with a long list of precompiles that offer added functionality. Moonbeam is offering a vetical hub from Polkadot to other ecosystems such as Fantom Opera, Binance, via General Message passing interconnected contracts<br></br>

												<br></br>

												<img src={ftm100} width="50" alt=""></img><br></br>

												Fantom is a high-performance, scalable, customizable, and secure smart-contract platform.<br></br>
												The platform is designed as a next generation of blockchain platform to address several limitations of existing blockchain platforms.<br></br>

												<br></br>

												<img src={axl100} width="50" alt=""></img><br></br>

												Axelar delivers cross-chain communication for Web3 allowing Interchain dApps to be developed. It is possible to call a function in another ecosystem, wait for a callback and even transfer tokens with such instructions.<br></br>

												<br></br>

												<img src={bsc100} width="50" alt=""></img><br></br>

												Binance Smart Chain (BSC) supports the most popular programming languages, flexible tools, and comes with clear and canonical documentation. You can quickly start and deploy your application on a blockchain designed with real use in mind.<br></br>

												<br></br>

												</p>

												<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
												<h2 className="">Walkthrough</h2>
												The user chooses their preferred network, Moonbeam, Fantom or BSC.<br></br>

												The prices of DOT/USDC WGLMR/USD and ASTR/USDC are loaded at the top of the screen and constantly updated from StellaSwap.<br></br>

												The user sees their account balance in USDC, axlUSDC, DOT, WGLMR, and ASTR.<br></br>

												The user chooses the type of order they want from Limit Market, Stop Market, Bracket and DCA.<br></br>

												For the users convenience, the DApp automatically prefills the prices and quantities based on current StellaSwap prices and account balances. The user can choose to alter both prices and order sizes.<br></br>

												User clicks submit.<br></br>

												Their order appears in the relevant tables Limit, Stop, Bracket or DCA Orders.<br></br>
												The user can only see their own orders.<br></br>

												In addition to faciliate the judging we are also exposing the whole orderbook (Limit, Stop, Bracket, DCA) from all accounts along with the Execution engine (for Moonbeam) that shows visually the smart contract activity in transporting an order from the submission to the execution to user's wallet balance update.<br></br>

												<br></br>

												<img src={screenshot1} width="1500" alt=""></img><br></br>

												<br></br>

												</p>

												<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
												<h2 className="">Repos</h2>
												Polkadot Summer Server<br></br>

												https://github.com/Entity54/PolkadotSummer-Server <br></br>

												<br></br>

												Front End Repo<br></br>

												https://github.com/parity-asia/hackathon-2023-summer/tree/main/projects/44-XChain_Orders <br></br>

												<br></br>

												Hard Hat<br></br>

												https://github.com/Entity54/PolkadotSummer-HardHat <br></br>

												<br></br>
												</p>

												<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
												<h2 className="">Installation</h2>
												For the front end, the user can:<br></br><br></br>

												$yarn<br></br>
												$npm start<br></br><br></br>

												(You will have to create your own .env file - further instructions at setup.js)<br></br>
												and can see the front end application at http://localhost:3000/<br></br>
												<br></br>
												</p>

												<p className="mx-4 mt-2 text-dark" style={{ fontSize:"24px"}}>
												<h2 className="">Appendix</h2>
												Key Smart contracts & Explanations - all placed in HardHat Repo<br></br>
												<br></br>
												<h2 className="">Moonbeam</h2><br></br>

												<h3 className="">OrdersManager.sol</h3>
												Responsible to add fresh orders or delete existing working orders.<br></br>

												Server calls regularly function to update StellaSwap prices and if necessary push orders from working order books to the relevant Execution Engine (ExecutionOrdersEngineMoonbeam.sol) if user is moonbeam based or (ExecutionOrdersEngineFromFantom.sol) if user is Fantom based or (ExecutionOrdersEngineFromBinance.sol) if user is BSC based.<br></br>
												<br></br>

												<h3 className="">UsersRegistry.sol</h3>
												When a user submits a fresh order, this smart contract is called first and in case the user is not already registered it registers their EVM account along with the chain (MOONBEAM or FANTOM or BSC) that the user is based on. This important user registration of the<br></br>
												chain is vital in determining to which execution engine to push a previous working order that now is ready for execution.<br></br>
												<br></br>

												<h3 className="">ExecutionOrdersEngineMoonbeam.sol</h3>
												Performs relevant Swaps via StellaSwap and returns the output token to user’s Moonbeam based wallet.<br></br>
												<br></br>

												<h3 className="">ExecutionOrdersEngineFromFantom.sol</h3>
												Keeps hold of Limit and DCA orders that require USDC to be deposited to swap for anyX token (DOT, WGLMR, ASTR).<br></br>

												Uses Axelar and communicates with AxelarFantomSatelite to retrieve the equivalent amount of axlUSDC to be transferred from Fantom to Moonbeam to finance order execution.<br></br>

												Preserves a running balance of DOT, WGLMR and ASTR for the Fantom based user, ready to be swapped back to stable coins and transferred to their wallet when desired.<br></br>

												Keeps holds of Stop and Bracket orders when triggered but the server performs the relevant StellaSwap transactions swapping the relevant X token (DOT, WGLMR, ASTR) to USDC which is then swapped for axlUSDC and send via Axelar to the users Fantom based wallet.<br></br>
												<br></br>
												
												<h3 className="">ExecutionOrdersEngineFromBinance.sol</h3>
												Keeps hold of Limit and DCA orders that require USDC to be deposited to swap for anyX token (DOT, WGLMR, ASTR).<br></br>

												Uses Axelar and communicates with AxelarBinanceSatelite to retrieve the equivalent amount of axlUSDC to be transferred from Fantom to Moonbeam to finance order execution.<br></br>

												Preserves a running balance of DOT, WGLMR and ASTR for the Fantom based user, ready to be swapped back to stable coins and transferred to their wallet when desired.<br></br>

												Keeps holds of Stop and Bracket orders when triggered but the server performs the relevant StellaSwap transactions swapping the relevant X token (DOT, WGLMR, ASTR) to USDC which is then swapped for axlUSDC and send via Axelar to the users Fantom based wallet.<br></br>
												<br></br>

												<h3 className="">AxelarMoonbeamSatelite.sol</h3>
												Accepts GMP messages from AxelarBinanceSatelite.sol / AxelarFantomSatelite.sol for submitting or deleting an order from main OrdersManager.sol. It also performs the BSC / Fantom user registration at UsersRegistry.sol<br></br>
												<br></br>

												<h3 className="">StellaSwap.sol</h3>
												Performs all stable, single and multi hop swap and provides X/USDC prices.<br></br>
												<br></br>

												<h2 className="">Fantom Opera</h2>
												<br></br>
												<h3 className="">AxelarFantomSatelite.sol</h3>
												This is the only smart contract that a Fantom based user ever interacts with. They can submit or delete an order. In addition in each case the user increases or decreases axlUSDC allowance so that order execution requires no further interaction and order deletion frees up previous approvals.<br></br>
												<br></br>

												<h2 className="">Binance Smart Chain (BSC)</h2>
												<br></br>
												<h3 className="">AxelarBinanceSatelite.sol</h3>
												This is the only smart contract that a BSC based user ever interacts with. They can submit or delete an order. In addition in each case the user increases or decreases axlUSDC allowance so that order execution requires no further interaction and order deletion frees up previous approvals.<br></br>
												<br></br>

												<h2 className="">Addresses of deployed contracts</h2>

												<br></br>

												<h2 className="">Moonbeam</h2>

												<h3 className="">ordersManager_Moonbeam_address = "0xfbeE1a3683e4335fe343e6847f04DFbf18278d11"; <br></br>
													usersRegistry_Moonbeam_address = "0x51012d2c409Ece85f2506b4a3F13f33FA9325ac1"; <br></br>
													executionOrdersEngine_Moonbeam_address = "0x6E3bD83C6902Ec9f31bc2802342aB93336f685B8"; <br></br>
													executionOrdersEngineFromFantom_address = "0x7cF1787e3Af0da55c175dd56E3820e6dDA859AfB"; <br></br>
													executionOrdersEngineFromBinance_address = "0x5003915C75De9a35A66c758205477b62F447a64f"; <br></br>
													axelarMoonbeamSatelite_address = "0x10142644765AAdfC1663c286e92ddd208ac5fe4b"; <br></br></h3>
												<br></br>

												<h2 className="">Fantom Opera</h2>

												<h3 className="">SEE uj_AxelarFantomSatelite.js <br></br>
												axelarFantomSatelite_address = "0x77a410dd5A158FEc2eb8AA70693240B68a3A23ec";</h3>
												<br></br>

												<h2 className="">Binance Smart Chain (BSC)</h2>

												<h3 className="">SEE uj_AxelarBinanceSatelite.js <br></br>
												axelarBinanceSatelite_address = "0x65b5d92202De37560c33B5e563bF5F9c5412E0b1";</h3>
												<br></br>
												</p>
											</li>
										</ul>
									</PerfectScrollbar>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>	
		</>
	)
}
export default ReadMe;