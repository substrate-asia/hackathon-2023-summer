const hre = require("hardhat");

function returnInstance(signer) {
    let abijson = require('../artifacts/contracts/app/SBT/EffWorkloadSBT.sol/EffWorkloadSBT.json');
    
    return new hre.ethers.Contract(
        "0x2d6DF3EA202D2eB59ceB700647d1109456b5b4a8",
        abijson.abi,
        signer,
    );
}

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log(
        "当前部署合约的账号为：",
        deployer.address
    );

    let sbtInstance = returnInstance(deployer);
    let sbtSigner = await sbtInstance.connect(deployer);
    console.log("sbtSigner: ", sbtSigner);

    // this._sbtSigner = await this._sbtContract.connect(signer);
    // console.log("signer: ", this._sbtSigner);
    // mint一个试试
    // 试试查余额
    let balance = await sbtSigner.balanceOf("0x4d29360c2F7Cc54b8d8A28CB4f29343df867748b", 1);
    if (balance == 0) {
        await sbtSigner.mint("0x4d29360c2F7Cc54b8d8A28CB4f29343df867748b", 1);
        console.log("try to mint one sbt");
        balance = await sbtSigner.balanceOf("0x4d29360c2F7Cc54b8d8A28CB4f29343df867748b", 1);
    }
    console.log("balance: ", balance);

    let TOKENURI = await sbtSigner.getTokenURI(10);
    console.log("tokenURI: ", TOKENURI);
    return 1;
    // !! 已设置完成
    // 一键设置SBT UTI
    // LEVEL 1: 300
    let tokenuri = '{"workload":"300","level":1,"tokenId":1,"cessPNGPid":"a1922bf927dbac0bc256c9fee2a04a05e4beee043bddd55d67f73e4f108e76e1","name":"001.png"}';
    await sbtSigner.create(1, tokenuri);
    // LEVEL 2: 1K
    tokenuri = '{"workload":"1k","level":2,"tokenId":2,"cessPNGPid":"f1b38291a7cdd23225ab39475f19961d197f5fa2c3952c556c8b6fc21362786e","name":"002.png"}';
    await sbtSigner.create(2, tokenuri);
    // LEVEL 3: 10K
    tokenuri = '{"workload":"10k","level":3,"tokenId":3,"cessPNGPid":"5b2196c7b860ac25c9b8d96679f4042968733a87663ab6d73a2d64686e522339","name":"003.png"}';
    await sbtSigner.create(3, tokenuri);
    // LEVEL 4: 100K
    tokenuri = '{"workload":"100k","level":4,"tokenId":4,"cessPNGPid":"84db5718ee2de7ad1a795f0793c43e6ca0dcfa786aff3a3df0f10cecb5b38540","name":"004.png"}';
    await sbtSigner.create(4, tokenuri);
    // LEVEL 5: 1M
    tokenuri = '{"workload":"1M","level":5,"tokenId":5,"cessPNGPid":"dbb0384a275148d7e24accb771b28fcaeda8417afb18af909062b471f3d15cf0","name":"005.png"}';
    await sbtSigner.create(5, tokenuri);
    // LEVEL 6: 2M
    tokenuri = '{"workload":"2M","level":6,"tokenId":6,"cessPNGPid":"f915d3e7cfe0c54094e379fe0eb791ffbef901018eb9309b835531dbdd8fe39c","name":"006.png"}';
    await sbtSigner.create(6, tokenuri);
    // LEVEL 7: 3M
    tokenuri = '{"workload":"3M","level":7,"tokenId":7,"cessPNGPid":"51266a56dc542fe54f724f29df7d0fbe138b19aba9fd59515db9ecff24aef5e8","name":"007.png"}';
    await sbtSigner.create(7, tokenuri);
    // LEVEL 8: 4M
    tokenuri = '{"workload":"4M","level":8,"tokenId":8,"cessPNGPid":"5e4b6a9a41bb43157d41011ce15495adec5f9dea1776606475a5d7b6ac59ff54","name":"008.png"}';
    await sbtSigner.create(8, tokenuri);
    // LEVEL 9: 5M
    tokenuri = '{"workload":"5M","level":9,"tokenId":9,"cessPNGPid":"ad311cc755d6d9ec285e11d28a2fb7b3c896e37d3174df7d109f8890cfcf9b6e","name":"009.png"}';
    await sbtSigner.create(9, tokenuri);
    // LEVEL 10: 10M
    tokenuri = '{"workload":"10M","level":10,"tokenId":10,"cessPNGPid":"e79b0e590e626df6b3d1d328cc360e23de5313d2d27c7b1ca5220b441999f22e","name":"010.png"}';
    await sbtSigner.create(10, tokenuri);
    // LEVEL 11: 50M
    tokenuri = '{"workload":"50M","level":11,"tokenId":11,"cessPNGPid":"946e06b466ead0460d4ffd0639335da9d97faff34f69a035e1a2e4a901f0b17f","name":"011.png"}';
    await sbtSigner.create(11, tokenuri);
    // LEVEL 12: 100M
    tokenuri = '{"workload":"100M","level":12,"tokenId":12,"cessPNGPid":"15cc4ae9f71d4fd86a2ec2048c2d67f6ac5c9f93f3ad5881c48ec2de96a06d6d","name":"012.png"}';
    await sbtSigner.create(12, tokenuri);
    // LEVEL 13: 1B
    tokenuri = '{"workload":"1B","level":13,"tokenId":13,"cessPNGPid":"66103dbddc9e7dcf01a914eb483ead475e1971030cc4ea38af6d2a5d52cb7792","name":"013.png"}';
    await sbtSigner.create(13, tokenuri);
    // LEVEL 14: 50B
    tokenuri = '{"workload":"50B","level":14,"tokenId":14,"cessPNGPid":"fc9d47e4feef0b0066d36f625ebb636b113946f05cd7b3ba2d337de90feed8fa","name":"014.png"}';
    await sbtSigner.create(14, tokenuri);
    // LEVEL 15: 100B
    tokenuri = '{"workload":"100B","level":15,"tokenId":15,"cessPNGPid":"4e8ee7f374e45d79b39914d53492b23aab407ce655c0f0b816aa1670445d0758","name":"015.png"}';
    await sbtSigner.create(15, tokenuri);

    let tokenURI = await sbtSigner.getTokenURI(10);
    console.log("tokenURI: ", tokenURI);
    console.log();
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});