import { ApiPromise, WsProvider } from '@polkadot/api';
import { ethers } from 'ethers';  
import {Wallet} from 'ethers';  

import IERC20_raw from './Abis/IERC20';  

import ordersManager_Moonbeam_raw from './Abis/Moonbeam/OrdersManager';  
import usersRegistry_Moonbeam_raw from './Abis/Moonbeam/UsersRegistry';  

import executionOrdersEngineMoonbeam_raw from './Abis/Moonbeam/ExecutionOrdersEngineMoonbeam';  
import executionOrdersEngineFromFantom_raw from './Abis/Moonbeam/ExecutionOrdersEngineFromFantom';  
import executionOrdersEngineFromBinance_raw from './Abis/Moonbeam/ExecutionOrdersEngineFromBinance';  

import axelarMoonbeamSatelite_raw from './Abis/Moonbeam/AxelarMoonbeamSatelite';  
import axelarFantomSatelite_raw from './Abis/Fantom/AxelarFantomSatelite';  
import axelarBinanceSatelite_raw from './Abis/Binance/AxelarBinanceSatelite';  


// ************************** //
// *** Create a .env file and insert the private key for a Moonbeam EVM account
// *** REACT_APP_PRIVATE_KEY= "YOUR PRIVATE KEY"; 
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;     
// ************************** //

// MOONBEAM
const ordersManager_Moonbeam_address =  "0xfbeE1a3683e4335fe343e6847f04DFbf18278d11"; //"0x9331d7e0F7deD78a21d6A3d381cdc95Da689AF79";
const usersRegistry_Moonbeam_address = "0x51012d2c409Ece85f2506b4a3F13f33FA9325ac1";
const executionOrdersEngine_Moonbeam_address = "0x6E3bD83C6902Ec9f31bc2802342aB93336f685B8";
const executionOrdersEngineFromFantom_address = "0x7cF1787e3Af0da55c175dd56E3820e6dDA859AfB";
const executionOrdersEngineFromBinance_address = "0x5003915C75De9a35A66c758205477b62F447a64f";
const axelarMoonbeamSatelite_address = "0x10142644765AAdfC1663c286e92ddd208ac5fe4b";
//FANTOM 
const axelarFantomSatelite_address = "0x77a410dd5A158FEc2eb8AA70693240B68a3A23ec";
//BINANCE
const axelarBinanceSatelite_address = "0x65b5d92202De37560c33B5e563bF5F9c5412E0b1";

const WDEV_Moonbase = "0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715";
const axlUSDC_Moonbeam_address = "0xCa01a1D0993565291051daFF390892518ACfAD3A";   //6 decimals
const xcASTR_address  = "0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf";    //18 decimals
const WGLMR_address   = "0xAcc15dC74880C9944775448304B263D191c6077F";    //18 decimals
const xcDOT_address   = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080";    //10 decimals
const USDC_Moonbeam_address    = "0x931715FEE2d06333043d11F658C8CE934aC61D0c";    //6 decimals

const axlUSDC_Fantom_address = "0x1B6382DBDEa11d97f24495C9A90b7c88469134a4";   //6 decimals
const USDC_Fantom_address    = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75";   //6 decimals

const axlUSDC_Binance_address = "0x4268B8F0B87b6Eae5d897996E6b845ddbD99Adf3";  //6 decimals
const USDC_Binance_address    = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";   //6 decimals

const token_Symbol = {
						"0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715" : "WDEV",
						"0xCa01a1D0993565291051daFF390892518ACfAD3A" : "axlUSDC_M",
						"0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf" : "ASTR",
						"0xAcc15dC74880C9944775448304B263D191c6077F" : "WGLMR",
						"0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080" : "DOT",
						"0x931715FEE2d06333043d11F658C8CE934aC61D0c" : "USDC_M",
						"0x1B6382DBDEa11d97f24495C9A90b7c88469134a4" : "axlUSDC_F",  //axlUSDC_Fantom_address
						"0x04068DA6C83AFCFA0e13ba15A6696662335D5B75" : "USDC_F",      //USDC_Fantom_address  
						"0x4268B8F0B87b6Eae5d897996E6b845ddbD99Adf3" : "axlUSDC_B",  //axlUSDC_Fantom_address
						"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" : "USDC_B"      //USDC_Fantom_address  
					};
const token_Address = {
						"WDEV"        : "0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715",
						"axlUSDC_M"   : "0xCa01a1D0993565291051daFF390892518ACfAD3A",
						"ASTR"        : "0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf",
						"WGLMR"       : "0xAcc15dC74880C9944775448304B263D191c6077F",
						"DOT"         : "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080",
						"USDC_M"      : "0x931715FEE2d06333043d11F658C8CE934aC61D0c",
						"axlUSDC_F"   : "0x1B6382DBDEa11d97f24495C9A90b7c88469134a4",
						"USDC_F"      : "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
						"axlUSDC_B"   : "0x4268B8F0B87b6Eae5d897996E6b845ddbD99Adf3",
						"USDC_B"      : "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
					};

const token_decimals = {
						"0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715" : 18,
						"0xCa01a1D0993565291051daFF390892518ACfAD3A" : 6,
						"0xFfFFFfffA893AD19e540E172C10d78D4d479B5Cf" : 18,
						"0xAcc15dC74880C9944775448304B263D191c6077F" : 18,
						"0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080" : 10,
						"0x931715FEE2d06333043d11F658C8CE934aC61D0c" : 6,
						"0x1B6382DBDEa11d97f24495C9A90b7c88469134a4" : 6,  //axlUSDC_Fantom_address
						"0x04068DA6C83AFCFA0e13ba15A6696662335D5B75" : 6,   //USDC_Fantom_address  
						"0x4268B8F0B87b6Eae5d897996E6b845ddbD99Adf3" : 6,  //axlUSDC_Binance_address
						"0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d" : 6   //USDC_Binance_address  
					};				

// Create a new Wallet instance with the private key
const moonbeam_signer = new Wallet(PRIVATE_KEY);
const fantom_signer   = new Wallet(PRIVATE_KEY);
const binance_signer  = new Wallet(PRIVATE_KEY);

//RPC POINTS
const Moonbeam_RPC = "https://rpc.api.moonbeam.network";
// const Moonbeam_RPC = "https://rpc.api.moonbase.moonbeam.network";
const Fantom_RPC = "https://rpc.ankr.com/fantom/";
const Binance_RPC = "https://bsc-dataseed.binance.org/";


// const MoonbaseAlphaTestnet = "https://rpc.api.moonbase.moonbeam.network";
// Connect the Wallet instance to a provider
const Moonbeam_provider = new ethers.providers.JsonRpcProvider(Moonbeam_RPC);
const moonbeam_wallet = moonbeam_signer.connect(Moonbeam_provider);

const Fantom_provider = new ethers.providers.JsonRpcProvider(Fantom_RPC);
const fantom_wallet = fantom_signer.connect(Fantom_provider);

const Binance_provider = new ethers.providers.JsonRpcProvider(Binance_RPC);
const binance_wallet = binance_signer.connect(Binance_provider);

//Set up contracts
const OrdersManager_instance =  new ethers.Contract( ordersManager_Moonbeam_address, ordersManager_Moonbeam_raw.abi, moonbeam_wallet);
const UsersRegistryMoonbeam_instance =  new ethers.Contract( usersRegistry_Moonbeam_address, usersRegistry_Moonbeam_raw.abi, moonbeam_wallet);
// const erc20WDEV_Moonbase =  new ethers.Contract( WDEV_Moonbase, IERC20_raw.abi, moonbeam_wallet);
const ExecutionOrdersEngineMoonbeam_instance = new ethers.Contract( executionOrdersEngine_Moonbeam_address, executionOrdersEngineMoonbeam_raw.abi, moonbeam_wallet);
const ExecutionOrdersEngineFromFantom_instance = new ethers.Contract(executionOrdersEngineFromFantom_address, executionOrdersEngineFromFantom_raw.abi, moonbeam_wallet);
const ExecutionOrdersEngineFromBinance_instance = new ethers.Contract(executionOrdersEngineFromBinance_address, executionOrdersEngineFromBinance_raw.abi, moonbeam_wallet);

const AxelarMoonbeamSatelite_instance = new ethers.Contract(axelarMoonbeamSatelite_address, axelarMoonbeamSatelite_raw.abi, moonbeam_wallet);
//FANTOM 
const AxelarFantomSatelite_instance  = new ethers.Contract(axelarFantomSatelite_address, axelarFantomSatelite_raw.abi, fantom_wallet);
//BINANCE
const AxelarBinanceSatelite_instance  = new ethers.Contract(axelarBinanceSatelite_address, axelarBinanceSatelite_raw.abi, binance_wallet);



