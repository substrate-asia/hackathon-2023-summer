// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./LibProject.sol";
import "./contracts/access/Ownable.sol";
interface IAmphiTrans {}
error AccessError(string);
contract AmphiTrans is Ownable{
    mapping(uint256 => LibProject.TranslationPro) private taskList;
    mapping(address => uint256) private payList;
    mapping(uint256 => mapping(address => LibProject.Tasker)) private transInfo; //翻译者接单信息
    mapping(uint256 => mapping(address => LibProject.Tasker)) private vfInfo;
    // mapping(uint256 => mapping(address => LibProject.ReturnRecord)) returnRecordList;
    uint256 private count;
    address private accessAddress;
    
    modifier isAccess() {
        if(msg.sender != accessAddress) {
            revert  AccessError("Error Access Address!");
        }
        _;
    }
    function setAccessAddress(address _address) public onlyOwner{
        accessAddress = _address;
    }
    //count
    function addCount() external isAccess{
        ++count;
    }

    function getCount() external view returns (uint256) {
        return count;
    }

    //payList
    function addPay(address _tasker, uint256 _money) external isAccess{
        payList[_tasker] += _money;
    }

    function deductPay(address _tasker, uint256 _money) external isAccess{
        payList[_tasker] -= _money;
    }
    //被打回者，打回者
    // function addReturnRecord(uint256 _index,address _returned,address _address,string memory _file,string memory _ill) external isAccess{
    //     returnRecordList[_index][_returned]=LibProject.ReturnRecord(_address,_file,_ill);
    // }
    // function getReturnRecord(uint256 _index, address _address) public view returns(LibProject.ReturnRecord memory) {
    //     return returnRecordList[_index][_address];
    // }
    function getPay(address _tasker) external view returns (uint256) {
        return payList[_tasker];
    }

    //taskList

    //判断任务是否已被接满
    function isFull(uint256 _index, bool _isTrans) public view returns (bool) {
        if (_isTrans) {
            return taskList[_index].maxT <= taskList[_index].numberT;
        } else {
            return taskList[_index].maxV <= taskList[_index].numberV;
        }
    }

    function getFiles(uint256 _index)
        public
        view
        returns (LibProject.TaskInfo[] memory)
    {
        return taskList[_index].tasks;
    }

    //任务翻译者总数量
    function getTransNumber(uint256 _index) public view returns (uint256) {
        return taskList[_index].translators.length;
    }

    function getVfNumber(uint256 _index) public view returns (uint256) {
        return taskList[_index].verifiers.length;
    }

    //获得指定任务翻译者接单数
    function getAcceptTransNumber(uint256 _index, address _taskerIndex)
        public
        view
        returns (uint256)
    {
        return transInfo[_index][_taskerIndex].taskIndex.length;
    }

    function getAcceptVfNumber(uint256 _index, address _taskerIndex)
        public
        view
        returns (uint256)
    {
        return vfInfo[_index][_taskerIndex].taskIndex.length;
    }
    function getTransWaitNumber(uint256 _index,address _taskerIndex) public view returns(uint256) {
        return transInfo[_index][_taskerIndex].number;
    }
    function isAccept(address _address,uint256 _index,uint256 _fileIndex) public view returns(bool) {
        if(transInfo[_index][_address].info[_fileIndex].isUsed|| vfInfo[_index][_address].info[_fileIndex].isUsed){
            return true;
        }
        return false;
    }
    function getVfWaitNumber(uint256 _index,address _taskerIndex) public view returns(uint256) {
        return vfInfo[_index][_taskerIndex].number;
    }
    //获得翻译者名单
    function getTranslatorsList(uint256 _index)
        public
        view
        returns (address[] memory)
    {
        return taskList[_index].translators;
    }
    //获得任务的翻译类型
    function getTranslationType(uint256 _index) public view returns(uint256) {
        return  taskList[_index].translationType;
    }

    //获得校验者名单
    function getVfList(uint256 _index) public view returns (address[] memory) {
        return taskList[_index].verifiers;
    }

    //是否为自定义支付
    function isCustomizeState(uint256 _index) public view returns (bool) {
        return taskList[_index].isCustomize;
    }

    //查询任务者超时未完成任务数
    function overTimeTasker(
        uint256 _index,
        address _taskerIndex,
        bool _isTrans
    ) public view returns (uint256[] memory, uint256) {
        uint256[] memory _filesIndex;
        uint256[] memory _list;
        uint256 money;
        uint256 q;
        if (_isTrans) {
            _filesIndex = transInfo[_index][_taskerIndex].taskIndex;
        } else {
            _filesIndex = vfInfo[_index][_taskerIndex].taskIndex;
        }
        LibProject.FileIndexInfo memory _info;
        for (uint256 i = 0; i < _filesIndex.length; i++) {
            _info = transInfo[_index][_taskerIndex].info[_filesIndex[i]];
            if (_info.state == LibProject.TaskerState.Processing) {
                _list[q] = _filesIndex[i];
                q++;
                money += taskList[_index].tasks[_filesIndex[i]].bounty;
            }
        }
        return (_list, money);
    }

    function getBuyer(uint256 _index) public view returns (address) {
        return taskList[_index].buyer;
    }

    function getTaskState(uint256 _index)
        public
        view
        returns (LibProject.ProjectState)
    {
        return taskList[_index].state;
    }

    function getFileState(uint256 _index, uint256 _fileIndex)
        public
        view
        returns (LibProject.FileState)
    {
        return taskList[_index].tasks[_fileIndex].state;
    }

    function getTaskStateVf(uint256 _index) public view returns (bool) {
        return taskList[_index].isVerActive;
    }

    function getTaskStateTrans(uint256 _index) public view returns (bool) {
        return taskList[_index].isTransActive;
    }

    //获得翻译者任务详细信息
    function getTransTaskInfo(uint256 _index, address _address)
        public
        view
        returns (LibProject.ReturnTasker memory)
    {
        LibProject.ReturnTasker memory _taskerInfo;
        _taskerInfo.taskerAddress = _address;
        _taskerInfo.taskIndex = transInfo[_index][_address].taskIndex;
        LibProject.FileIndexInfo[]
            memory _fileIndexInfo = new LibProject.FileIndexInfo[](
                _taskerInfo.taskIndex.length
            );
        //  LibProject.FileIndexInfo memory _info;
        for (uint256 q = 0; q < _taskerInfo.taskIndex.length; q++) {
            _fileIndexInfo[q].state = transInfo[_index][_address]
                .info[_taskerInfo.taskIndex[q]]
                .state;
            _fileIndexInfo[q].file = transInfo[_index][_address]
                .info[_taskerInfo.taskIndex[q]]
                .file;
        }
        _taskerInfo.taskerinfo = _fileIndexInfo;
        return _taskerInfo;
    }

    function getProjectOne(uint256 _index)
        external
        view
        returns (LibProject.TranslationPro memory)
    {
        return taskList[_index];
    }

    //获得校验者任务详细信息
    function getVfTaskInfo(uint256 _index, address _address)
        public
        view
        returns (LibProject.ReturnTasker memory)
    {
        LibProject.ReturnTasker memory _taskerInfo;
        _taskerInfo.taskerAddress = _address;
        _taskerInfo.taskIndex = vfInfo[_index][_address].taskIndex;
        LibProject.FileIndexInfo[]
            memory _fileIndexInfo = new LibProject.FileIndexInfo[](
                _taskerInfo.taskIndex.length
            );
        for (uint256 q = 0; q < _taskerInfo.taskIndex.length; q++) {
            _fileIndexInfo[q].state = vfInfo[_index][_address]
                .info[_taskerInfo.taskIndex[q]]
                .state;
            _fileIndexInfo[q].file = vfInfo[_index][_address]
                .info[_taskerInfo.taskIndex[q]]
                .file;
        }
        _taskerInfo.taskerinfo = _fileIndexInfo;
        return _taskerInfo;
    }

    function getFileBounty(uint256 _index, uint256 _fileIndex)
        public
        view
        returns (uint256)
    {
        return taskList[_index].tasks[_fileIndex].bounty;
    }

    function getTaskBounty(uint256 _index) public view returns (uint256) {
        return taskList[_index].bounty;
    }
    function addTransWaitNumber(uint256 _index,address _address,uint256 _number) public isAccess{
        transInfo[_index][_address].number+=_number;
    }
    function decutTransWaitNumber(uint256 _index,address _address) public isAccess{
        transInfo[_index][_address].number--;
    }
    function addVfWaitNumber(uint256 _index,address _address,uint256 _number) public isAccess{
        vfInfo[_index][_address].number+=_number;
    }
    function decutVfWaitNumber(uint256 _index,address _address) public isAccess{
        vfInfo[_index][_address].number--;
    }
    function changeTaskVfState(
        uint256 _index,
        address _taskerIndex,
        uint256 _fileIndex,
        LibProject.TaskerState _state
    ) public isAccess{
        vfInfo[_index][_taskerIndex].info[_fileIndex].state = _state;
    }

    function changeTaskTransState(
        uint256 _index,
        address _taskerIndex,
        uint256 _fileIndex,
        LibProject.TaskerState _state
    ) public isAccess{
        transInfo[_index][_taskerIndex].info[_fileIndex].state = _state;
        // emit changeTaskerStateEv(
        //     _index,
        //     _taskerIndex,
        //     _fileIndex,
        //     _state,
        //     true,
        //     msg.sender
        // );
    }

    //修改文件状态
    function changeFileState(
        uint256 _index,
        uint256 _fileIndex,
        LibProject.FileState _state
    ) public isAccess {
        taskList[_index].tasks[_fileIndex].state = _state;
        // emit changeFileStateEv(_index, _fileIndex, _state, msg.sender);
    }

    //修改任务状态
    function changeProjectState(uint256 _index, LibProject.ProjectState _state)
        public isAccess
    {
        taskList[_index].state = _state;
        // emit changeProjectStateEv(_index, _state, msg.sender);
    }

    //修改翻译者接单状态
    function changeTransActive(uint256 _index, bool _bool) public isAccess {
        taskList[_index].isTransActive = _bool;
        // emit changeTransActiveEv(_index, _bool, msg.sender);
    }

    //修改校验者接单状态
    function changeVerActive(uint256 _index, bool _bool) public isAccess {
        taskList[_index].isVerActive = _bool;
        // emit changeVerActiveEv(_index, _bool, msg.sender);
    }

    //增加翻译者人数
    function addTransNumber(uint256 _index,uint256 _number) public isAccess {
        taskList[_index].numberT+=_number;
    }

    //增加校验则人数
    function addVfNumber(uint256 _index,uint256 _number) public isAccess {
        taskList[_index].numberV+=_number;
    }

    //添加翻译者接单任务-文件索引
    function pushTaskTransIndex(
        uint256 _index,
        address _taskerIndex,
        uint256 _fileIndex
    ) public isAccess {
        transInfo[_index][_taskerIndex].taskIndex.push(_fileIndex);
    }

    function pushTaskVfIndex(
        uint256 _index,
        address _taskerIndex,
        uint256 _fileIndex
    ) public isAccess {
        vfInfo[_index][_taskerIndex].taskIndex.push(_fileIndex);
    }

    //添加翻译者名单
    function addTranslators(uint256 _index, address _address) public isAccess {
        taskList[_index].translators.push(_address);
    }

    function addVf(uint256 _index, address _address) public isAccess {
        taskList[_index].verifiers.push(_address);
    }
    function isUsedToTrans(uint256 _index, uint256 _fileIndex,address _address) public isAccess{
        transInfo[_index][_address].info[_fileIndex].isUsed = true;
    }
    function isUsedToVf(uint256 _index, uint256 _fileIndex,address _address) public isAccess{
        vfInfo[_index][_address].info[_fileIndex].isUsed = true;
    }

    function addProject(LibProject.ProParm memory _t, address _buyer)
        public isAccess
        returns (uint256)
    {
        count++;
        //  taskIndex[_buyer].push(count);
        LibProject.TranslationPro storage _pro = taskList[count];
        _pro.buyer = _buyer;
        _pro.releaseTime = _t.releaseTime;
        _pro.introduce = _t.introduce;
        _pro.need = _t.need;
        _pro.deadline = _t.deadline;
        _pro.sourceLanguage = _t.sourceLanguage;
        _pro.goalLanguage = _t.goalLanguage;
        _pro.preferList = _t.preferList;
        _pro.translationType = _t.translationType;
        _pro.workLoad = _t.workLoad;
        _pro.workLoadType =_t.workLoadType;
        _pro.bounty = _t.bounty;
        _pro.isNonDisclosure = _t.isNonDisclosure;
        _pro.isCustomize = _t.isCustomize;
        if (_t.isCustomize) {
            if (_t.translationType  == 1 || _t.translationType  == 5) {
            _pro.isTransActive = false;
            _pro.maxT = 0;
            _pro.maxV = _t.tasks.length;
        }else {
            _pro.maxT = _t.tasks.length;
            _pro.maxV = _t.tasks.length;
             _pro.isTransActive = true;
        }
        }else {
             if (_t.translationType  == 1 || _t.translationType  == 5) {
            _pro.maxT = 0;
            _pro.maxV = 1;
            _pro.isTransActive = false;
        }else {
            _pro.maxT = 1;
            _pro.maxV = 1;
             _pro.isTransActive = true;
        }
        }
        _pro.isVerActive = true;
        for (uint256 i = 0; i < _t.tasks.length; i++) {
            _t.tasks[i].state = LibProject.FileState.Waiting;
            _pro.tasks.push(_t.tasks[i]);
        }
       
        return count;
    }

    function updateProject(uint256 _index, LibProject.ProParm memory _t)
        public isAccess
    {
        LibProject.TranslationPro storage _pro = taskList[_index];
        _pro.releaseTime = _t.releaseTime;
        _pro.introduce = _t.introduce;
        _pro.need = _t.need;
        _pro.deadline = _t.deadline;
        _pro.sourceLanguage = _t.sourceLanguage;
        _pro.goalLanguage = _t.goalLanguage;
        _pro.preferList = _t.preferList;
        _pro.translationType = _t.translationType;
        _pro.workLoad = _t.workLoad;
        _pro.bounty = _t.bounty;
        _pro.isNonDisclosure = _t.isNonDisclosure;
        _pro.isCustomize = _t.isCustomize;
        // _pro.state = LibProject.ProjectState.Published;
        if (_t.isCustomize) {
            _pro.maxT = _t.tasks.length;
            _pro.maxT = _t.tasks.length;
        } else {
            _pro.maxT = 1;
            _pro.maxT = 1;
        }
        _pro.isTransActive = true;
        // _pro.state = LibProject.ProjectState.Published;
        for (uint256 i = 0; i < _t.tasks.length; i++) {
            _pro.tasks.push(_t.tasks[i]);
        }
       
    }

    function submitFileByTrans(
        uint256 _index,
        address _taskerIndex,
        uint256 _fileIndex,
        string memory _file
    ) public isAccess returns(uint256){
        uint256 _time = block.timestamp;
        taskList[_index].tasks[_fileIndex].lastUpload = _time;
        transInfo[_index][_taskerIndex].info[_fileIndex].file = _file;
        return _time;
        // emit submitFileEv(_index, _fileIndex, _time, _file, _taskerIndex, true);
    }

    function submitFileByVf(
        uint256 _index,
        address _taskerIndex,
        uint256 _fileIndex,
        string memory _file
    ) public isAccess returns(uint256){
        uint256 _time = block.timestamp;
        taskList[_index].tasks[_fileIndex].lastUpload = block.timestamp;
        vfInfo[_index][_taskerIndex].info[_fileIndex].file = _file;
        return _time;
    }
}
