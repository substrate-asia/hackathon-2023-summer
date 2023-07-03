// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library AddressSetLib {
    struct AddressSet {
        address[] elements;
        mapping(address => uint256) indices;
    }

    function contains(AddressSet storage set, address candidate) internal view returns (bool) {
        if (set.elements.length == 0) {
            return false;
        }
        uint256 index = set.indices[candidate];
        return index != 0 || set.elements[0] == candidate;
    }

    function getPage(
        AddressSet storage set,
        uint256 index,
        uint256 pageSize
    ) internal view returns (address[] memory) {
        // NOTE: This implementation should be converted to slice operators if the compiler is updated to v0.6.0+
        uint256 endIndex = index + pageSize; // The check below that endIndex <= index handles overflow.

        // If the page extends past the end of the list, truncate it.
        if (endIndex > set.elements.length) {
            endIndex = set.elements.length;
        }
        if (endIndex <= index) {
            return new address[](0);
        }

        uint256 n = endIndex - index; // We already checked for negative overflow.
        address[] memory page = new address[](n);
        for (uint256 i; i < n; i++) {
            page[i] = set.elements[i + index];
        }
        return page;
    }

    function add(AddressSet storage set, address element) internal {
        // Adding to a set is an idempotent operation.
        if (!contains(set, element)) {
            set.indices[element] = set.elements.length;
            set.elements.push(element);
        }
    }

    function remove(AddressSet storage set, address element) internal {
        require(contains(set, element), 'Element not in set.');
        // The element to be removed is replaced with the last element
        uint256 index = set.indices[element];
        // We require the element to be in the list, so it cannot be empty
        uint256 lastIndex = set.elements.length - 1;
        // If the last element is the one we want to delete, there is no need to move
        if (index != lastIndex) {
            address shiftedElement = set.elements[lastIndex];
            set.elements[index] = shiftedElement;
            set.indices[shiftedElement] = index;
        }
        set.elements.pop();
        delete set.indices[element];
    }

    function length(AddressSet storage set) internal view returns (uint256) {
        return set.elements.length;
    }
}