const axelar_fantom_fee = "1";   // 1 FTM 
const axelar_binance_fee = "0.001";   // 0.001 BNB 

let engineMessage = "Welcome to the  Order Book XChain Orders";


let userChain; //possible values Moonbeam,Binance,Interlay,Astar,Moonbase,BinanceTestNet
const setChainOfUser = (_userChain) => {
	userChain = _userChain;       //  MOONBEAM,FANTOM,BINANCE
	console.log(`Selected ===------> userChain: ${userChain}`);
}
const getUserChain = () => {
	return userChain;
}

let wallet, mm_chainId, mm_account;
const setWallet = (_wallet=null, _mm_chainId=null, _mm_account=null) => { 
	if (_wallet) {
		wallet = _wallet;
		mm_chainId = _mm_chainId;
		mm_account = _mm_account;
		console.log(`mm_account: ${mm_account} New wallet : `,wallet,` ***** mm_chainId: ${mm_chainId}`);  
	}
}


// const test_data = async () => {
// 	const admin_of_OrdersManager_instance =  await OrdersManager_instance.admin();
// 	const executionOrdersEngineMoonbeam_Address =  await OrdersManager_instance.executionOrdersEngineMoonbeam_Address();
//     const stellaSwap_addressof_OrdersManager_instance =  await OrdersManager_instance.stellaSwapAddress();

// 	console.log(`********************* OrdersManager_instance ***********************************`);
//     console.log(`admin_of_OrdersManager_instance: ${admin_of_OrdersManager_instance} executionOrdersEngineMoonbeam_Address: ${executionOrdersEngineMoonbeam_Address} stellaSwap_addressof_OrdersManager_instance: ${stellaSwap_addressof_OrdersManager_instance}`);
// 	console.log(` <<<<<<<<<<<<<<||||||||||||||||||||||||||||>>>>>>>>>>>`);

// 	const admin_of_ExecutionOrdersEngineMoonbeam_instance =  await ExecutionOrdersEngineMoonbeam_instance.admin();
//     let stellaSwap_addressof_ExecutionOrdersEngineMoonbeam_instance =  await ExecutionOrdersEngineMoonbeam_instance.stellaSwapAddress();

// 	console.log(`********************* ExecutionOrdersEngineMoonbeam_instance ***********************************`);
//     console.log(`admin_of_ExecutionOrdersEngineMoonbeam_instance: ${admin_of_ExecutionOrdersEngineMoonbeam_instance} stellaSwap_addressof_ExecutionOrdersEngineMoonbeam_instance: ${stellaSwap_addressof_ExecutionOrdersEngineMoonbeam_instance}`);
// 	console.log(` <<<<<<<<<<<<<<||||||||||||||||||||||||||||>>>>>>>>>>>`);


// 	console.log(`********************* UsersRegistryMoonbeam_instance ***********************************`);
// 	const admin_of_UsersRegistryMoonbeam_instance =  await UsersRegistryMoonbeam_instance.admin();
// 	let user_Struct =  await UsersRegistryMoonbeam_instance.users(mm_account);
// 	let user_Chain =  await UsersRegistryMoonbeam_instance.getUserChain(mm_account);
// 	let isUserRegistered =  await UsersRegistryMoonbeam_instance.isUserRegistered(mm_account);
// 	// await registerUser_Moonbeam();
// 	console.log(`admin_of_UsersRegistryMoonbeam_instance: ${admin_of_UsersRegistryMoonbeam_instance} mm_account: ${mm_account} isUserRegistered: ${isUserRegistered} user_Chain: ${user_Chain} user_Struct: `,user_Struct);
// 	console.log(` <<<<<<<<<<<<<<||||||||||||||||||||||||||||>>>>>>>>>>>`);

// }

// const test_readOrders = async () => {
//     // console.log(`********************* OrdersManager_instance OPEN WORKING ORDERS Start ***********************************`);
//     // const pending await get_OrderBooks();
//     // console.log(`********************* OrdersManager_instance OPEN WORKING ORDERS End ***********************************`);
// }

const update_StellaSwap_Prices = async () => {
	return new Promise (async (resolve,reject) => {

		console.log(`********************* OrdersManager_instance SET STELLASWAP Prices Start ***********************************`);
		const tx_set_StellaSwapPrice =  await OrdersManager_instance.get_StellaSwapPrice();
		try {
			const receipt = await tx_set_StellaSwapPrice.wait();
			if (receipt.status === false) {
				throw new Error("Transaction update_StellaSwap_Prices failed");
			}
			console.log(`********************* OrdersManager_instanceSET STELLASWAP Prices End ***********************************`);
			resolve(`********************* OrdersManager_instanceSET STELLASWAP Prices End ***********************************`);
		}
		catch (e) {
			console.log(` ********** while  update_StellaSwap_Prices an error occured ********** Error: `,e);
			resolve(` ********** while  update_StellaSwap_Prices an error occured ****`);
  		}

	});

}


const get_StellaSwap_Prices = async () => {
	const dot_USDC   = await OrdersManager_instance.priceUSDC(xcDOT_address);
	const price_DOT_USDC =(dot_USDC / 1000000).toFixed(5);

	const wglmr_USDC = await OrdersManager_instance.priceUSDC(WGLMR_address);
	const price_WGLMR_USDC =(wglmr_USDC / 1000000).toFixed(5);

	const astr_USDC  = await OrdersManager_instance.priceUSDC(xcASTR_address);
	const price_ASTR_USDC =(astr_USDC / 1000000).toFixed(5);

	// console.log(` PRICES |>     dot_USDC: ${dot_USDC}   wglmr_USDC: ${wglmr_USDC}   astr_USDC: ${astr_USDC}`);
	return {price_DOT_USDC, price_WGLMR_USDC, price_ASTR_USDC,};
}

const get_Moonbeam_Balances = async () => {
	// console.log(`********************* Balances Start ***********************************`);
	let account_DOT_Balance="", account_WGLMR_Balance="", account_ASTR_Balance="",account_USDC_Balance="",account_axlSUSDC_Balance="",account_WDEV_Balance="";
	if (userChain==="MOONBEAM")
	{
		//FOR ERC20 with 18 decimals
		account_DOT_Balance   = await getBalance(xcDOT_address, mm_account, moonbeam_wallet, 10);
		account_WGLMR_Balance = await getBalance(WGLMR_address, mm_account, moonbeam_wallet, 18);
		account_ASTR_Balance  = await getBalance(xcASTR_address, mm_account, moonbeam_wallet, 18);
		//FOR ERC20 with 6 decimals
		account_USDC_Balance      = await getBalance(USDC_Moonbeam_address, mm_account, moonbeam_wallet, 6);
		account_axlSUSDC_Balance  = await getBalance(axlUSDC_Moonbeam_address, mm_account, moonbeam_wallet, 6);
	}
	else if (userChain==="MOONBASE")
	{
		account_WDEV_Balance      = await getBalance(WDEV_Moonbase, mm_account, moonbeam_wallet);
	}
	else if (userChain==="FANTOM")
	{
		account_axlSUSDC_Balance  = await getBalance(axlUSDC_Fantom_address, mm_account, fantom_wallet, 6);
		// account_USDC_Balance      = await getBalance(USDC_Fantom_address, mm_account, fantom_wallet, 6);
		account_USDC_Balance = account_axlSUSDC_Balance
		account_DOT_Balance = await getBalanceForFANTOMaccount(xcDOT_address,mm_account,10);
		account_WGLMR_Balance = await getBalanceForFANTOMaccount(WGLMR_address,mm_account,18);
		account_ASTR_Balance = await getBalanceForFANTOMaccount(xcASTR_address,mm_account,18);
	}
	else if (userChain==="BINANCE")
	{
		account_axlSUSDC_Balance  = await getBalance(axlUSDC_Binance_address, mm_account, binance_wallet, 6);
		// account_USDC_Balance      = await getBalance(USDC_Binance_address, mm_account, binance_wallet, 6);
		account_USDC_Balance = account_axlSUSDC_Balance
		account_DOT_Balance = await getBalanceForBINANCEaccount(xcDOT_address,mm_account,10);
		account_WGLMR_Balance = await getBalanceForBINANCEaccount(WGLMR_address,mm_account,18);
		account_ASTR_Balance = await getBalanceForBINANCEaccount(xcASTR_address,mm_account,18);
	}


	return { account_DOT_Balance, account_WGLMR_Balance, account_ASTR_Balance, account_USDC_Balance, account_axlSUSDC_Balance, account_WDEV_Balance,};
}

