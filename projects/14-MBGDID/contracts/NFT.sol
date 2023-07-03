//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";

contract NFT is AccessControl, Ownable, ERC1155{
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");    
    uint256[][] public tokenidlist;
    uint256 public currenttokenid;
    //构造函数
    constructor(
        address admin,
        uint256 startpoint
    ) ERC1155("https//ipfs.io/ipfs/xxxxxxxxxxxxxx/{id}.json"){

        currenttokenid = startpoint;
        _setupRole(OWNER_ROLE, msg.sender);
        _setRoleAdmin(OWNER_ROLE, OWNER_ROLE);
        _setRoleAdmin(ADMIN_ROLE, OWNER_ROLE);
        _setupRole(ADMIN_ROLE, admin);
    }

    //used for add admin control 
    modifier onlyOwnerAndAdmin() { // Modifier
        require(
            hasRole(ADMIN_ROLE, msg.sender)|| (owner() == msg.sender),
            "Only owner and admin can call this."
        );
        _;
    }

    function transferOwnership(address newOwner) public override onlyOwner{

        super.transferOwnership(newOwner);

        _setupRole(OWNER_ROLE, newOwner);

        //revoke at last
        revokeRole(OWNER_ROLE,msg.sender);

    }
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function mintnft(uint256 tokenid,uint256 amount,bytes memory uristring) public onlyOwnerAndAdmin{
        _mint(msg.sender,tokenid,amount, uristring);
        uint256[] memory tmptokenlist = new uint256[](1);
        //tmptokenlist.push(tokenid);
        tmptokenlist[0] = tokenid;
        tokenidlist.push(tmptokenlist);
    }

    function batchmintnft(uint256 tokenamount,bytes memory uristring) public onlyOwnerAndAdmin {

        // uint256 oldcurrenttokenid = currenttokenid;
        uint256[] memory tmptokenlist = new uint256[](tokenamount);
        require(tokenamount > 0 ,"amount is 0");
        uint ii = 0;
        for ( uint i = currenttokenid;i < currenttokenid + tokenamount; i++){
            _mint(msg.sender,i,1, uristring);
            tmptokenlist[ii] = i;
            ii++;
        }

        tokenidlist.push(tmptokenlist);

        currenttokenid = currenttokenid + tokenamount;

        // uint256[] memory tmpout = new uint256[](2);
        // tmpout[0] = oldcurrenttokenid;
        // tmpout[1] = currenttokenid - 1;

        // console.log("",tokenidlist[0][0]);
        // return tmpout;
    }

    function transfernft(address to, uint256 id,uint256 amount) public onlyOwnerAndAdmin{
        safeTransferFrom(msg.sender,to,id,amount,"");
    }

    function gettokenlistbyindex(uint index) public view returns(uint256[] memory) {
        require(tokenidlist.length > index, "out of tokenlist range ");
        return tokenidlist[index];
    } 
    function getindex() public view returns(uint) {
        return tokenidlist.length;
    }
}