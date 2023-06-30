// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./AmphiTrans.sol";
import "./LibProject.sol";
import "./CalculateUtils.sol";
error OperationException(string);
error ErrorValue(string, uint256);
error Permissions(string);
error FileException(string, LibProject.FileState);

interface IAmphiPass {
    function walletOfOwner(
        address _owner
    ) external view returns (uint256[] memory);
}
interface IERC20 {

    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
interface IAmphiWorkOther {
    function addTask(
        LibProject.ProParm memory _t,
        address _address
    ) external returns (uint256);

    function updateTaskByBuyer(
        uint256 _index,
        LibProject.ProParm memory _t,
        address _address
    ) external;
    function getReturnRecord(uint256 _index, uint256 _fileIndex) external view returns(LibProject.ReturnRecord memory);
    function endTransAccept(
        uint256 _index
    ) external returns (bool, string memory);

    function endTransVf(uint256 _index) external returns (bool, string memory);

    function acceptVf(
        uint256 _index,
        uint256[] memory _fileIndex,
        address _taskerIndex
    ) external;

    function acceptTrans(
        uint256 _index,
        uint256[] memory _fileIndex,
        address _taskerIndex
    ) external;

     function receiveTask(
        uint256 _index,
        uint256 _fileIndex,
        bool _isPass,
        address _address,
        string memory _file,
        string memory _illustrate
    ) external;

    function validate(
        uint256 _index,
        address _transAddress,
        address _vfAddress,
        uint256 _fileIndex,
        bool _isPass,
        string memory _file,
        string memory _illustrate
    ) external returns (uint256 _payBounty);

    function sumbitTaskTrans(
        uint256 _index,
        uint256 _fileIndex,
        string memory _file,
        address _tasker
    ) external;

    function overTimeTrans(
        uint256 _index,
        address _taskerIndex
    ) external returns (uint256, uint256);

    function overTimeVf(
        uint256 _index,
        address _taskerIndex
    ) external returns (uint256, uint256);

    function sumbitVf(
        uint256 _index,
        uint256 _fileIndex,
        string memory _file,
        address _tasker
    ) external;
   // function getReturnRecord(uint256 _index, address _address) external view returns(LibProject.ReturnRecord memory);
    function deductPay(address _to, uint256 _value) external;

    function closeTask(uint256 _index) external;

    function getTransferState(address _address) external view returns (bool);

    function addPay(address _to, uint256 _value) external;