const get_OrderBooks = async () => {
    // console.log(`********************* OrdersManager_instance OPEN WORKING ORDERS Start ***********************************`);

	let account_limitOrdersArray=[] ,account_stopOrdersArray=[], account_bracketOrdersArray=[], account_dcaOrdersArray=[];
	let all_limitOrdersArray=[] , all_stopOrdersArray=[], all_bracketOrdersArray=[], all_dcaOrdersArray=[];

	let limitOrdersArray =  await OrdersManager_instance.get_limitOrdersArray();
	for (let i=0; i<limitOrdersArray.length; i++)
	{
		let ord =  await OrdersManager_instance.Orders(limitOrdersArray[i]);
		// console.log(` =-----> mm_account: ${mm_account} limitOrdersArray[${i}]  : ${limitOrdersArray[i]} nonce: ${ord.nonce} owner: ${ord.owner} tokenIn: ${`${ord.tokenIn}`.substring(0,5)}...${`${ord.tokenIn}`.substring(36)} tokenOut: ${`${ord.tokenOut}`.substring(0,5)}...${`${ord.tokenOut}`.substring(36)} limit_price: ${ord.limit_price} stop_price: ${ord.stop_price} size: ${ord.size} block_submitted: ${ord.block_submitted} numOfsplits: ${ord.numOfsplits} order_type: ${ord.order_type} positionAr: ${ord.positionAr} dcaBlockInterval: ${ord.dcaBlockInterval}`);
		if (ord.owner.toLowerCase()===mm_account.toLowerCase()) 
		{
			const _size = Number(ethers.utils.formatUnits( ord.size, token_decimals[ord.tokenIn])).toFixed(3);
			account_limitOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: Number(ord.limit_price)/1000000, stop_price: Number(ord.stop_price)/1000000, size: _size, block_submitted: ord.block_submitted, numOfsplits: "N/A", order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: "N/A" });
		}
		all_limitOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: ord.limit_price, stop_price: ord.stop_price, size: ord.size, block_submitted: ord.block_submitted, numOfsplits: ord.numOfsplits, order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: ord.dcaBlockInterval });

	}

	let stopOrdersArray =  await OrdersManager_instance.get_stopOrdersArray();
	for (let i=0; i<stopOrdersArray.length; i++)
	{
		let ord =  await OrdersManager_instance.Orders(stopOrdersArray[i]);
		// console.log(` =-----> stopOrdersArray[${i}]   : ${stopOrdersArray[i]} nonce: ${ord.nonce} owner: ${ord.owner} tokenIn:${`${ord.tokenIn}`.substring(0,5)}...${`${ord.tokenIn}`.substring(36)} tokenOut:${`${ord.tokenOut}`.substring(0,5)}...${`${ord.tokenOut}`.substring(36)} limit_price: ${ord.limit_price} stop_price: ${ord.stop_price} size: ${ord.size} block_submitted: ${ord.block_submitted} numOfsplits: ${ord.numOfsplits} order_type: ${ord.order_type} positionAr: ${ord.positionAr} dcaBlockInterval: ${ord.dcaBlockInterval}`);

		if (ord.owner.toLowerCase()===mm_account.toLowerCase()) 
		{
			const _size = Number(ethers.utils.formatUnits( ord.size, token_decimals[ord.tokenIn])).toFixed(3);
			account_stopOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: Number(ord.limit_price)/1000000, stop_price: Number(ord.stop_price)/1000000, size: _size, block_submitted: ord.block_submitted, numOfsplits: "N/A", order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: "N/A" });
		}
		all_stopOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: ord.limit_price, stop_price: ord.stop_price, size: ord.size, block_submitted: ord.block_submitted, numOfsplits: ord.numOfsplits, order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: ord.dcaBlockInterval });
		
	}

	let bracketOrdersArray =  await OrdersManager_instance.get_bracketOrdersArray();
	for (let i=0; i<bracketOrdersArray.length; i++)
	{
		let ord =  await OrdersManager_instance.Orders(bracketOrdersArray[i]);
		// console.log(` =-----> bracketOrdersArray[${i}]: ${bracketOrdersArray[i]} nonce: ${ord.nonce} owner: ${ord.owner} tokenIn: ${`${ord.tokenIn}`.substring(0,5)}...${`${ord.tokenIn}`.substring(36)} tokenOut: ${`${ord.tokenOut}`.substring(0,5)}...${`${ord.tokenOut}`.substring(36)} limit_price: ${ord.limit_price} stop_price: ${ord.stop_price} size: ${ord.size} block_submitted: ${ord.block_submitted} numOfsplits: ${ord.numOfsplits} order_type: ${ord.order_type} positionAr: ${ord.positionAr} dcaBlockInterval: ${ord.dcaBlockInterval}`);

		if (ord.owner.toLowerCase()===mm_account.toLowerCase()) 
		{
			const _size = Number(ethers.utils.formatUnits( ord.size, token_decimals[ord.tokenIn])).toFixed(3);
			account_bracketOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price:  Number(ord.limit_price)/1000000, stop_price:  Number(ord.stop_price)/1000000, size: _size, block_submitted: ord.block_submitted, numOfsplits: "N/A", order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: "N/A" });
		}
		all_bracketOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: ord.limit_price, stop_price: ord.stop_price, size: ord.size, block_submitted: ord.block_submitted, numOfsplits: ord.numOfsplits, order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: ord.dcaBlockInterval });
		
	}

	let dcaOrdersArray =  await OrdersManager_instance.get_dcaOrdersArray();
	for (let i=0; i<dcaOrdersArray.length; i++)
	{
		let ord =  await OrdersManager_instance.Orders(dcaOrdersArray[i]);
		// console.log(` =-----> dcaOrdersArray[${i}]    : ${dcaOrdersArray[i]} nonce: ${ord.nonce} owner: ${ord.owner} tokenIn: ${`${ord.tokenIn}`.substring(0,5)}...${`${ord.tokenIn}`.substring(36)} tokenOut: ${`${ord.tokenOut}`.substring(0,5)}...${`${ord.tokenOut}`.substring(36)} limit_price: ${ord.limit_price} stop_price: ${ord.stop_price} size: ${ord.size} block_submitted: ${ord.block_submitted} numOfsplits: ${ord.numOfsplits} order_type: ${ord.order_type} positionAr: ${ord.positionAr} dcaBlockInterval: ${ord.dcaBlockInterval}`);

		if (ord.owner.toLowerCase()===mm_account.toLowerCase()) 
		{
			const _size = Number(ethers.utils.formatUnits( ord.size, token_decimals[ord.tokenIn])).toFixed(3);
			account_dcaOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: "N/A", stop_price: "N/A", size: _size, block_submitted: ord.block_submitted, numOfsplits: ord.numOfsplits, order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: ord.dcaBlockInterval });
		}
		all_dcaOrdersArray.push({ nonce: ord.nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: ord.limit_price, stop_price: ord.stop_price, size: ord.size, block_submitted: ord.block_submitted, numOfsplits: ord.numOfsplits, order_type: ord.order_type, positionAr: ord.positionAr, dcaBlockInterval: ord.dcaBlockInterval });

	}
    // console.log(`********************* OrdersManager_instance OPEN WORKING ORDERS End ***********************************`);
	return { account_limitOrdersArray, account_stopOrdersArray, account_bracketOrdersArray, account_dcaOrdersArray, all_limitOrdersArray, all_stopOrdersArray, all_bracketOrdersArray, all_dcaOrdersArray };
}


