
const web3 = new Web3(new Web3.providers.HttpProvider(tread.host));
let latestBlockNumber;

async function getLatestBlockNumber() {
    try {
        // 获取最新的区块号
        latestBlockNumber = await web3.eth.getBlockNumber();
        alert(latestBlockNumber);
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    getLatestBlockNumber();
});
const contract = new web3.eth.Contract(tread.abi, tread.address);
const tokenUri = await contract.methods.tokenURI(108).call();

const imagejson = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');

const response = await fetch(imagejson);
const data = await response.json();
let imageUrl = data.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
// 在页面中创建一个<img>标签，并将图像添加到其中

const img = document.getElementById('my-image');
img.src = imageUrl;

