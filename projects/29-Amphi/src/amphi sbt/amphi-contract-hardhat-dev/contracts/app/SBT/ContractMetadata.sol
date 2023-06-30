//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "./AmphiSBTController.sol";

// 支持opensea等平台的contractURI标准
contract ContractMetadata is AmphiSBTController {
    event MetadataChanged(uint256 tokenId);
    event MultipleMetadataChanged(uint256[] tokenId);

    mapping(uint256 => string) tokenMetadataURIs;

    function create(uint256 tokenId, string calldata metadataURI)
        external
        onlyOrgAmin
    {
        tokenMetadataURIs[tokenId] = metadataURI;

        emit MetadataChanged(tokenId);
    }

    function update(uint256 tokenId, string calldata metadataURI)
        external
        onlyOrgAmin
    {
        tokenMetadataURIs[tokenId] = metadataURI;

        emit MetadataChanged(tokenId);
    }

    function batchUpdate(
        uint256[] calldata tokenIds,
        string[] calldata metadataURIs
    ) external onlyOrgAmin {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            tokenMetadataURIs[tokenId] = metadataURIs[i];
        }
        emit MultipleMetadataChanged(tokenIds);
    }

    function getTokenURI(uint256 tokenId) external view returns (string memory) {
        require(
            tokenId > 0,
            "ERR_TOKENID_NEED_LARGE_ZERO"
        );
        return tokenMetadataURIs[tokenId];
    }
}
