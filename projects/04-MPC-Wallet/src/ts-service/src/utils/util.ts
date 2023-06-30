import * as fs from "fs";

const mapExampleAbiPaths = new Map();
mapExampleAbiPaths.set('EntryPoint','../contracts/EntryPoint.json');
mapExampleAbiPaths.set('SimpleAccountFactory','../contracts/SimpleAccountFactory.json');
mapExampleAbiPaths.set('TokenPaymaster','../contracts/TokenPaymaster.json');
mapExampleAbiPaths.set('SimpleAccount','../contracts/SimpleAccount.json');

export function loadExampleAbi(contractName: string) {
	const abiPath = mapExampleAbiPaths.get(contractName);
	if (!abiPath) {
		throw new Error('Unknown contract name');
	}

	// const abi = fs.readFileSync(abiPath).toString();
	return require(abiPath).abi;
}

export function loadExampleAddress(contractName: string) {
	const abiPath = mapExampleAbiPaths.get(contractName);
	if (!abiPath) {
		throw new Error('Unknown contract name');
	}

	// const abi = fs.readFileSync(abiPath).toString();
	return require(abiPath).address;
}

export function returnResponse(data:any,msg:any):any{

	class response {
		data:any;
		msg:any;
	}

	let resp = new response()
	resp.data = data;
	resp.msg = msg;

	return resp;
}

let codeStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
export function GetCode(count:number):string {

	let str = '';
	     // 验证码有几位就循环几次
	for (let i = 0;i < count;i ++) {
		let ran = getRandom(0, 62);
		 str += codeStr.charAt(ran);
	}

	return str
}
 function getRandom(n:number, m:number):number { // param: (Number, Number)
	if (n > m) {
		let temp = n;
		n = m;
		m = temp;
	}
	return Math.floor(Math.random()*(m - n) + n);
}