const get_ExecutionsPendingOrderBook_Moonbeam = async () => {
    // console.log(`********************* ExecutionOrdersEngineMoonbeam_instance Start ***********************************`);
	let all_QueuedForExecutionOrder_Moonbeam=[];
	let pendingOrders_MOONBEAM =  await ExecutionOrdersEngineMoonbeam_instance.get_pendingOrders_MOONBEAM();
	for (let i=0; i<pendingOrders_MOONBEAM.length; i++)
	{
		let ord =  await ExecutionOrdersEngineMoonbeam_instance.Orders(pendingOrders_MOONBEAM[i]);
		// console.log(` =-----> pendingOrders_MOONBEAM[${i}]: ${pendingOrders_MOONBEAM[i]}  engine_nonce: ${ord.engine_nonce} origin_nonce: ${ord.origin_nonce} owner: ${ord.owner} tokenIn:${`${ord.tokenIn}`.substring(0,5)}...${`${ord.tokenIn}`.substring(36)} tokenOut:${`${ord.tokenOut}`.substring(0,5)}...${`${ord.tokenOut}`.substring(36)} limit_price: ${ord.limit_price} stop_price: ${ord.stop_price} size: ${ord.size} block_submitted: ${ord.block_submitted} order_type: ${ord.order_type} positionAr: ${ord.positionAr}`);
		all_QueuedForExecutionOrder_Moonbeam.push({ engine_nonce: ord.engine_nonce,  origin_nonce: ord.origin_nonce, owner: ord.owner, tokenIn: token_Symbol[ord.tokenIn], tokenOut: token_Symbol[ord.tokenOut], limit_price: ord.limit_price, stop_price: ord.stop_price, size: ord.size, block_submitted: ord.block_submitted, order_type: ord.order_type, positionAr: ord.positionAr });
	}
	// console.log(`********************* ExecutionOrdersEngineMoonbeam_instance End ***********************************`);
	return {all_QueuedForExecutionOrder_Moonbeam,};
}

// userChain can be "MOONBEAM","FANTOM"
const registerUser_Moonbeam = async () => {

	let isUserRegistered =  await UsersRegistryMoonbeam_instance.isUserRegistered(mm_account);
	console.log(`registerUser_Moonbeam is run from userChain: ${userChain} for account: ${mm_account} isUserRegistered: ${isUserRegistered}`);

    return new Promise (async (resolve,reject) => {
		if (userChain==="MOONBEAM")
		{
			if (!isUserRegistered)
			{
				const user_UsersRegistryMoonbeam_instance =  new ethers.Contract( usersRegistry_Moonbeam_address, usersRegistry_Moonbeam_raw.abi, wallet);
				
				const tx_register_user =  await user_UsersRegistryMoonbeam_instance.registerUser( mm_account, mm_account, "MOONBEAM", mm_account, "01f0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e00");
				tx_register_user.wait().then( async reslveMsg => {
					console.log(`tx_register_user is mined resolveMsg : `,reslveMsg);
		
					const userStruct =  await UsersRegistryMoonbeam_instance.users(mm_account);
					isUserRegistered =  await UsersRegistryMoonbeam_instance.isUserRegistered(mm_account);
					console.log(`isUserRegistered: ${isUserRegistered} userStruct: `,userStruct);
					// isUserRegistered: true userStruct:  [
					//     '0x8aC171C7BEa586d84C166BECdd6284B05A682000',
					//     '0x8aC171C7BEa586d84C166BECdd6284B05A682000',
					//     'MOONBEAM',
					//     '0x8aC171C7BEa586d84C166BECdd6284B05A682000',
					//     '01f0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e00',
					//     userEVMAddress: '0x8aC171C7BEa586d84C166BECdd6284B05A682000',
					//     userEVMAddressString: '0x8aC171C7BEa586d84C166BECdd6284B05A682000',
					//     userChain: 'MOONBEAM',
					//     userSubstrateAddressString: '0x8aC171C7BEa586d84C166BECdd6284B05A682000',
					//     usererHex: '01f0f4360fc5dbb8cd7107edf24fc3f3c9ef3914b32585062bfd7aa84e02f8b84e00'
					//   ]
		
					resolve(reslveMsg);
				});
			}
			else {
				console.log(`User ${mm_account} is already registered`);
				resolve(null);
			}

		}
		else 
		{
			console.log(`User ${mm_account} will be registered automatically via AxelarMoonbeamSatelite sc`);
			resolve(`User ${mm_account} will be registered automatically via AxelarMoonbeamSatelite sc`);
		}

	})

};



