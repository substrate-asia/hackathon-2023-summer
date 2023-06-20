// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import "./Register_novice_package.sol";

contract CreateCiviTeam {
    address public creator; // 势力创建者的地址

    struct CiviTeam {
        string name;
        string description;
        address[] members;
        mapping (address => bool) isMember;
        uint256 totalMembers;
    }
    RegistContract reg = RegistContract(0x5eA4f6EBD22241e0605eB093DA55136Ad622eB9a);

    mapping(address => CiviTeam) public CiviTeams; // 势力映射
    uint256 totalCiviGroups;
    mapping(address => bool) public joinedGroup; // 玩家是否已经加入势力.
    mapping(address => address) public whichGroup; // 玩家加入了哪个势力.



    function createGroup(string memory _name, string memory _description, address[] memory _members) public {
        require(!CiviTeams[msg.sender].isMember[msg.sender], "You are already a member of a group");
        // 创建Group前需要注册.
        require(reg.isRegisted(msg.sender) == true, "You are not registed.");

        CiviTeam storage newCiviMember = CiviTeams[msg.sender];
        newCiviMember.name = _name;
        newCiviMember.description = _description;
        for (uint i = 0; i < _members.length; i++) {
            newCiviMember.members.push(_members[i]);
            newCiviMember.isMember[_members[i]] = true;
            newCiviMember.totalMembers += 1;
            joinedGroup[_members[i]] = true;
            whichGroup[_members[i]] = msg.sender;
        }
        newCiviMember.members.push(msg.sender);
        newCiviMember.isMember[msg.sender] = true;
        joinedGroup[msg.sender] = true;
        whichGroup[msg.sender] = msg.sender;
        newCiviMember.totalMembers += 1;
        totalCiviGroups += 1;
    }

    function joinGroup(address _groupOwner) public {
        // 加入Group前需要注册.
        require(reg.isRegisted(msg.sender) == true, "You are not registed.");
        require(!CiviTeams[msg.sender].isMember[msg.sender], "You are already a member of a group");
        require(CiviTeams[_groupOwner].isMember[_groupOwner], "Group owner does not exist");
        require(joinedGroup[msg.sender] == false, "You are joined one group");
        CiviTeam storage existingGroup = CiviTeams[_groupOwner];
        existingGroup.members.push(msg.sender);
        existingGroup.isMember[msg.sender] = true;
        joinedGroup[msg.sender] = true;
        whichGroup[msg.sender] = _groupOwner;
        existingGroup.totalMembers += 1;
    }

    function leaveGroup(address _teamOwner) public {
        require(CiviTeams[_teamOwner].isMember[msg.sender], "You are not a member of any group");
        require(CiviTeams[_teamOwner].isMember[_teamOwner], "Group owner does not exist");
        CiviTeam storage existingGroup = CiviTeams[_teamOwner];
        require(existingGroup.isMember[msg.sender], "You are not a member of this group");
        remove(existingGroup.members, msg.sender);
        existingGroup.isMember[msg.sender] = false;
        existingGroup.totalMembers -= 1;
        joinedGroup[msg.sender] = false;
        whichGroup[msg.sender] = address(0);
    }

    function remove(address[] storage array, address value) internal {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }

    function kickMember(address _groupOwner, address _addressMember) public {
        require(msg.sender == _groupOwner, "You are not this group owner.");
        require(CiviTeams[_groupOwner].isMember[_groupOwner], "Group owner does not exist");
        CiviTeam storage existingGroup = CiviTeams[_groupOwner];
        require(existingGroup.isMember[_addressMember], "You are not a member of this group");
        remove(existingGroup.members, _addressMember);
        existingGroup.isMember[_addressMember] = false;
        joinedGroup[_addressMember] = false;
        whichGroup[_addressMember] = address(0);

        existingGroup.totalMembers -= 1;
    }

    function returnTotalMembers(address _groupOwner) public view returns (uint256){
        CiviTeam storage existingGroup = CiviTeams[_groupOwner];
        return existingGroup.totalMembers;

    }

    function returnWitchGroupIn(address _userAddress) public view returns (address) {
        return whichGroup[_userAddress];
    }

    function returnTotalCiviGroups() public view returns (uint256) {
        return totalCiviGroups;
    }



    function setGroupInfo(address _groupOwner, string calldata _name, string calldata _description) public {
        require(msg.sender == _groupOwner, "You are not this group owner.");
        CiviTeam storage existingGroup = CiviTeams[_groupOwner];
        existingGroup.name = _name;
        existingGroup.description = _description;
    }

}