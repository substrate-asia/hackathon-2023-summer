// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IEffWorkloadSBT {
    function mintToBatchAddress(
        address[] memory toList,
        uint256 tokenId
    ) external;

    function mint(
        address account,
        uint256 id
    ) external;

    function burn(uint256 id, uint256 amount) external;

    function burnBatch(uint256[] memory ids, uint256[] memory amounts) external;

    /* ================ ADMIN FUNCTIONS ================ */

    function pause() external;

    function unpause() external;

    function setURI(string memory newuri) external;

    function setName(string memory newName) external;
}