const submitOrder_Moonbeam = async (tokenIn="USDC_M", tokenOut="DOT", _limitPrice="20", _stopPrice="0", _size="23", num_Ofsplits="0", orderType="1", dcaBlockInterval="0" ) => {
	console.log(`submitOrder_Moonbeam is run`);
	let tokenInAddress  = token_Address[tokenIn];
	let tokenOutAddress = token_Address[tokenOut];

	const limitPrice = ethers.utils.parseUnits( _limitPrice, 6 );
	const stopPrice = ethers.utils.parseUnits( _stopPrice, 6 );

	 
	//REGISTER USER
	const registerMessage = await registerUser_Moonbeam();
	console.log(`submitOrder_Moonbeam USER IS NOW REGISTERED registerMessage: `,registerMessage);
	
	//FORMAT SIZE
	const sizeWEI =  ethers.utils.parseUnits( _size, token_decimals[tokenInAddress]);

	let approve_sizeWEI;
	if (orderType==="4") //DCA
	{
		approve_sizeWEI =  ethers.utils.parseUnits( `${Number(_size) * Number(num_Ofsplits)}` , token_decimals[tokenInAddress]);
	}
	else approve_sizeWEI = sizeWEI;
	

    return new Promise (async (resolve,reject) => {

		if (userChain==="MOONBEAM")
		{

			const erc20 =  new ethers.Contract( tokenInAddress, IERC20_raw.abi, wallet);
			const allowance = await erc20.allowance(mm_account, executionOrdersEngine_Moonbeam_address );
			const futureAllowance = allowance.add( approve_sizeWEI );
			const balanceWEI = await erc20.balanceOf(mm_account);
			console.log(`submitOrder_Moonbeam for tokenIn allowance was: ${allowance} and it will now become ${typeof futureAllowance} ${typeof balanceWEI} futureAllowance: ${futureAllowance} balanceWEI: ${balanceWEI}`);

			if ( futureAllowance.gt(balanceWEI) )
			{
				console.log(`NOT ENOUGH BALANCE`);
				console.log(`THE ORDER WILL NOT BE SUBMITTED`);
				console.log(` `);
				reject("Not enough BalaNce. The order will not be submitted !!! ");
			}

			
			const tx2 = await erc20.approve(executionOrdersEngine_Moonbeam_address, futureAllowance );
			tx2.wait().then( async reslveMsg => {
				console.log(`tx2 fro approval is mined resolveMsg : `,reslveMsg);

				const allowance = await erc20.allowance(mm_account, executionOrdersEngine_Moonbeam_address );
				console.log(`submitOrder_Moonbeam for tokenIn NEW allowance: ${allowance}`);

				console.log(`***** Submiting Limit Order ****`);
				const user_OrdersManager_instance =  new ethers.Contract( ordersManager_Moonbeam_address, ordersManager_Moonbeam_raw.abi, wallet);

				console.log(`***** Submiting Limit Order ****`);
				console.log(` `);
				console.log(`***** READY TO SUBMIT tokenInAddress: ${tokenInAddress} tokenOutAddress: ${tokenOutAddress} ****`);
				console.log(`***** READY TO SUBMIT limitPrice: ${limitPrice} stopPrice: ${stopPrice} sizeWEI: ${sizeWEI} num_Ofsplits: ${num_Ofsplits} orderType: ${orderType} dcaBlockInterval: ${dcaBlockInterval} ****`);
				console.log(` `);
				console.log(`***** Submiting Limit Order ****`);

				// resolve("ALL G O O D");

				const gasEstimate = await user_OrdersManager_instance.estimateGas.submit_Order( mm_account, tokenInAddress, tokenOutAddress, limitPrice, stopPrice, sizeWEI, num_Ofsplits, orderType, dcaBlockInterval ); 
				const gasPremium = gasEstimate.mul(130).div(100);
				console.log(`tx_submit_order => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

				// const tx_submit_order =  await user_OrdersManager_instance.submit_Order( mm_account, tokenInAddress, tokenOutAddress, limitPrice, stopPrice, sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { gasLimit: gasPremium }  );
				// tx_submit_order.wait().then( async reslveMsg => {
				// 	console.log(` ===--------> tx_submit_order is mined resolveMsg : `,reslveMsg);

				//  	resolve(reslveMsg);
				// });

				try {
					const tx_submit_order =  await user_OrdersManager_instance.submit_Order( mm_account, tokenInAddress, tokenOutAddress, limitPrice, stopPrice, sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { gasLimit: gasPremium }  );
					const receipt = await tx_submit_order.wait(); 
					if (receipt.status === false) {
					  throw new Error("Transaction tx_submit_order failed");
					}
					// console.log(` ===--------> tx_submit_order is mined resolveMsg : `,reslveMsg);
					resolve(`*** OrdersManager_instance tx_submit_order is mined ***`);
				}
				catch (e) {
					console.log(` * while  OrdersManager_instance tx_submit_order an error occured * Error: `,e);
					resolve(` * while  OrdersManager_instance tx_submit_order an error occured  * `);
				}
			
			});


		}
		else if (userChain==="FANTOM")
		{
			const user_AxelarFantomSatelite_instance =  new ethers.Contract( axelarFantomSatelite_address, axelarFantomSatelite_raw.abi, wallet);
			
			if (tokenIn==="USDC_M")
			{
				console.log(` ****> submitOrder_Moonbeam -> userChain: ${userChain} tokenIn: ${tokenIn} tokenOut: ${tokenOut} tokenInAddress: ${tokenInAddress}`);
				const axlUSDC =  new ethers.Contract( axlUSDC_Fantom_address, IERC20_raw.abi, wallet);
				const allowance = await axlUSDC.allowance(mm_account, axelarFantomSatelite_address );
				const futureAllowance = allowance.add( approve_sizeWEI );
				const balanceWEI = await axlUSDC.balanceOf(mm_account);
				console.log(`****> submitOrder_Moonbeam -> userChain: ${userChain}  for tokenIn allowance was: ${allowance} and it will now become futureAllowance: ${futureAllowance} balanceWEI: ${balanceWEI}`);
	
				if ( futureAllowance.gt(balanceWEI) )
				{
					console.log(`NOT ENOUGH BALANCE`);
					console.log(`THE ORDER WILL NOT BE SUBMITTED`);
					console.log(` `);
					reject("Not enough BalaNce. The order will not be submitted !!! ");
				}

				const tx2 = await axlUSDC.approve(axelarFantomSatelite_address, futureAllowance );
				tx2.wait().then( async reslveMsg => {
					console.log(`****> submitOrder_Moonbeam -> userChain: ${userChain} tx2 from approval is mined resolveMsg : `,reslveMsg);
	
					const allowance = await axlUSDC.allowance(mm_account, axelarFantomSatelite_address );
					console.log(`submitOrder_Moonbeam for tokenIn NEW allowance: ${allowance}`);
					console.log(`***** Submiting Order ****`);
					console.log(`***** READY TO SUBMIT tokenInAddress: ${tokenInAddress} tokenOutAddress: ${tokenOutAddress} ****`);
					console.log(`***** READY TO SUBMIT limitPrice: ${limitPrice} stopPrice: ${stopPrice} sizeWEI: ${sizeWEI} num_Ofsplits: ${num_Ofsplits} orderType: ${orderType} dcaBlockInterval: ${dcaBlockInterval} ****`);
					console.log(`***** Submiting Order ****`);

					const gasEstimate = await user_AxelarFantomSatelite_instance.estimateGas.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_fantom_fee) } ); 
					const gasPremium = gasEstimate.mul(130).div(100);
					console.log(`tx_submit_order => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

					// resolve("ALL G O O D 1");
	
					try {
						const tx_submit_order =  await user_AxelarFantomSatelite_instance.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_fantom_fee), gasLimit: gasPremium }  );
						const receipt = await tx_submit_order.wait(); 
						if (receipt.status === false) {
						  throw new Error("Transaction tx_submit_order failed");
						}
						resolve(`*** user_AxelarFantomSatelite_instance tx_submit_order is mined ***`);
					}
					catch (e) {
						console.log(` * while  user_AxelarFantomSatelite_instance tx_submit_order an error occured * Error: `,e);
						resolve(` * while  user_AxelarFantomSatelite_instance tx_submit_order an error occured  * `);
					}
				
				});

			}
			else if (tokenOut==="USDC_M" && (tokenIn==="DOT" || tokenIn==="WGLMR" || tokenIn==="ASTR"))
			{
				let _sizeWEI = sizeWEI;
				let account_tokenIn_balance;
				if (tokenIn==="DOT")
				{
					account_tokenIn_balance = await ExecutionOrdersEngineFromFantom_instance.userBalance(mm_account,xcDOT_address);
				}
                else if (tokenIn==="WGLMR")
				{
					account_tokenIn_balance = await ExecutionOrdersEngineFromFantom_instance.userBalance(mm_account,WGLMR_address);
				}
				else if (tokenIn==="ASTR")
				{
					account_tokenIn_balance = await ExecutionOrdersEngineFromFantom_instance.userBalance(mm_account,xcASTR_address);
				}
				
				console.log(`***** account_tokenIn_balance: ${account_tokenIn_balance} ****`);

				if (sizeWEI.gt(account_tokenIn_balance)) _sizeWEI = account_tokenIn_balance;

				if (_sizeWEI.isZero())
				{
					console.log(`***** Submiting Order SIZE CANNOT BE ZERO _sizeWEI: ${_sizeWEI} ****`);
					resolve(`***** Submiting Order SIZE CANNOT BE ZERO _sizeWEI: ${_sizeWEI} ****`);
					return;
				}


				console.log(`***** Submiting Order account_tokenIn_balance: ${account_tokenIn_balance} ****`);
				console.log(`***** READY TO SUBMIT tokenInAddress: ${tokenInAddress} tokenOutAddress: ${tokenOutAddress} ****`);
				console.log(`***** READY TO SUBMIT limitPrice: ${limitPrice} stopPrice: ${stopPrice} _sizeWEI: ${_sizeWEI} sizeWEI: ${sizeWEI} num_Ofsplits: ${num_Ofsplits} orderType: ${orderType} dcaBlockInterval: ${dcaBlockInterval} ****`);
				console.log(`***** Submiting Order ****`);


				const gasEstimate = await user_AxelarFantomSatelite_instance.estimateGas.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, _sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_fantom_fee) } ); 
				const gasPremium = gasEstimate.mul(130).div(100);
				console.log(`tx_submit_order => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);


				// resolve("ALL G O O D  2");
	
				try {
					const tx_submit_order =  await user_AxelarFantomSatelite_instance.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, _sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_fantom_fee), gasLimit: gasPremium }  );
					const receipt = await tx_submit_order.wait(); 
					if (receipt.status === false) {
					  throw new Error("Transaction tx_submit_order failed");
					}
					resolve(`*** user_AxelarFantomSatelite_instance tx_submit_order is mined ***`);
				}
				catch (e) {
					console.log(` * while  user_AxelarFantomSatelite_instance tx_submit_order an error occured * Error: `,e);
					resolve(` * while  user_AxelarFantomSatelite_instance tx_submit_order an error occured  * `);
				}

			}

		}



		else if (userChain==="BINANCE")
		{
			const user_AxelarBinanceSatelite_instance =  new ethers.Contract( axelarBinanceSatelite_address, axelarBinanceSatelite_raw.abi, wallet);
			
			if (tokenIn==="USDC_M")
			{
				console.log(` ****> submitOrder_Moonbeam -> userChain: ${userChain} tokenIn: ${tokenIn} tokenOut: ${tokenOut} tokenInAddress: ${tokenInAddress}`);
				const axlUSDC =  new ethers.Contract( axlUSDC_Binance_address, IERC20_raw.abi, wallet);
				const allowance = await axlUSDC.allowance(mm_account, axelarBinanceSatelite_address );
				const futureAllowance = allowance.add( approve_sizeWEI );
				const balanceWEI = await axlUSDC.balanceOf(mm_account);
				console.log(`****> submitOrder_Moonbeam -> userChain: ${userChain}  for tokenIn allowance was: ${allowance} and it will now become futureAllowance: ${futureAllowance} balanceWEI: ${balanceWEI}`);
	
				if ( futureAllowance.gt(balanceWEI) )
				{
					console.log(`NOT ENOUGH BALANCE`);
					console.log(`THE ORDER WILL NOT BE SUBMITTED`);
					console.log(` `);
					reject("Not enough BalaNce. The order will not be submitted !!! ");
				}

				const tx2 = await axlUSDC.approve(axelarBinanceSatelite_address, futureAllowance );
				tx2.wait().then( async reslveMsg => {
					console.log(`****> submitOrder_Moonbeam -> userChain: ${userChain} tx2 from approval is mined resolveMsg : `,reslveMsg);
	
					const allowance = await axlUSDC.allowance(mm_account, axelarBinanceSatelite_address );
					console.log(`submitOrder_Moonbeam for tokenIn NEW allowance: ${allowance}`);
					console.log(`***** Submiting Order ****`);
					console.log(`***** READY TO SUBMIT tokenInAddress: ${tokenInAddress} tokenOutAddress: ${tokenOutAddress} ****`);
					console.log(`***** READY TO SUBMIT limitPrice: ${limitPrice} stopPrice: ${stopPrice} sizeWEI: ${sizeWEI} num_Ofsplits: ${num_Ofsplits} orderType: ${orderType} dcaBlockInterval: ${dcaBlockInterval} ****`);
					console.log(`***** Submiting Order ****`);

					const gasEstimate = await user_AxelarBinanceSatelite_instance.estimateGas.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_binance_fee) } ); 
					const gasPremium = gasEstimate.mul(130).div(100);
					console.log(`tx_submit_order => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

					// resolve("ALL G O O D 1");
	
					try {
						const tx_submit_order =  await user_AxelarBinanceSatelite_instance.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_binance_fee), gasLimit: gasPremium }  );
						const receipt = await tx_submit_order.wait(); 
						if (receipt.status === false) {
						  throw new Error("Transaction tx_submit_order failed");
						}
						resolve(`*** user_AxelarBinanceSatelite_instance tx_submit_order is mined ***`);
					}
					catch (e) {
						console.log(` * while  user_AxelarBinanceSatelite_instance tx_submit_order an error occured * Error: `,e);
						resolve(` * while  user_AxelarBinanceSatelite_instance tx_submit_order an error occured  * `);
					}
				
				});

			}
			else if (tokenOut==="USDC_M" && (tokenIn==="DOT" || tokenIn==="WGLMR" || tokenIn==="ASTR"))
			{
				let _sizeWEI = sizeWEI;
				let account_tokenIn_balance;
				if (tokenIn==="DOT")
				{
					account_tokenIn_balance = await ExecutionOrdersEngineFromBinance_instance.userBalance(mm_account,xcDOT_address);
				}
                else if (tokenIn==="WGLMR")
				{
					account_tokenIn_balance = await ExecutionOrdersEngineFromBinance_instance.userBalance(mm_account,WGLMR_address);
				}
				else if (tokenIn==="ASTR")
				{
					account_tokenIn_balance = await ExecutionOrdersEngineFromBinance_instance.userBalance(mm_account,xcASTR_address);
				}
				
				console.log(`***** account_tokenIn_balance: ${account_tokenIn_balance} ****`);

				if (sizeWEI.gt(account_tokenIn_balance)) _sizeWEI = account_tokenIn_balance;

				if (_sizeWEI.isZero())
				{
					console.log(`***** Submiting Order SIZE CANNOT BE ZERO _sizeWEI: ${_sizeWEI} ****`);
					resolve(`***** Submiting Order SIZE CANNOT BE ZERO _sizeWEI: ${_sizeWEI} ****`);
					return;
				}


				console.log(`***** Submiting Order account_tokenIn_balance: ${account_tokenIn_balance} ****`);
				console.log(`***** READY TO SUBMIT tokenInAddress: ${tokenInAddress} tokenOutAddress: ${tokenOutAddress} ****`);
				console.log(`***** READY TO SUBMIT limitPrice: ${limitPrice} stopPrice: ${stopPrice} _sizeWEI: ${_sizeWEI} sizeWEI: ${sizeWEI} num_Ofsplits: ${num_Ofsplits} orderType: ${orderType} dcaBlockInterval: ${dcaBlockInterval} ****`);
				console.log(`***** Submiting Order ****`);


				const gasEstimate = await user_AxelarBinanceSatelite_instance.estimateGas.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, _sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_binance_fee) } ); 
				const gasPremium = gasEstimate.mul(130).div(100);
				console.log(`tx_submit_order => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);


				// resolve("ALL G O O D  2");
	
				try {
					const tx_submit_order =  await user_AxelarBinanceSatelite_instance.submitOrderTo_Moonbeam( tokenInAddress, tokenOutAddress, limitPrice, stopPrice, _sizeWEI, num_Ofsplits, orderType, dcaBlockInterval, { value: ethers.utils.parseEther(axelar_binance_fee), gasLimit: gasPremium }  );
					const receipt = await tx_submit_order.wait(); 
					if (receipt.status === false) {
					  throw new Error("Transaction tx_submit_order failed");
					}
					resolve(`*** user_AxelarBinanceSatelite_instance tx_submit_order is mined ***`);
				}
				catch (e) {
					console.log(` * while  user_AxelarBinanceSatelite_instance tx_submit_order an error occured * Error: `,e);
					resolve(` * while  user_AxelarBinanceSatelite_instance tx_submit_order an error occured  * `);
				}

			}

		}

	})

};


const deleteOrder_Moonbeam = async (orderNonce,_size,tokenIn) => {
	console.log(`deleteOrder_Moonbeam is run for orderNonce: ${orderNonce}`);
	console.log(`********************* OrdersManager_instance DELETE ORDER Start orderNonce: ${orderNonce} orderSize: ${_size} tokenIn: ${tokenIn} ***********************************`);
    
	return new Promise (async (resolve,reject) => {

		const tokenInAddress  = token_Address[tokenIn];
		const sizeWEI =  ethers.utils.parseUnits( _size, token_decimals[tokenInAddress]);

		if (userChain==="MOONBEAM")
		{
			const erc20 =  new ethers.Contract( tokenInAddress, IERC20_raw.abi, wallet);
			const allowance = await erc20.allowance(mm_account, ordersManager_Moonbeam_address );

			if ( allowance.gt(sizeWEI) )
			{
				const futureAllowance = allowance.sub(sizeWEI);

				const tx2 = await erc20.approve(ordersManager_Moonbeam_address, futureAllowance );
				tx2.wait().then( async reslveMsg => {
					console.log(`tx2 fro approval is mined resolveMsg : `,reslveMsg);

					const allowance = await erc20.allowance(mm_account, ordersManager_Moonbeam_address );
					console.log(`submitOrder_Moonbeam for tokenIn NEW allowance: ${allowance}`);
				});

			}

			const user_OrdersManager_instance =  new ethers.Contract( ordersManager_Moonbeam_address, ordersManager_Moonbeam_raw.abi, wallet);

			const gasEstimate = await user_OrdersManager_instance.estimateGas.delete_Order( orderNonce ); //ethers.BigNumber.from( "300000" ); 
			const gasPremium = gasEstimate.mul(130).div(100);
			console.log(`deleteOrder_Moonbeam => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

			try {
				const tx_delete_order =  await user_OrdersManager_instance.delete_Order( orderNonce, { gasLimit: gasPremium } );
				const receipt = await tx_delete_order.wait(); 
				if (receipt.status === false) {
				throw new Error("Transaction tx_delete_order failed");
				}
				console.log(`*** OrdersManager_instance DELETE ORDER End is mined orderNonce: ${orderNonce} *** `);
				resolve(`*** OrdersManager_instance DELETE ORDER End is mined orderNonce: ${orderNonce} ***`);
			}
			catch (e) {
				console.log(` * while  OrdersManager_instance DELETE ORDER orderNonce: ${orderNonce} an error occured * Error: `,e);
				resolve(` * while  OrdersManager_instance DELETE ORDER orderNonce: ${orderNonce} an error occured * `);
			}

		}
		else if (userChain==="FANTOM")
		{

			const user_AxelarFantomSatelite_instance =  new ethers.Contract( axelarFantomSatelite_address, axelarFantomSatelite_raw.abi, wallet);
			
			if (tokenIn==="USDC_M")
			{
				console.log(` ****> deleteOrder_Moonbeam tokenIn: -> userChain: ${userChain} tokenIn: ${tokenIn}`);

				const axlUSDC =  new ethers.Contract( axlUSDC_Fantom_address, IERC20_raw.abi, wallet);
				const allowance = await axlUSDC.allowance(mm_account, axelarFantomSatelite_address );
				console.log(`****> deleteOrder_Moonbeam -> userChain: ${userChain} allowance: ${allowance}`);

				if ( allowance.gt(sizeWEI) )
				{
					const futureAllowance = allowance.sub(sizeWEI);
	
					const tx2 = await axlUSDC.approve(axelarFantomSatelite_address, futureAllowance );
					tx2.wait().then( async reslveMsg => {
						console.log(`****> deleteOrder_Moonbeam -> userChain: ${userChain} tx2 from approval is mined resolveMsg : `,reslveMsg);

						const allowance = await axlUSDC.allowance(mm_account, axelarFantomSatelite_address );
						console.log(`****> deleteOrder_Moonbeam -> userChain: ${userChain} NEW allowance: ${allowance}`);
					});
				}


				const gasEstimate = await user_AxelarFantomSatelite_instance.estimateGas.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_fantom_fee) } ); 
				const gasPremium = gasEstimate.mul(130).div(100);
				console.log(`***> deleteOrder_Moonbeam -> userChain: ${userChain} => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

				// resolve("ALL G O O D 3");

				try {
					const tx_delete_order =  await user_AxelarFantomSatelite_instance.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_fantom_fee) } );
					const receipt = await tx_delete_order.wait(); 
					if (receipt.status === false) {
					  throw new Error("Transaction tx_delete_order failed");
					}
					resolve(`*** user_AxelarFantomSatelite_instance tx_delete_order is mined ***`);
				}
				catch (e) {
					console.log(` * while  user_AxelarFantomSatelite_instance tx_delete_order an error occured * Error: `,e);
					resolve(` * while  user_AxelarFantomSatelite_instance tx_delete_order an error occured  * `);
				}

			}
			else
			{
				console.log(` ****> deleteOrder_Moonbeam tokenIn: -> userChain: ${userChain} tokenIn: ${tokenIn}`);

				const gasEstimate = await user_AxelarFantomSatelite_instance.estimateGas.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_fantom_fee) } ); 
				const gasPremium = gasEstimate.mul(130).div(100);
				console.log(`***> deleteOrder_Moonbeam -> userChain: ${userChain} => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

				// resolve("ALL G O O D 4");

				try {
					const tx_delete_order =  await user_AxelarFantomSatelite_instance.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_fantom_fee) } );
					const receipt = await tx_delete_order.wait(); 
					if (receipt.status === false) {
					  throw new Error("Transaction tx_delete_order failed");
					}
					resolve(`*** user_AxelarFantomSatelite_instance tx_delete_order is mined ***`);
				}
				catch (e) {
					console.log(` * while  user_AxelarFantomSatelite_instance tx_delete_order an error occured * Error: `,e);
					resolve(` * while  user_AxelarFantomSatelite_instance tx_delete_order an error occured  * `);
				}
			}

		}





		else if (userChain==="BINANCE")
		{

			const user_AxelarBinanceSatelite_instance =  new ethers.Contract( axelarBinanceSatelite_address, axelarBinanceSatelite_raw.abi, wallet);
			
			if (tokenIn==="USDC_M")
			{
				console.log(` ****> deleteOrder_Moonbeam tokenIn: -> userChain: ${userChain} tokenIn: ${tokenIn}`);

				const axlUSDC =  new ethers.Contract( axlUSDC_Binance_address, IERC20_raw.abi, wallet);
				const allowance = await axlUSDC.allowance(mm_account, axelarBinanceSatelite_address );
				console.log(`****> deleteOrder_Moonbeam -> userChain: ${userChain} allowance: ${allowance}`);

				if ( allowance.gt(sizeWEI) )
				{
					const futureAllowance = allowance.sub(sizeWEI);
	
					const tx2 = await axlUSDC.approve(axelarBinanceSatelite_address, futureAllowance );
					tx2.wait().then( async reslveMsg => {
						console.log(`****> deleteOrder_Moonbeam -> userChain: ${userChain} tx2 from approval is mined resolveMsg : `,reslveMsg);

						const allowance = await axlUSDC.allowance(mm_account, axelarBinanceSatelite_address );
						console.log(`****> deleteOrder_Moonbeam -> userChain: ${userChain} NEW allowance: ${allowance}`);
					});
				}


				const gasEstimate = await user_AxelarBinanceSatelite_instance.estimateGas.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_binance_fee) } ); 
				const gasPremium = gasEstimate.mul(130).div(100);
				console.log(`***> deleteOrder_Moonbeam -> userChain: ${userChain} => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

				// resolve("ALL G O O D 3");

				try {
					const tx_delete_order =  await user_AxelarBinanceSatelite_instance.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_binance_fee) } );
					const receipt = await tx_delete_order.wait(); 
					if (receipt.status === false) {
					  throw new Error("Transaction tx_delete_order failed");
					}
					resolve(`*** user_AxelarBinanceSatelite_instance tx_delete_order is mined ***`);
				}
				catch (e) {
					console.log(` * while  user_AxelarBinanceSatelite_instance tx_delete_order an error occured * Error: `,e);
					resolve(` * while  user_AxelarBinanceSatelite_instance tx_delete_order an error occured  * `);
				}

			}
			else
			{
				console.log(` ****> deleteOrder_Moonbeam tokenIn: -> userChain: ${userChain} tokenIn: ${tokenIn}`);

				const gasEstimate = await user_AxelarBinanceSatelite_instance.estimateGas.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_binance_fee) } ); 
				const gasPremium = gasEstimate.mul(130).div(100);
				console.log(`***> deleteOrder_Moonbeam -> userChain: ${userChain} => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

				// resolve("ALL G O O D 4");

				try {
					const tx_delete_order =  await user_AxelarBinanceSatelite_instance.cancelOrderTo_Moonbeam( orderNonce, { value: ethers.utils.parseEther(axelar_binance_fee) } );
					const receipt = await tx_delete_order.wait(); 
					if (receipt.status === false) {
					  throw new Error("Transaction tx_delete_order failed");
					}
					resolve(`*** user_AxelarBinanceSatelite_instance tx_delete_order is mined ***`);
				}
				catch (e) {
					console.log(` * while  user_AxelarBinanceSatelite_instance tx_delete_order an error occured * Error: `,e);
					resolve(` * while  user_AxelarBinanceSatelite_instance tx_delete_order an error occured  * `);
				}
			}

		}

	});

};


