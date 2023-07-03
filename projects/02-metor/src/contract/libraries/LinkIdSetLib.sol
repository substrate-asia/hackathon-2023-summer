// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

library LinkIdSetLib {
    struct LinkIdSet {
        string[] elements;
        mapping(string => uint256) indices;
    }

    function contains(
        LinkIdSet storage set,
        string memory candidate
    ) internal view returns (bool) {
        if (set.elements.length == 0) {
            return false;
        }
        uint256 index = set.indices[candidate];

        return
            index != 0 ||
            keccak256(bytes(candidate)) == keccak256(bytes(set.elements[0]));
    }

    function getPage(
        LinkIdSet storage set,
        uint256 index,
        uint256 pageSize
    ) internal view returns (string[] memory) {
        uint256 endIndex = index + pageSize;
        if (endIndex > set.elements.length) {
            endIndex = set.elements.length;
        }
        if (endIndex <= index) {
            return new string[](0);
        }

        uint256 n = endIndex - index;
        string[] memory page = new string[](n);
        for (uint256 i; i < n; ) {
            page[i] = set.elements[i + index];
            unchecked {
                ++i;
            }
        }
        return page;
    }

    function add(LinkIdSet storage set, string memory element) internal {
        if (!contains(set, element)) {
            set.indices[element] = set.elements.length;
            set.elements.push(element);
        }
    }

    function remove(LinkIdSet storage set, string memory element) internal {
        require(contains(set, element), "Element not in set!");

        uint256 index = set.indices[element];

        uint256 lastIndex = set.elements.length - 1;
        if (index != lastIndex) {
            string memory shiftedElement = set.elements[lastIndex];
            set.elements[index] = shiftedElement;
            set.indices[shiftedElement] = index;
        }
        set.elements.pop();
        delete set.indices[element];
    }

    function length(LinkIdSet storage set) internal view returns (uint256) {
        return set.elements.length;
    }
}
