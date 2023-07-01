import React,{Fragment,useContext, useState, useEffect} from 'react';
import { Dropdown, Tabs, Tab } from "react-bootstrap";
import { ThemeContext } from "../../../context/ThemeContext";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/Om.css";
import xchainlogo from "../../../images/xchainlogo.png";

import {
	Table,
  } from "react-bootstrap";
  
import { 
	submitOrder_Moonbeam,
	deleteOrder_Moonbeam,
	get_OrderBooks,
	get_ExecutionsPendingOrderBook_Moonbeam,
	get_StellaSwap_Prices,
	get_Moonbeam_Balances,
	getUserChain,
} from "../../../Setup";
  


const OrderManager = ({ api,  blockHeader }) => {
	const { background } = useContext(ThemeContext);
	const [engineMessage, setEngineMessage] = useState("Welcome to XChain Orders");
	const [price_DOT_USDC, setPrice_DOT_USDC] = useState("");
	const [price_WGLMR_USDC, setPrice_WGLMR_USDC] = useState("");
	const [price_ASTR_USDC, setPrice_ASTR_USDC] = useState("");
	const [balance_DOT, setBalance_DOT]     = useState("");
	const [balance_WGLMR, setBalance_WGLMR] = useState("");
	const [balance_ASTR, setBalance_ASTR]   = useState("");
	const [balance_USDC, setBalance_USDC]   = useState("");
	const [balance_axlUSDC, setBalance_axlUSDC]   = useState("");
	// const [balance_WDEV, setBalance_WDEV]   = useState("");
	
	const [tokenIn_Symbol, setTokenIn_Symbol]   = useState("Token In");
	const [tokenOut_Symbol, setTokenOut_Symbol]   = useState("Token Out");
	const [limitPrice, setLimitPrice]   = useState("");
	const [stopPrice, setStopPrice]   = useState("");
	const [orderSize, setOrderSize]   = useState("");
	const [dcaNumber, setDcaNumber]   = useState("");
	const [dcaBlockInterval, setDcaBlockInterval]   = useState("");

	const [chosenOrderTypeNum, setChosenOrderTypeNum] = useState(0);

	const [account_limitOrdersArray, setAccount_limitOrdersArray] = useState([]);
	const [account_stopOrdersArray, setAccount_stopOrdersArray] = useState([]);
	const [account_bracketOrdersArray, setAccount_bracketOrdersArray] = useState([]);
	const [account_dcaOrdersArray, setAccount_dcaOrdersArray] = useState([]);
	
	const [all_limitOrdersArray, setAll_limitOrdersArray] = useState([]);
	const [all_stopOrdersArray, setAll_stopOrdersArray] = useState([]);
	const [all_bracketOrdersArray, setAll_bracketOrdersArray] = useState([]);
	const [all_dcaOrdersArray, setAll_dcaOrdersArray] = useState([]);

	const [executionsEngineBook_Moonbeam, setExecutionsEngineBook_Moonbeam] = useState([]);

	const [activeTab, setActiveTab]   = useState("");

    
	const handleSelect = (selectedTab) => {
		setActiveTab(selectedTab);
	}

	const fetchData = async () => {
		const orderBooks = await get_OrderBooks();
		const executionsEngineOrderBook_Moonbeam = await get_ExecutionsPendingOrderBook_Moonbeam();

		setAccount_limitOrdersArray(orderBooks.account_limitOrdersArray);
		setAccount_stopOrdersArray(orderBooks.account_stopOrdersArray);
		setAccount_bracketOrdersArray(orderBooks.account_bracketOrdersArray);
		setAccount_dcaOrdersArray(orderBooks.account_dcaOrdersArray);

		setAll_limitOrdersArray(orderBooks.all_limitOrdersArray);
		setAll_stopOrdersArray(orderBooks.all_stopOrdersArray);
		setAll_bracketOrdersArray(orderBooks.all_bracketOrdersArray);
		setAll_dcaOrdersArray(orderBooks.all_dcaOrdersArray);
		setExecutionsEngineBook_Moonbeam(executionsEngineOrderBook_Moonbeam.all_QueuedForExecutionOrder_Moonbeam);
		await get_Prices();
		await get_Balances_Moonbeam();

	}

	const delete_Order = async (nonce, size, tokenIn) => {
		console.log(`ASKED TO  DELETE ORDER WITH NONCE ${nonce} size: ${size} tokenIn: ${tokenIn} `)

		const message = await deleteOrder_Moonbeam(nonce,size,tokenIn);
		console.log(`ASKED TO  DELETE ORDER WITH NONCE ${nonce} message: `,message)
	}

	const resetFields = () => {
		setLimitPrice("");
		setStopPrice("");
		setOrderSize("");
		setDcaNumber("");
		setDcaBlockInterval("");
	}

	const submitOrder = async () => {

		if (chosenOrderTypeNum>=1 && chosenOrderTypeNum<=4)
		{
			const userChain = getUserChain();

			let _tokenIn_Symbol = tokenIn_Symbol;
			let _tokenOut_Symbol = tokenOut_Symbol;
			if (tokenIn_Symbol==="USDC") _tokenIn_Symbol="USDC_M";
			if (tokenOut_Symbol==="USDC") _tokenOut_Symbol="USDC_M";

			console.log(`|||>>> submitting Order in userChain: ${userChain} with _tokenIn_Symbol: ${_tokenIn_Symbol} _tokenOut_Symbol: ${_tokenOut_Symbol} limitPrice: ${limitPrice} stopPrice: ${stopPrice} orderSize: ${orderSize} dcaNumber: ${dcaNumber} chosenOrderTypeNum: ${chosenOrderTypeNum} dcaBlockInterval: ${dcaBlockInterval}`);
			await submitOrder_Moonbeam(_tokenIn_Symbol,_tokenOut_Symbol,limitPrice,stopPrice,orderSize,dcaNumber,`${chosenOrderTypeNum}`,dcaBlockInterval);
		}
		else console.log(`|||>>> Order IS NOT SUBMITTED because chosenOrderTypeNum: ${chosenOrderTypeNum}`);

		resetFields();
		setTokenIn_Symbol("Token In");
		setTokenOut_Symbol("Token Out");
		setChosenOrderTypeNum(0);
	}

	const get_Balances_Moonbeam = async () => {
		const balances_Moonbeam = await get_Moonbeam_Balances();
		setBalance_DOT(balances_Moonbeam.account_DOT_Balance);
		setBalance_WGLMR(balances_Moonbeam.account_WGLMR_Balance);
		setBalance_ASTR(balances_Moonbeam.account_ASTR_Balance);
		setBalance_USDC(balances_Moonbeam.account_USDC_Balance);
		setBalance_axlUSDC(balances_Moonbeam.account_axlSUSDC_Balance);
		// setBalance_WDEV(balances_Moonbeam.account_WDEV_Balance);
	}

	const get_Prices = async () => {
		const prices_StellaSwap = await get_StellaSwap_Prices();
		setPrice_DOT_USDC(prices_StellaSwap.price_DOT_USDC);
		setPrice_WGLMR_USDC(prices_StellaSwap.price_WGLMR_USDC);
		setPrice_ASTR_USDC(prices_StellaSwap.price_ASTR_USDC);
	}

	useEffect(() => {
		const getSnapShot = async () => {
			if (blockHeader && blockHeader.number && ((Number(blockHeader.number)%2) ===0) )
			{
				await fetchData();
			}
		}
		getSnapShot();
	},[blockHeader])

	useEffect(() => {
		const init = async () => {
			await fetchData();
		}

		if (api) init();
	},[api]) 

	
	return(
		<Fragment>
			<div className="row">
				<div className="col-xl-3 col-lg-12"></div>
					<div className="col-xl-6 col-lg-12">
						<div className="card bg-gradient-2" style={{backgroundColor:""}}>
							<div className="card-body" style={{backgroundColor:""}}>
								<div className="row">
									<div className="col-xl-6 col-lg-8" style={{backgroundColor:""}}>
										<div className="col-xl-12 col-lg-6"style={{backgroundColor:""}}>
											<div  className="card" style={{height:"", marginTop:"10px",paddingBottom:"20px", paddingTop:"20px", paddingRight:"10px", border:"2px solid grey", alignItems:"center",backgroundColor:"#2a2e47"}}>
											<img alt="images" width={400} src={xchainlogo}style={{justifyContent:"center"}} ></img>
											</div>
										</div>

										<div className="col-xl-12 col-lg-6"style={{backgroundColor:""}}>
											<div  className="card" style={{height:"", marginTop:"10px", paddingTop:"10px", paddingRight:"10px", border:"2px solid grey", backgroundColor:"#2a2e47"}}>
												<div className="row">
													<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}></div>
													<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
														<div className="">
															<div className="">
																<p className="mt-0 mb-1 fs-24 text-white text-center" >BALANCE</p>
															</div>
														</div>
													</div>
												</div>

												
												<div className="row">
													<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
														<div className="mb-2">
															<div className="align-items-center">
																<div className="ms-4 pt-2">
																	<p className="mt-1 fs-24 text-white text-center" >USDC</p>
																</div>
															</div>
														</div>
													</div>
													<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:""}}> 
															<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
																<div className="" style={{backgroundColor:"", width:"100%"}}>
																	<input type="text" disabled readOnly value = {balance_USDC} placeholder="" className="form-control fs-20" style={{color:"white", textAlign:"center", backgroundColor:"#2a2e47", border:"2px solid grey", height:"50px" }} />
																</div>
															</div>
														</div>
													</div>
												</div>


												<div className="row">
													<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
														<div className="mb-2">
															<div className="align-items-center">
																<div className="ms-4 pt-2">
																	<p className="mt-1 fs-24 text-white text-center" >axlUSDC</p>
																</div>
															</div>
														</div>
													</div>
													<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:""}}> 
															<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
																<div className="" style={{backgroundColor:"", width:"100%"}}>
																	<input type="text" disabled readOnly value = {balance_axlUSDC} placeholder="" className="form-control fs-20" style={{color:"white", textAlign:"center", backgroundColor:"#2a2e47", border:"2px solid grey", height:"50px" }} />
																</div>
															</div>
														</div>
													</div>
												</div>

												<div className="row">	
													<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
														<div className="mb-2">
															<div className="align-items-center">
																<div className="ms-4 pt-2">
																	<p className="mt-1 fs-24 text-white text-center" >DOT</p>
																</div>
															</div>
														</div>
													</div>
													<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:""}}> 
															<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
																<div className="" style={{backgroundColor:"", width:"100%"}}>
																	<input type="text" disabled readOnly value = {balance_DOT} placeholder="" className="form-control fs-20" style={{color:"white", textAlign:"center", backgroundColor:"#2a2e47", border:"2px solid grey", height:"50px" }} />
																</div>
															</div>
														</div>
													</div>
												</div>

												<div className="row">	
													<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
														<div className="mb-2">
															<div className="align-items-center">
																<div className="ms-4 pt-2">
																	<p className="mt-1 fs-24 text-white text-center" >ASTR</p>
																</div>
															</div>
														</div>
													</div>
													<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:""}}> 
															<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
																<div className="" style={{backgroundColor:"", width:"100%"}}>
																	<input type="text" disabled readOnly value = {balance_ASTR} placeholder="" className="form-control fs-20" style={{color:"white", textAlign:"center", backgroundColor:"#2a2e47", border:"2px solid grey", height:"50px" }} />
																</div>
															</div>
														</div>
													</div>
												</div>

												<div className="row">	
													<div className="col-xl-6 col-xxl-3"style={{backgroundColor:""}}>
														<div className="mb-2">
															<div className="align-items-center">
																<div className="ms-4 pt-2">
																	<p className="mt-1 fs-24 text-white text-center" >WGLMR</p>
																</div>
															</div>
														</div>
													</div>
													<div className="col-xl-6 col-xxl-3"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:""}}> 
															<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
																<div className="" style={{backgroundColor:"", width:"100%"}}>
																	<input type="text" disabled readOnly value = {balance_WGLMR} placeholder="" className="form-control fs-20 mb-3" style={{color:"white", textAlign:"center", backgroundColor:"#2a2e47", border:"2px solid grey", height:"50px" }} />
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="col-xl-6 col-lg-3" style={{backgroundColor:""}}>
										<div className="row">
											<div className="col-xl-4 col-xxl-3"style={{backgroundColor:""}}>
												<div className="">
													<div className="">
														<p className="mt-0 mb-1 fs-20 text-white text-center" >DOT/USDC</p>
													</div>
												</div>
											</div>
											<div className="col-xl-4 col-xxl-3"style={{backgroundColor:""}}>
												<div className="">
													<div className="">
														<p className="mt-0 mb-1 fs-20 text-white text-center" >WGLMR/USDC</p>
													</div>
												</div>
											</div>
											<div className="col-xl-4 col-xxl-3"style={{backgroundColor:""}}>
												<div className="">
													<div className="">
														<p className="mt-0 mb-1 fs-20 text-white text-center" >ASTR/USDC</p>
													</div>
												</div>
											</div>
										</div>

										<div className="row">
											<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:"",}}>
												<div className="" style={{backgroundColor:""}}> 
													<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:"", width:"100%"}}>
															<input type="text" disabled readOnly value = {price_DOT_USDC} placeholder="" className="form-control fs-20" style={{color:"white",textAlign:"center", borderColor:"grey", height:"50px"}} />
														</div>
													</div>
												</div>
											</div>
											<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:"",}}>
												<div className="" style={{backgroundColor:""}}> 
													<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:"", width:"100%"}}>
															<input type="text" disabled readOnly value = {price_WGLMR_USDC} placeholder="" className="form-control fs-20" style={{color:"white",textAlign:"center", borderColor:"grey", height:"50px"}} />
														</div>
													</div>
												</div>
											</div>
											<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:"",}}>
												<div className="" style={{backgroundColor:""}}> 
													<div className="align-items-center mx-2 pt-0"  style={{backgroundColor:""}}>
														<div className="" style={{backgroundColor:"", width:"100%"}}>
															<input type="text" disabled readOnly value = {price_ASTR_USDC} placeholder="" className="form-control fs-20" style={{color:"white",textAlign:"center", borderColor:"grey", height:"50px"}} />
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="row">
											<div className="col-xl-12 col-xxl-3"  style={{backgroundColor:"",}}>
												<div className="basic-form">
													<div className="">
														<p className="mb-1 fs-24 text-white text-center"style={{marginTop:"100px"}} >Choose An Order Type</p>
													</div>
													<form onSubmit={(e) => e.preventDefault()}>
														<div className="form-group ml-4 mt-3 d-flex align-items-center"style={{marginBottom:"40px"}}>
															<div className="form-check">
																<input className="form-check-input" type="radio"   name="optiongroup2" id="222" onClick={() => {
																	setChosenOrderTypeNum(1); 
																	setTokenIn_Symbol("USDC");
																	setTokenOut_Symbol("Token Out");
																	setStopPrice("0");
																	setDcaNumber("0");
																	setDcaBlockInterval("0");
																}} />
																<label className="form-check-label" htmlFor="222">
																Limit Market Order
																</label>
																
															</div>
															<div className="form-check mx-2">
																<input className="form-check-input" type="radio"  name="optiongroup2" id="223" onClick={() => { 
																	setChosenOrderTypeNum(2); 
																	setTokenIn_Symbol("Token In");
																	setTokenOut_Symbol("USDC");
																	setLimitPrice("0");
																	setDcaNumber("0");
																	setDcaBlockInterval("0");
																	}} />
																<label className="form-check-label" htmlFor="223">
																Stop Market Order
																</label>
															</div>
															<div className="form-check">
																<input className="form-check-input" type="radio" name="optiongroup2" id="224" onClick={() => { 
																	setChosenOrderTypeNum(3); 
																	setTokenIn_Symbol("Token In");
																	setTokenOut_Symbol("USDC");
																	setDcaNumber("0");
																	setDcaBlockInterval("0");
																	}} />
																<label className="form-check-label" htmlFor="224">
																Bracket Order
																</label>
															</div> 
															<div className="form-check">
																<input className="form-check-input" type="radio" name="optiongroup2" id="224" onClick={() => { 
																	// setChosenOrderType("Dollar Cost Average"); 
																	setChosenOrderTypeNum(4); 
																	setTokenIn_Symbol("USDC");
																	setTokenOut_Symbol("Token Out");
																	setLimitPrice("0");
																	setStopPrice("0");
																	}} />
																<label className="form-check-label" htmlFor="224">
																Dollar Cost Average
																</label>
															</div>                    
                   
														</div>
													</form>
												</div>
											</div>
										</div>
									<div className="row">
										<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:"",}}></div>
										<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:"",}}>

											{chosenOrderTypeNum!==0 ? ( 
												<div className="form-group col-md-12 mb-4 ml-3 text-white text-center fs-18">
											
												<div className="basic-dropdown">
													<Dropdown>
														<Dropdown.Toggle variant="" className="" style={{backgroundColor:"#171622"}}>
															{tokenIn_Symbol}
														</Dropdown.Toggle>
														<Dropdown.Menu>
														{chosenOrderTypeNum===1 || chosenOrderTypeNum===4 ?
															(<Dropdown.Item value="1"  href="#" onClick={() => {
																setTokenIn_Symbol("USDC");
														}} >USDC</Dropdown.Item >)
															:
															(
																<>
																<Dropdown.Item value="2" href="#" onClick={() => {
																	setTokenIn_Symbol("DOT");
																	chosenOrderTypeNum===3? setLimitPrice(`${(Number(price_DOT_USDC)*1.01).toFixed(5)}`) : setLimitPrice("0");
																	setStopPrice(`${(Number(price_DOT_USDC)*0.99).toFixed(5)}`);
																	setOrderSize(`${(Math.floor(1000*Number(balance_DOT)/3)/1000).toFixed(5)}`);
																	setDcaNumber("0");
																	setDcaBlockInterval("0");
																	}} >DOT</Dropdown.Item >
																<Dropdown.Item value="3" href="#" onClick={() => {
																	setTokenIn_Symbol("WGLMR");
																	chosenOrderTypeNum===3? setLimitPrice(`${(Number(price_WGLMR_USDC)*1.01).toFixed(5)}`) : setLimitPrice("0");
																	setStopPrice(`${(Number(price_WGLMR_USDC)*0.99).toFixed(5)}`);
																	setOrderSize(`${(Math.floor(1000*Number(balance_WGLMR)/3)/1000).toFixed(5)}`);
																	setDcaNumber("0");
																	setDcaBlockInterval("0");

															}} >WGLMR</Dropdown.Item >
																<Dropdown.Item value="4" href="#" onClick={() => {
																	setTokenIn_Symbol("ASTR");
																	chosenOrderTypeNum===3? setLimitPrice(`${(Number(price_ASTR_USDC)*1.01).toFixed(5)}`) : setLimitPrice("0");
																	setStopPrice(`${(Number(price_ASTR_USDC)*0.99).toFixed(5)}`);
																	setOrderSize(`${(Math.floor(1000*Number(balance_ASTR)/3)/1000).toFixed(5)}`);
																	setDcaNumber("0");
																	setDcaBlockInterval("0");
															}} >ASTR</Dropdown.Item >
																</>
															)
														}
														</Dropdown.Menu>
													</Dropdown>
												</div>

											</div>
											) : ""
											}
											
										</div>
										<div className="col-xl-4 col-xxl-3"  style={{backgroundColor:"",}}>
										
											{chosenOrderTypeNum!==0 ? 
													tokenIn_Symbol==="USDC"?
													(

														<div className="basic-dropdown">
															<Dropdown>
																<Dropdown.Toggle variant="" className="" style={{backgroundColor:"#171622"}}>
																	{tokenOut_Symbol}
																</Dropdown.Toggle>
																<Dropdown.Menu>
																	<Dropdown.Item value="2" href="#" onClick={() => {
																		setTokenOut_Symbol("DOT");
																		chosenOrderTypeNum===1? setLimitPrice(`${(Number(price_DOT_USDC)*1.01).toFixed(5)}`) : setLimitPrice("0");
																		setStopPrice("0");
																		setOrderSize(`${(Math.floor(1000*Number(balance_USDC)/3)/1000).toFixed(5)}`);
																		chosenOrderTypeNum===1?  setDcaNumber("0") : setDcaNumber("3");
																		chosenOrderTypeNum===1? setDcaBlockInterval("0") : setDcaBlockInterval("10");
																		}} >DOT</Dropdown.Item >
																	<Dropdown.Item value="3" href="#" onClick={() => {
																		setTokenOut_Symbol("WGLMR");
																		chosenOrderTypeNum===1? setLimitPrice(`${(Number(price_WGLMR_USDC)*1.01).toFixed(5)}`) : setLimitPrice("0");
																		setStopPrice("0");
																		setOrderSize(`${(Math.floor(1000*Number(balance_USDC)/3)/1000).toFixed(5)}`);
																		chosenOrderTypeNum===1?  setDcaNumber("0") : setDcaNumber("3");
																		chosenOrderTypeNum===1? setDcaBlockInterval("0") : setDcaBlockInterval("10");
																}} >WGLMR</Dropdown.Item >
																	<Dropdown.Item value="4" href="#" onClick={() => {
																		setTokenOut_Symbol("ASTR");
																		chosenOrderTypeNum===1? setLimitPrice(`${(Number(price_ASTR_USDC)*1.01).toFixed(5)}`) : setLimitPrice("0");
																		setStopPrice("0");
																		setOrderSize(`${(Math.floor(1000*Number(balance_USDC)/3)/1000).toFixed(5)}`);
																		chosenOrderTypeNum===1?  setDcaNumber("0") : setDcaNumber("3");
																		chosenOrderTypeNum===1? setDcaBlockInterval("0") : setDcaBlockInterval("10");
																}} >ASTR</Dropdown.Item >
																</Dropdown.Menu>
															</Dropdown>
														</div>

													)
													: 
													(
														<div className="basic-dropdown">
															<Dropdown>
																<Dropdown.Toggle variant="" className="" style={{backgroundColor:"#171622"}}>
																	{tokenOut_Symbol}
																</Dropdown.Toggle>
																<Dropdown.Menu>
																	<Dropdown.Item value="1"  href="#" onClick={() => setTokenOut_Symbol("USDC")} >USDC</Dropdown.Item >
																</Dropdown.Menu>
															</Dropdown>
														</div>
													)

												: ""
											}	

											</div>
										</div>
										<div className="col-xl-2 col-xxl-3"  style={{backgroundColor:""}}></div>
										<div className="col-xl-12 col-xxl-3"  style={{backgroundColor:"",}}>
										<div className="basic-form">
										<div className="form-group mb-3 mt-2 d-flex gap-2 align-items-center">

											{chosenOrderTypeNum===1 || chosenOrderTypeNum===3 ? (
											<div className="form-group mx-auto text-white text-center fs-18">
												<label>Limit Market Price</label>
												<input
													type="textarea"
													className="form-control fs-18 text-center"
													placeholder=""
													value={limitPrice}
													style={{borderColor:"grey"}}
													onChange={(event) => (setLimitPrice(event.target.value))}

												/>
											</div>
											) : ""
											}

											{chosenOrderTypeNum===2 || chosenOrderTypeNum===3 ? (
											<div className="form-group mx-auto text-white text-center fs-18">
												<label>Stop Price</label>
												<input
													type="textarea"
													className="form-control fs-18 text-center"
													placeholder=""
													value={stopPrice}
													style={{borderColor:"grey"}}
													onChange={(event) => (setStopPrice(event.target.value))}

												/>
											</div>
											) : ""
											}

											{chosenOrderTypeNum!==0 ? (
											<div className="form-group mx-auto text-white text-center fs-18">
												<label>Size</label>
												<input
													type="textarea"
													className="form-control fs-18 text-center"
													placeholder=""
													value={orderSize}
													style={{borderColor:"grey"}}
													onChange={(event) => (setOrderSize(event.target.value))}

												/>
											</div>
											) : ""
											}

											{chosenOrderTypeNum===4 ? (
											<div className="form-group mx-auto text-white text-center fs-18">
												<label>DCA Number</label>
												<input
													type="textarea"
													className="form-control fs-18 text-center"
													placeholder=""
													value={dcaNumber}
													style={{borderColor:"grey"}}
													onChange={(event) => (setDcaNumber(event.target.value))}

												/>
											</div>
											) : ""
											}
										
											{chosenOrderTypeNum===4 ? (
											<div className="form-group mx-auto text-white text-center fs-18">
												<label>DCA Block Int</label>
												<input
													type="textarea"
													className="form-control fs-18 text-center"
													placeholder=""
													value={dcaBlockInterval}
													style={{borderColor:"grey"}}
													onChange={(event) => (setDcaBlockInterval(event.target.value))}

												/>
											</div>
										
											) : ""
											}
										</div>

											{chosenOrderTypeNum!==0 ? (
												<div className="form-group col-md-12 d-flex align-items-center p-0"style={{backgroundColor:""}}>
													<button type="submit" className="btn btn-primary text-center mx-auto mt-0"style={{marginTop:""}} 
															onClick = { () => submitOrder()}
															>
														Submit Order
													</button>
												</div>
											) : ""
										}

										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			<div className="col-xl-3 col-lg-12"></div>
				<div className="row">
					<div className="col-xl-1"style={{backgroundColor:""}}></div>
					<div className="col-xl-10"style={{ fontSize:"22px", color: "white"}}>
						<div className="tab-wrapper">
							<div className='container-fluid' >
								<div className="row">
									<div className="col-sm-12">
										<Tabs defaultActiveKey="limitOrders" activeKey={activeTab} onSelect={handleSelect}>

											<Tab eventKey="limitOrders" title="Limit Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:""}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>

																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																{/* <th scope="col" style={{color:"#AEAEAE"}}>Order Type</th> */}
																{/* <th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th> */}
																{/* <th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th> */}
																{/* <th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th> */}
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>
															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{account_limitOrdersArray.map((data,index)=>(	
															<tr  key={index} >
																<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																<td>{`${data.limit_price}`}</td>
																<td>{`${data.stop_price}`}</td>
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																{/* <td>{`${data.order_type}`}</td>
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																<td>{`${data.positionAr}`}</td> */}
																<td onClick = { () => delete_Order(data.nonce,data.size,data.tokenIn)} >{" X "}</td>


															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>
								
											<Tab eventKey="stopOrders" title="Stop Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:""}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>

																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																{/* <th scope="col" style={{color:"#AEAEAE"}}>Order Type</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th> */}
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>

															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{account_stopOrdersArray.map((data,index)=>(	
															<tr  key={index} >
															<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																<td>{`${data.limit_price}`}</td>
																<td>{`${data.stop_price}`}</td>
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																{/* <td>{`${data.order_type}`}</td>
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																<td>{`${data.positionAr}`}</td> */}
																<td onClick = { () => delete_Order(data.nonce,data.size,data.tokenIn)} >{" X "}</td>

															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>
								
											<Tab eventKey="bracketOrders" title="Bracket Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:""}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>

																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																{/* <th scope="col" style={{color:"#AEAEAE"}}>Order Type</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th> */}
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>

															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{account_bracketOrdersArray.map((data,index)=>(	
															<tr  key={index} >
														<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																<td>{`${data.limit_price}`}</td>
																<td>{`${data.stop_price}`}</td>
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																{/* <td>{`${data.order_type}`}</td>
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																<td>{`${data.positionAr}`}</td> */}
																<td onClick = { () => delete_Order(data.nonce,data.size,data.tokenIn)} >{" X "}</td>

															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>

											<Tab eventKey="dcaOrders" title="DCA Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:""}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																{/* <th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th> */}

																{/* <th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th> */}
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																{/* <th scope="col" style={{color:"#AEAEAE"}}>Order Type</th> */}
																<th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th>
																{/* <th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th> */}
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>

															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{account_dcaOrdersArray.map((data,index)=>(	
															<tr  key={index} >
														<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																{/* <td>{`${data.limit_price}`}</td> */}
																{/* <td>{`${data.stop_price}`}</td> */}
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																{/* <td>{`${data.order_type}`}</td> */}
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																{/* <td>{`${data.positionAr}`}</td> */}
																<td onClick = { () => delete_Order(data.nonce,data.size,data.tokenIn)} >{" X "}</td>

															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>


											<Tab eventKey="allLimitOrders" title="All Limit Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:"darkblue"}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>

																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Order Type</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>

															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{all_limitOrdersArray.map((data,index)=>(	
															<tr  key={index} >
																<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																<td>{`${data.limit_price}`}</td>
																<td>{`${data.stop_price}`}</td>
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																<td>{`${data.order_type}`}</td>
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																<td>{`${data.positionAr}`}</td>
																<td onClick = { () => delete_Order(data.nonce)} >{" X "}</td>

															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>

											<Tab eventKey="allStopOrders" title="ALL Stop Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:"darkblue"}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>

																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Order Type</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>

															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{all_stopOrdersArray.map((data,index)=>(	
															<tr  key={index} >
																<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																<td>{`${data.limit_price}`}</td>
																<td>{`${data.stop_price}`}</td>
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																<td>{`${data.order_type}`}</td>
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																<td>{`${data.positionAr}`}</td>
																<td onClick = { () => delete_Order(data.nonce)} >{" X "}</td>

															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>

											<Tab eventKey="allBracketOrders" title="All Bracket Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:"darkblue"}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>

																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Order Type</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>

															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{all_bracketOrdersArray.map((data,index)=>(	
															<tr  key={index} >
																<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																<td>{`${data.limit_price}`}</td>
																<td>{`${data.stop_price}`}</td>
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																<td>{`${data.order_type}`}</td>
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																<td>{`${data.positionAr}`}</td>
																<td onClick = { () => delete_Order(data.nonce)} >{" X "}</td>

															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>


											<Tab eventKey="allDcaOrders" title="All DCA Orders">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:"darkblue"}}>
														<thead>
															<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>

																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Order Type</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA splits</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DCA Block Int</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Delete</th>

															</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{all_dcaOrdersArray.map((data,index)=>(	
															<tr  key={index} >
																<td>{`${data.nonce}`}</td>
																<td>{data.owner}</td>
																<td>{data.tokenIn}</td>
																<td>{data.tokenOut}</td>
																<td>{`${data.limit_price}`}</td>
																<td>{`${data.stop_price}`}</td>
																<td>{`${data.size}`}</td>
																<td>{`${data.block_submitted}`}</td>
																<td>{`${data.order_type}`}</td>
																<td>{`${data.numOfsplits}`}</td>
																<td>{`${data.dcaBlockInterval}`}</td>
																<td>{`${data.positionAr}`}</td>
																<td onClick = { () => delete_Order(data.nonce)} >{" X "}</td>

															</tr>
														))}
														</tbody>
													</Table>
												</div>
											</Tab>


											<Tab eventKey="queuedForMoonbeamOrders" title="Moonbeam Engine Queue">
												<div className="tab-item-wrapper">
													<Table responsive bordered className="verticle-middle table-hover mt-3"style={{border:"solid", backgroundColor:"darkblue"}}>
														<thead>
														<tr className="text-center" style={{border:"solid"}}>
																<th scope="col" style={{color:"#AEAEAE"}}>Engine Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Order Nonce</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Owner</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token In</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Token Out</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Limit Market Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Stop Price</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Size</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Block Submitted</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Order Type</th>
																<th scope="col" style={{color:"#AEAEAE"}}>Array Pos</th>
																<th scope="col" style={{color:"#AEAEAE"}}>DELETE N/A</th>
														</tr>
														</thead>
														<tbody className="fs-16 text-center">
															{executionsEngineBook_Moonbeam.map((data,index)=>(	
																<tr  key={index} >
																	<td>{`${data.engine_nonce}`}</td>
																	<td>{`${data.origin_nonce}`}</td>
																	<td>{data.owner}</td>
																	<td>{data.tokenIn}</td>
																	<td>{data.tokenOut}</td>
																	<td>{`${data.limit_price}`}</td>
																	<td>{`${data.stop_price}`}</td>
																	<td>{`${data.size}`}</td>
																	<td>{`${data.block_submitted}`}</td>
																	<td>{`${data.order_type}`}</td>
																	<td>{`${data.positionAr}`}</td>
																	<td onClick = { () => delete_Order(data.engine_nonce)} >{" X "}</td>
																</tr>
															))}
														</tbody>
													</Table>
												</div>
											</Tab>
										</Tabs>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-1"></div>
				</div>
			</div>
		</Fragment>
	)
}		
export default OrderManager;