const checkLimitOrders = async () => {
	return new Promise (async (resolve,reject) => {

		console.log(`*********************  checkLimitOrders Start ***********************************`);
		const gasEstimate = await OrdersManager_instance.estimateGas.checkLimitOrders();
		const gasPremium = gasEstimate.mul(130).div(100);
		console.log(`checkLimitOrders => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

		try {
			const tx_checkLimitOrders =  await OrdersManager_instance.checkLimitOrders({ gasLimit: gasPremium });
			const receipt = await tx_checkLimitOrders.wait(); 
			if (receipt.status === false) {
			throw new Error("Transaction checkLimitOrders failed");
			}
			console.log(`***  checkLimitOrders End ***`);
			resolve(`***  checkLimitOrders End ***`);
		}
		catch (e) {
			console.log(` *** while  checkLimitOrders an error occured *** Error: `,e);
			resolve(` *** while  checkLimitOrders an error occured *** `);
		}
	});

}
const checkStopOrders = async () => {
	return new Promise (async (resolve,reject) => {

		console.log(`*********************  checkStopOrders Start ***********************************`);
		const gasEstimate = await OrdersManager_instance.estimateGas.checkStopOrders();
		const gasPremium = gasEstimate.mul(130).div(100);
		console.log(`checkStopOrders => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

		try {
			const tx_checkStopOrders =  await OrdersManager_instance.checkStopOrders({ gasLimit: gasPremium });
			const receipt = await tx_checkStopOrders.wait();
			if (receipt.status === false) {
				throw new Error("Transaction checkStopOrders failed");
			}
			console.log(`*********************  checkStopOrders End ***********************************`);
			resolve(`***  checkStopOrders End ***`);
		}
		catch (e) {
			console.log(` ********** while  checkStopOrders an error occured ********** Error: `,e);
			resolve(` *** while  checkStopOrders an error occured *** `);
		}
	});

}
const checkBracketOrders = async () => {
	return new Promise (async (resolve,reject) => {

		console.log(`*********************  checkBracketOrders Start ***********************************`);
		const gasEstimate = await OrdersManager_instance.estimateGas.checkBracketOrders();
		const gasPremium = gasEstimate.mul(130).div(100);
		console.log(`checkBracketOrders => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

		try {
			const tx_checkBracketOrders =  await OrdersManager_instance.checkBracketOrders({ gasLimit: gasPremium });
			const receipt = await tx_checkBracketOrders.wait();
			if (receipt.status === false) {
			throw new Error("Transaction checkBracketOrders failed");
			}
			console.log(`*********************  checkBracketOrders End ***********************************`);
			resolve(`***  checkBracketOrders End ***`);
		}
		catch (e) {
			console.log(` ********** while  checkBracketOrders an error occured ********** Error: `,e);
			resolve(` *** while  checkBracketOrders an error occured *** `);
		}
	});

}
const checkDCAOrders = async () => {
	return new Promise (async (resolve,reject) => {

		console.log(`*********************  checkDCAOrders Start ***********************************`);
		const gasEstimate = await OrdersManager_instance.estimateGas.checkDCAOrders();
		const gasPremium = gasEstimate.mul(130).div(100);
		console.log(`checkDCAOrders => gasEstimate: ${gasEstimate} gasPremium: ${gasPremium}`);

		try {
			const tx_checkDCAOrders =  await OrdersManager_instance.checkDCAOrders({ gasLimit: gasPremium });
			const receipt = await tx_checkDCAOrders.wait();
			if (receipt.status === false) {
			throw new Error("Transaction checkDCAOrders failed");
			}
			console.log(` => checkDCAOrders has updated successfuly at ${new Date()}`);
			resolve(`***  checkDCAOrders End ***`);
		}
		catch (e) {
			console.log(` ********** while  checkDCAOrders an error occured ********** Error: `,e);
			resolve(` *** while  checkDCAOrders an error occured *** `);
		}
	});

}


// ====>
const executeORDERSMoonbeam = async () => {
	return new Promise (async (resolve,reject) => {

		console.log(`*********************  executeORDERSMoonbeam Start ***********************************`);
		try {
			const pendingOrders_MOONBEAM =  await ExecutionOrdersEngineMoonbeam_instance.get_pendingOrders_MOONBEAM();
			for (let i=0; i<pendingOrders_MOONBEAM.length; i++) console.log(`* pendingOrders_MOONBEAM[${i}]: ${pendingOrders_MOONBEAM[i]}`);
			
		
			for (let i=0; i<pendingOrders_MOONBEAM.length; i++)
			{
				const orderNonce = pendingOrders_MOONBEAM[i];
				console.log(`********************* Will execute Moonbeam Order with nonce: ${orderNonce}`);
				const message = await execute_Order_Moonbeam(orderNonce);
				console.log(`********************* Executed Moonbeam Order with nonce: ${orderNonce} message: `,message);
			}
			resolve(`***  executeORDERSMoonbeam End ***`);
		}
		catch (e) {
			console.log(` ********** while  executeORDERSMoonbeam an error occured ********** Error: `,e);
			resolve(`***  while  executeORDERSMoonbeam an error occured ***`);

		}
		console.log(`*********************  executeORDERSMoonbeam End ***********************************`);
	});

}

const execute_Order_Moonbeam = async (orderNonce) => {
	return new Promise (async (resolve,reject) => {

		console.log(`*********************  execute_Order_Moonbeam Start ***********************************`);
		const gasEstimate = await ExecutionOrdersEngineMoonbeam_instance.estimateGas.executeOrder_Moonbeam( orderNonce ); 
		const gasPremium = gasEstimate.mul(130).div(100);
		console.log(`gasEstimate: ${gasEstimate} gasPremium: ${gasPremium} orderNonce: ${orderNonce}`);

		try {
			const tx_execute_Order_Moonbeam =  await ExecutionOrdersEngineMoonbeam_instance.executeOrder_Moonbeam(orderNonce, { gasLimit: gasPremium });
			const receipt = await tx_execute_Order_Moonbeam.wait();
			if (receipt.status === false) {
				throw new Error(`Transaction execute_Order_Moonbeam with orderNonce: ${orderNonce} failed`);
			}
			console.log(`*********************  execute_Order_Moonbeam End ***********************************`);
			resolve(`Transaction execute_Order_Moonbeam with orderNonce: ${orderNonce} succeeded`);
		}
		catch (e) {
			console.log(` ********** while  execute_Order_Moonbeam_1 an error occured ********** Error: `,e);
			resolve(e);
		}
	});

}

// ONLY FOR TESTING REMOVE
// const temp_deleteOrder_Moonbeam = async (orderNonce) => {
// 	console.log(`deleteOrder_Moonbeam is run for orderNonce: ${orderNonce}`);
// 	const tx_delete_order =  await ExecutionOrdersEngineMoonbeam_instance.delete_Order( orderNonce );
// 	tx_delete_order.wait().then( async reslveMsg => {
// 		console.log(`********************* temp_deleteOrder_Moonbeam DELETE ORDER End is mined orderNonce: ${orderNonce} *********************************** reslveMsg: `,reslveMsg);
// 	});
// };
// ====>


let moonbemaApi;
//#region ***** Setup Substrate Chain //*****
const setup_SubstrateChain = async (wsURL = 'Shibuya') => {
	console.log("setup_SubstrateChain is RUN for wsURL: ",wsURL);
	let WS_URL, api;
	if (wsURL === 'Moonbeam')  WS_URL = 'wss://moonbeam.api.onfinality.io/public-ws'; 
	// else if (wsURL === 'Moonbase')  WS_URL = 'wss://moonbeam-alpha.api.onfinality.io/public-ws'; 

	const wsProvider = new WsProvider(WS_URL);

	api = await ApiPromise.create({ provider: wsProvider });

	await api.isReady;
	// console.log(`api => : `,api);
	// console.log(" ********** API PROPERTIES ********** ");
	// console.log((await api.rpc.system.properties()).toHuman());
	// console.log(" ********** API PROPERTIES ********** ");

	if (wsURL === 'Moonbeam')  moonbemaApi = api;

  return {api};
};
//#endregion 


//#region ***** getBalanceForBINANCEaccount //*****
const getBalanceForBINANCEaccount = async (tokenAddress, client, decimals=18) => {
	const balanceWEI = await ExecutionOrdersEngineFromBinance_instance.userBalance(client,tokenAddress);
	const balance = ethers.utils.formatUnits(balanceWEI,decimals);
	// console.log(`Balnance of ${client} for ${tokenAddress} is: `,balance);
	return Number(balance).toFixed(5);
};
//#endregion

//#region ***** getBalanceForFANTOMaccount //*****
const getBalanceForFANTOMaccount = async (tokenAddress, client, decimals=18) => {
	const balanceWEI = await ExecutionOrdersEngineFromFantom_instance.userBalance(client,tokenAddress);
	const balance = ethers.utils.formatUnits(balanceWEI,decimals);
	// console.log(`Balnance of ${client} for ${tokenAddress} is: `,balance);
	return Number(balance).toFixed(5);
};
//#endregion

//#region ***** Get balance for ERC20 token //*****
const getBalance = async (tokenAddress, client, _wallet, decimals=18) => {
	// console.log(`getBalance => tokenAddress: ${tokenAddress} client: ${client} _wallet: `,_wallet);
	const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, _wallet);
	const balanceWEI = await erc20.balanceOf(client);
	const balance = ethers.utils.formatUnits(balanceWEI,decimals);
	// console.log(`Balnance of ${client} for ${tokenAddress} is: `,balance);
	return Number(balance).toFixed(5);
};
//#endregion

//#region ***** Simple ERC20 Transfer //*****
const simpleERC20Transfer = async (wallet, tokenAddress, receipient, amountin_unitsEth="0.001") => {
	const erc20 =  new ethers.Contract( tokenAddress, IERC20_raw.abi, wallet);
  
	const amountWEI =  ethers.BigNumber.from( ethers.utils.parseUnits(amountin_unitsEth,12) );
	const tx3 = await erc20.transfer(receipient, amountWEI);
	tx3.wait().then( async reslveMsg => {
	//   console.log(`tx3 for transfer is mined resolveMsg : `,reslveMsg);
	 });
};
//#endregion


// const set_EngineMessage = (message) => {
// 	engineMessage = message;
// }
// const pickEngineMessage = () => {
// 	return engineMessage;
// }



export {

		setWallet,
		// setApi,
		// wallet,
		simpleERC20Transfer,
		getBalance,
	
		setup_SubstrateChain, 
		// pickEngineMessage,

		setChainOfUser,
		getUserChain,
		// test_data,
		registerUser_Moonbeam,
		// test_readOrders,
		get_OrderBooks,
		get_ExecutionsPendingOrderBook_Moonbeam,
		get_StellaSwap_Prices,
		get_Moonbeam_Balances,

		submitOrder_Moonbeam,
		deleteOrder_Moonbeam,
		//   set_artifical_StellaSwapPrice,
		checkLimitOrders,
		checkStopOrders,
		checkBracketOrders,
		checkDCAOrders,
		update_StellaSwap_Prices,
		executeORDERSMoonbeam,
		// temp_deleteOrder_Moonbeam,
		getBalanceForBINANCEaccount,
	};