    function closeFileState(
        uint256 _index,
        uint256 _fileIndex,
        address _address
    ) external;
}

contract AmphiWorkImpl is Ownable {
    IAmphiPass private  amphi;
    CalculateUtils private  utils;
    AmphiTrans private  service;
    IAmphiWorkOther private  other;
    IERC20 private  erc;
    mapping(address => bool) private isAmphi;
    uint256 constant PO_RATE = 70;
    uint256 constant PO_RATE_TWO = 110;
    address private amphiFee;

    constructor(
        address _passAddress,
        address _utilsAddress,
        address _serviceAddress,
        address _otherAddress,
        address  _ercAddress
    ) {
        amphi = IAmphiPass(_passAddress);
        utils = CalculateUtils(_utilsAddress);
        other = IAmphiWorkOther(_otherAddress);
        service = AmphiTrans(_serviceAddress);
        erc = IERC20(_ercAddress);
        amphiFee = owner();
    }
    modifier onlyAmphi(address _amphiAddress) {
        require(isAmphi[_amphiAddress],"only amphi team can call the method");
        _;
    }
    modifier onlyBuyer(uint256 _index) {
        require(service.getBuyer(_index) == msg.sender, "Only buyer");
        _;
    }
    modifier isExist(uint256 _index) {
        if (_index > service.getCount()) {
            revert ParameterException("Wrong index value!");
        }
        _;
    }
    modifier hasFine(address _address) {
        uint256 _money = service.getPay(_address);
        if (_money > 0) {
            revert Permissions("unpaid penalty!");
        }
        _;
    }
    modifier isHasNftPass() {
        if (!_isHasNftPass(msg.sender)) {
            revert Permissions("Not Have Pass NFT!");
        }
        _;
    }

    //  AmphiWorkOther other;
    //发布任务
    //质押30%，校验通过，30%给翻译者，需求方验收通过，支付其余的赏金。
    //文件状态修改：翻译等待，校验等待
    function postTask(
        LibProject.ProParm memory _t
    ) public  isHasNftPass hasFine(msg.sender) returns (uint256 _index) {
        //判断用户是否有授权额度
        require(erc.allowance(msg.sender, address(this))>= utils.getPercentage(_t.bounty, PO_RATE_TWO),"not hava enought approve");
        //截至时间不能低于发布时间
        require(_t.releaseTime < _t.deadline,"The releaseTime is greater than the deadline");
        // 新增
        _index = other.addTask(_t, msg.sender);
        return _index;
    }

    function updateTask(
        uint256 _index,
        LibProject.ProParm memory _t
    ) public isExist(_index) onlyBuyer(_index) {
        //判断用户是否有授权额度
        require(erc.allowance(msg.sender, address(this))>= utils.getPercentage(_t.bounty, PO_RATE_TWO),"not hava enought approve");
        //截至时间不能低于发布时间
        require(_t.releaseTime < _t.deadline,"The releaseTime is greater than the deadline");
        //修改
        other.updateTaskByBuyer(_index, _t, msg.sender);
    }

    //截至日期处理
    function endTransAccept(uint256 _index) public isExist(_index) onlyAmphi(msg.sender) {
        other.endTransAccept(_index);
    }
    //流标判断
    function endTransVf(
        uint256 _index
    ) public isExist(_index) onlyAmphi(msg.sender) returns (bool, string memory) {
        (bool _bool, string memory _string) = other.endTransVf(_index);
        return (_bool, _string);
    }

    function acceptForTranslator(
        uint256 _index,
        uint256[] memory _fileIndex
    )
        public
        isHasNftPass
        isExist(_index)
        hasFine(msg.sender)
    {
        require(service.getTaskStateTrans(_index),"accept active is close");
        require(service.getBuyer(_index)!=msg.sender,"buyer cannot accept");
        //已经成为校验者的用户不能成为翻译者
        address[] memory vfList= service.getVfList(_index);
        bool isVf = false;
        for (uint256 i = 0;i<vfList.length;i++) {
            if (msg.sender == vfList[i]){
                isVf = true;
                break;
            }
        }
        require(!isVf,"you are a verifier,you cannot become translator");
        other.acceptTrans(_index, _fileIndex, msg.sender);
    }

    function acceptForVerifer(
        uint256 _index,
        uint256[] memory _fileIndex
    )
        public
        isHasNftPass
        isExist(_index)
        hasFine(msg.sender)
    {
        require(service.getTaskStateVf(_index),"accept active is close");
        require(service.getBuyer(_index)!=msg.sender,"buyer cannot accept");
        address[] memory transList= service.getTranslatorsList(_index);
        bool _isTrans = false;
        for (uint256 i = 0;i<transList.length;i++) {
            if (msg.sender == transList[i]){
                _isTrans = true;
                break;
            }
        }
        require(!_isTrans,"you are a translator,you cannot become verifier");
        other.acceptVf(_index, _fileIndex, msg.sender);
    }

    function validate(
        uint256 _index,
        address _trans,
        uint256 _fileIndex,
        bool _isPass,
        string memory _file,
        string memory _illustrate
    ) public isExist(_index) {
        require(service.getFileState(_index, _fileIndex) <=
            LibProject.FileState.WaitVfModify,"this file state cannot validate");
        if(keccak256(abi.encode(_file)) == keccak256(abi.encode(""))) {
            revert ErrorValue("file cannot null",0);
        }
        address[] memory vfList= service.getVfList(_index);
        bool isVf = false;
        for (uint256 i = 0;i<vfList.length;i++) {
            if (msg.sender == vfList[i]){
                isVf = true;
                break;
            }
        }
        require(isVf,"not in verifiers list");
        uint256 _bounty = other.validate(
            _index,
            _trans,
            msg.sender,
            _fileIndex,
            _isPass,
            _file,
            _illustrate
        );
        uint256 _passBounty = utils.getPercentage(_bounty,PO_RATE);
        address _buyer = service.getBuyer(_index);
        require(erc.allowance(_buyer, address(this))>=_passBounty 
        && erc.balanceOf(_buyer)>=_passBounty,"buyer not hava enought approve or balance");
        //校验者验收，支付翻译者60%赏金,平台10%的赏金
        //发赏金
        if (_bounty > 0) {
            erc.transferFrom(_buyer,_trans,utils.getBountyForTrans(_bounty));
            erc.transferFrom(_buyer,amphiFee,utils.getBountyForAmphi(_bounty));
        }
    }

    function sumbitTaskTrans(
        uint256 _index,
        uint256 _fileIndex,
        string memory _file
    ) public isExist(_index) {
        LibProject.FileState _fileState = service.getFileState(_index, _fileIndex);
        require(_fileState == LibProject.FileState.WaitingForVf || _fileState == LibProject.FileState.Translating 
        || _fileState == LibProject.FileState.WaitTransModify,"this file state cannot submit");
    
        if(keccak256(abi.encode(_file)) == keccak256(abi.encode(""))) {
            revert ErrorValue("file cannot null",0);
        }
        address[] memory transList= service.getTranslatorsList(_index);
        bool _isTrans = false;
        for (uint256 i = 0;i<transList.length;i++) {
            if (msg.sender == transList[i]){
                _isTrans = true;
                break;
            }
        }
        require(_isTrans,"not in translators list");
        other.sumbitTaskTrans(_index, _fileIndex, _file, msg.sender);
    }

    function sumbitVf(
        uint256 _index,
        uint256 _fileIndex,
        string memory _file
    ) public isExist(_index) {
        LibProject.FileState _fileState = service.getFileState(_index, _fileIndex);
        require(_fileState == LibProject.FileState.WaitVfModify|| _fileState ==LibProject.FileState.BuyerReview 
        || _fileState ==LibProject.FileState.Validating ||  _fileState == LibProject.FileState.WaitingForTrans,
        "this file state cannot submit");
        if(keccak256(abi.encode(_file)) == keccak256(abi.encode(""))) {
            revert ErrorValue("file cannot null",0);
        }
        address[] memory vfList= service.getVfList(_index);
        bool isVf = false;
        for (uint256 i = 0;i<vfList.length;i++) {
            if (msg.sender == vfList[i]){
                isVf = true;
                break;
            }
        }
        require(isVf,"not in verifiers list");
        other.sumbitVf(_index, _fileIndex, _file, msg.sender);
    }

    function overTimeTrans(
        uint256 _index,
        address _tasker
    ) public isExist(_index)  onlyAmphi(msg.sender)  returns (uint256) {
        (uint256 _money, uint256 _allBounty) = other.overTimeTrans(
            _index,
            _tasker
        );
        uint256 _rate = utils.punishRatio(utils.getBountyForTrans(_allBounty));
        uint256 _punish = utils.getPunish(_money, _rate);
        other.addPay(_tasker, _punish);
        return _punish;
    }

    function overTimeVf(
        uint256 _index,
        address _tasker
    ) public isExist(_index)  onlyAmphi(msg.sender)  returns (uint256) {
        (uint256 _money, uint256 _allBounty) = other.overTimeVf(
            _index,
            _tasker
        );
        //1.根据赏金获得处罚比率
        uint256 _rate = utils.punishRatio(utils.getBountyForVf(_allBounty));
        uint256 _punish = utils.getPunish(_money, _rate);
        other.addPay(_tasker, _punish);
        return _punish;
    }

    function receiveTask(
        uint256 _index,
        address _taskerIndex,
        uint256 _fileIndex,
        bool _isPass,
        string memory _file,
        string memory _illustrate
    ) public isExist(_index) onlyBuyer(_index) {
        uint256 _taskType = service.getTranslationType(_index);
        uint256 _passBounty;
        uint256 _bounty;
        if (service.isCustomizeState(_index)) {
            _bounty = service.getFileBounty(_index, _fileIndex);
        } else {
            _bounty = service.getTaskBounty(_index);
        }
        other.receiveTask(
            _index,
            _fileIndex,
            _isPass,
            _taskerIndex,
            _file,
            _illustrate
        );
        //验收通过
        if (_isPass&& _bounty>0) {
            //任务的翻译类型为validation或interpreting
        if (_taskType == 1 || _taskType == 5){
            _passBounty = utils.getPercentage(_bounty,PO_RATE_TWO);
        }else{
            _passBounty = utils.getBountyForVf(_bounty);
        }
        require(erc.allowance(msg.sender, address(this))>=_passBounty 
        && erc.balanceOf(msg.sender)>=_passBounty,"buyer not hava enought approve or balance");
        // address _buyer = service.getBuyer(_index);
        if (_taskType == 1 || _taskType == 5){
            erc.transferFrom(msg.sender, _taskerIndex, _bounty);
            erc.transferFrom(msg.sender, amphiFee, utils.getBountyForAmphi(_bounty));
        }else{
           erc.transferFrom(msg.sender,_taskerIndex,utils.getBountyForVf(_bounty));
        }
        }
    }

   // 支付罚金-----------待处理
    function payFine(address _to) public  {
        uint256 _pay =  service.getPay(_to);
        require(erc.allowance(msg.sender, address(this))>=_pay 
        && erc.balanceOf(msg.sender)>=_pay,"buyer not hava enought approve or balance");
        other.deductPay(_to,_pay);
        erc.transferFrom(msg.sender, _to, _pay);
    }

    function newAmphiPass(address _newAddress) public onlyOwner {
        amphi = IAmphiPass(_newAddress);
    }

    function newCalculateUtils(address _newAddress) public onlyOwner {
        utils = CalculateUtils(_newAddress);
    }

    function newAmphiTrans(address _newAddress) public onlyOwner {
        service = AmphiTrans(_newAddress);
    }

    function updateOther(address _newAddress) public onlyOwner {
        other = IAmphiWorkOther(_newAddress);
    }
    function newAmphiFee(address _newAddress) public  onlyOwner {
        amphiFee = _newAddress;
    }
    function newErc20Address(address _newAddress) public  onlyOwner {
         erc = IERC20(_newAddress);
    }
    function getAmphiFee() public view  returns (address) {
        return  amphiFee;
    }
    function closeTask(uint256 _index) public {
        require(msg.sender == service.getBuyer(_index)||isAmphi[msg.sender],"only buyer or amphi close task");
        other.closeTask(_index);
    }

    function closeFileState(uint256 _index, uint256 _fileIndex) public {
        other.closeFileState(_index, _fileIndex, msg.sender);
    }
    function addAmphiAddress(address _amphiAddress) public onlyOwner {
        isAmphi[_amphiAddress] = true;
    }
    //查询打回记录
    function getReturnRecord(uint256 _index, uint256 _fileIndex) public view returns(LibProject.ReturnRecord memory){
        return other.getReturnRecord(_index,_fileIndex);
    }

    function getTaskInfo(
        uint256 _index
    ) public view isExist(_index) returns (LibProject.ReturnTask memory) {
        LibProject.ReturnTask memory _info;
        _info.pro = service.getProjectOne(_index);
        uint256 transLen = service.getTransNumber(_index);
        uint256 vfLen = service.getVfNumber(_index);
        address[] memory transList = service.getTranslatorsList(_index);
        address[] memory vfList = service.getVfList(_index);
        LibProject.ReturnTasker[]
            memory _transInfo = new LibProject.ReturnTasker[](transLen);
        LibProject.ReturnTasker[]
            memory _vfInfo = new LibProject.ReturnTasker[](vfLen);
        for (uint256 i = 0; i < transLen; i++) {
            _transInfo[i] = service.getTransTaskInfo(_index, transList[i]);
        }
        for (uint256 i = 0; i < vfLen; i++) {
            _vfInfo[i] = service.getVfTaskInfo(_index, vfList[i]);
        }
        _info.transInfo = _transInfo;
        _info.vfInfo = _vfInfo;
        return _info;
        // return service.getProjectOne(_index);
    }

    function getFileState(
        uint256 _index,
        uint256 _fileIndex
    ) public view returns (LibProject.FileState) {
        return service.getFileState(_index, _fileIndex);
    }

    function getPay(address _address) public view returns (uint256) {
        return service.getPay(_address);
    }

    function getCount() public view returns (uint256) {
        return service.getCount();
    }

    function getTaskState(
        uint256 _index
    ) public view returns (LibProject.ProjectState) {
        return service.getTaskState(_index);
    }

    function getIsTransferState(address _address) public view returns (bool) {
        return other.getTransferState(_address);
    }

    function isAccepted(
        address _address,
        uint256[] memory _info
    ) public view returns (bool) {
        return service.isAccept(_address, _info[0], _info[1]);
    }

    function _isHasNftPass(address _address) internal view returns (bool) {
        // uint256[] memory _list = amphi.walletOfOwner(_address);
        if (amphi.walletOfOwner(_address).length > 0) {
            return true;
        }
        return false;
    }

    //提交任务-翻译者
}
