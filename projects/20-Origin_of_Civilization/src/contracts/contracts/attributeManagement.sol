// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./Playerdata.sol";



contract Management {
    struct Attribute{
        uint256 Stamina;
        uint256 Life;
        uint256 Strength;
        uint256 Intelligence;
        uint256 Attack;
        uint256 Defense;
        uint256 Level;
    }

    mapping(address => Attribute) public Attributelist;

    PlayerContract player = PlayerContract(0xd9145CCE52D386f254917e481eB44e9943F39138);


    function addAttribute(address Nftcontract, uint256 Stamina,uint256 Life,uint256 Strength,uint256 Intelligence,uint256 Attack,uint256 Defense,uint256 Level) public {
        Attributelist[Nftcontract] = Attribute(Stamina,Life,Strength,Intelligence,Attack,Defense,Level);
    }

    function destroyNft721(address NftContract, uint256 tokenId) public {
        // 销毁NFT.
        IERC721 erc721 =IERC721(NftContract);
        erc721.transferFrom(msg.sender, address(0xdead), tokenId);

        // 换取属性的提升.
        Attribute memory attribute = Attributelist[address(NftContract)];
        player.updatePlayerProperties(msg.sender, attribute.Stamina, attribute.Life, attribute.Strength, attribute.Intelligence, attribute.Attack, attribute.Defense, attribute.Level);
        
    }

    function destroyNft1155(address NftContract, uint256 tokenId) public {
        // 销毁NFT.
        IERC1155 erc1155 =IERC1155(NftContract);
        erc1155.safeTransferFrom(msg.sender, address(0xdead), tokenId, 1, '0x');

        // 换取属性的提升.
        Attribute memory attribute = Attributelist[address(0x123)];
        player.updatePlayerProperties(msg.sender, attribute.Stamina, attribute.Life, attribute.Strength, attribute.Intelligence, attribute.Attack, attribute.Defense, attribute.Level);
        
    }

}