//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "../ERC1155/ERC1155.sol";
import "./ContractMetadata.sol";
import "./AmphiSBTController.sol";
import "../ERC1155/extensions/ERC1155Pausable.sol";
import "../../interfaces/IEffWorkloadSBT.sol";

contract EffWorkloadSBT is
    ERC1155,
    ContractMetadata,
    ERC1155Pausable,
    IEffWorkloadSBT
{
    string public name;

    constructor() {
        root = msg.sender;
        orgAdmins[msg.sender] = true;
    }

    event Mint(address account, uint256 id);

    /* ================ UTIL FUNCTIONS ================ */

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155Pausable, ERC1155) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function _mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal override {
        super._mint(account, id, amount, data);
    }

    function _burn(
        address account,
        uint256 id,
        uint256 amount
    ) internal override {
        super._burn(account, id, amount);
    }

    function _burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal override {
        super._burnBatch(account, ids, amounts);
    }

    /* ================ TRANSACTION FUNCTIONS ================ */
    // 每种SBT同一个账户下只能拥有一个
    function mint(
        address account,
        uint256 id
    ) external onlyOrgAmin {
        require(
            balanceOf(account, id) == 0,
            "ERR_USER_HAS_THIS_SBT"
        );

        _mint(account, id, 1, "");
        
        emit Mint(account, id);
    }

    function mintToBatchAddress(
        address[] memory toList,
        uint256 tokenId
    ) external onlyOrgAmin {
        for (uint256 i = 0; i < toList.length; i++) {
            require(
                balanceOf(toList[i], tokenId) == 0,
                "ERR_SOME_USER_HAS_THIS_SBT"
            );

            _mint(toList[i], tokenId, 1, "");

            emit Mint(toList[i], tokenId);
        }
    }

    function burn(uint256 id, uint256 amount) external onlyOrgAmin {
        _burn(msg.sender, id, amount);
    }

    function burnBatch(
        uint256[] memory ids,
        uint256[] memory amounts
    ) external onlyOrgAmin {
        _burnBatch(msg.sender, ids, amounts);
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function pause() external onlyRoot {
        super._pause();
    }

    function unpause() external onlyRoot {
        super._unpause();
    }

    function setURI(string memory newuri) external onlyRoot {
        super._setURI(newuri);
    }

    function setName(string memory newName) external onlyRoot {
        name = newName;
    }
}
