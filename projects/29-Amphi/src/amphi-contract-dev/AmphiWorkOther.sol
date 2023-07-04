// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./LibProject.sol";
import "./AmphiTrans.sol";
import "./contracts/access/Ownable.sol";
error OperationException(string);
error ErrorValue(string, uint256);
// error Permissions(string);
error FileException(string, LibProject.FileState);
contract AmphiWorkOther is Ownable{
     address private serviceAddess;
     address private accessAddress;
     AmphiTrans private service;
     mapping(address => bool) private isNoTransferState;
     mapping(uint256 => mapping(uint256 => LibProject.ReturnRecord)) returnRecordList;
     constructor(address _serviceAddress) {
         serviceAddess = _serviceAddress;
     }
     event returnFileEv(
         uint256 index, 
         uint256 fileIndex,
         address to,
         string returnFile,
         string illustrate
         );
     event acceptTaskEv(
        uint256 taskIndex,
        uint256 fileIndex,
        address taskerAddress,
        bool isTrans
    );
    event postProjectEv(
        address buyer,
        uint256 taskIndex,
        LibProject.ProParm taskInfo
    );
    event acceptTaskEv(
        uint256 taskIndex,
        uint256[] fileIndex,
        address taskerAddress,
        bool isTrans
    );
    //任务索引值，文件索引值，文件状态，操作者
    event changeFileStateEv(
        uint256 taskIndex,
        uint256 fileInfo,
        LibProject.FileState fileSate,
        address opSender
    );
    //任务索引值，文件状态，操作者
    event changeProjectStateEv(
        uint256 taskIndex,
        LibProject.ProjectState taskState,
        address opSender
    );
    //任务索引值、任务者地址、文件索引值，任务者状态，是否为翻译者,操作者
    event changeTaskerStateEv(
        uint256 taskIndex,
        address tasker,
        uint256 fileIndex,
        LibProject.TaskerState taskerState,
        bool isTrans,
        address opSender
    );
    //任务索引值，是否关闭，操作者
    event changeTransActiveEv(
        uint256 taskIndex,
        bool transActive,
        address opSender
    );
    event changeVerActiveEv(
        uint256 taskIndex,
        bool verActive,
        address opSender
    );
    event submitFileEv(
        uint256 index,
        uint256 fileIndex,
        uint256 uploadtime,
        string file,
        address sender,
        bool isTrans
    );
    event addPayEv(
        address tasker,
        uint256 money
    ) ;
    event decutPayEv(
        address tasker,
        uint256 money
    );
    event newSubmitFile(uint256 _index,uint256 _fileIndex,bool _isTrans);
    modifier isAccess() {
        if(msg.sender != accessAddress) {
            revert  AccessError("Error Access Address!");
        }
        _;
    }
    function setAccessAddress(address _address) public onlyOwner{
        accessAddress = _address;
    }
     function update(address _newAddress) public isAccess{
         if(_newAddress!= serviceAddess) {
             serviceAddess = _newAddress;
         }
     }
     function getTransferState(address _address) public view returns(bool) {
         return !(isNoTransferState[_address]);
     }
     //添加任务
     function addTask(LibProject.ProParm memory _t,address _buyer)
        public
        isAccess
        returns (uint256)
    {
        service = AmphiTrans(serviceAddess);
        uint256 _index = service.addProject(_t,_buyer);
         emit postProjectEv(_buyer, _index, _t);
        return _index;
    }
    //修改任务
    function updateTaskByBuyer(uint256 _index, LibProject.ProParm memory _t,address _address)
        public
        isAccess
    {
        service = AmphiTrans(serviceAddess);
        service.updateProject(_index, _t);
         emit postProjectEv(_address, _index, _t);
    }
    function endTransAccept(uint256 _index)
        public
        isAccess
        returns (bool, string memory)
    {
        service = AmphiTrans(serviceAddess);
        uint256 _transNumber = service.getTransNumber(_index);
        LibProject.TaskInfo[] memory _tasks = service.getFiles(_index);
        if (service.isFull(_index, true)) {
            //若到截至日期已经完成接单，则返回true
            return (true, "");
            //若到翻译截至日期，仍无人接单，则关闭翻译接单状态
        } else if (_transNumber == 0) {
            service.changeTransActive(_index, false);
            emit changeTransActiveEv(_index, false, msg.sender);
            return (false, "translators number = 0");
        } else {
            uint256 _count = _tasks.length;
            uint256 _acceptedNum = _transNumber;
            uint256 avgNum = _count / _acceptedNum;
            address[] memory _list = service.getTranslatorsList(_index);
            for (uint256 i = 0; i < _tasks.length; i++) {
                //任务为待接收状态
                if (
                    _tasks[i].state == LibProject.FileState.Waiting ||
                    _tasks[i].state == LibProject.FileState.WaitingForTrans
                ) {
                    //为未分配任务分配任务者
                    for (uint256 q = 0; q < _transNumber; q++) {
                        //超出分配线，不予分配
                        if (
                            service.getAcceptTransNumber(_index, _list[q]) >
                            avgNum
                        ) {
                            continue;
                        }
                        //将当前任务分配给翻译者
                        service.addTransNumber(_index,1);
                        service.pushTaskTransIndex(_index, _list[q], i);
                        _acceptTransToFileState(_index, i,msg.sender);
                        service.isUsedToTrans(_index,i,_list[q]);
                        emit acceptTaskEv(_index, i, _list[q], true);
                        break;
                    }
                }
            }
            service.changeTransActive(_index, false);
            emit changeTransActiveEv(_index, false, msg.sender);
            if (service.isFull(_index, false)) {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.Processing
                );
                 emit changeProjectStateEv(_index, LibProject.ProjectState.Processing, msg.sender);
            } else {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.WaitingForVf
                );
                 emit changeProjectStateEv(_index, LibProject.ProjectState.WaitingForVf, msg.sender);
            }
            return (false, "Allocation completed");
        }
    }
     function _acceptTransToFileState(uint256 _index, uint256 _fileIndex,address _address)
        internal
    {
        service = AmphiTrans(serviceAddess);
        LibProject.FileState _state = service.getFileState(_index, _fileIndex);
        //根据目前文件状态，修改文件状态
        if (_state == LibProject.FileState.Waiting) {
            service.changeFileState(
                _index,
                _fileIndex,
                LibProject.FileState.WaitingForVf
            );
            emit changeFileStateEv(_index, _fileIndex, LibProject.FileState.WaitingForVf, _address);
        } else if (_state == LibProject.FileState.WaitingForTrans) {
            service.changeFileState(
                _index,
                _fileIndex,
                LibProject.FileState.Translating
            );
             emit changeFileStateEv(_index, _fileIndex, LibProject.FileState.Translating, _address);
        } else {
            revert FileException("Error file state", _state);
        }
    }
    function endTransVf(uint256 _index)
        public
        isAccess
        returns (bool, string memory)
    {
         service = AmphiTrans(serviceAddess);
        uint256 vfNumber = service.getVfNumber(_index);
        uint256 _transNumber = service.getTransNumber(_index);
        LibProject.TaskInfo[] memory _tasks = service.getFiles(_index);
        if (service.isFull(_index, false)) {
            return (true, "is full");
        } else if (vfNumber == 0 && _transNumber != 0) {
            service.changeVerActive(_index, false);
            emit changeVerActiveEv(_index, false, msg.sender);
            return (true, "verifiers number =0");
        } else if (vfNumber == 0 && _transNumber == 0) {
            //若无人接收任务，则修改任务状态为无人接收状态，关闭翻译接收
            _onNoOnePink(_index);
            return (false, "no one pink");
        } else {
            //若有部分人接收
            uint256 _count = _tasks.length;
            uint256 _acceptedNum = vfNumber;
            uint256 avgNum = _count / _acceptedNum;
            address[] memory _list = service.getVfList(_index);
            for (uint256 i = 0; i < _tasks.length; i++) {
                //任务为待接收状态
                if (_tasks[i].state == LibProject.FileState.Waiting) {
                    //为未分配任务分配任务者
                    for (uint256 q = 0; q < vfNumber; q++) {
                        //超出分配线，不予分配
                        if (
                            service.getAcceptVfNumber(_index, _list[q]) > avgNum
                        ) {
                            continue;
                        }
                        //将当前任务分配给翻译者
                        service.addVfNumber(_index,1);
                        service.pushTaskVfIndex(_index, _list[q], i);
                        _acceptVfToFileState(_index, i,msg.sender);
                        service.isUsedToVf(_index,i,_list[q]);
                        emit acceptTaskEv(_index, i, _list[q], false);
                        break;
                    }
                }
            }
            service.changeVerActive(_index, false);
            emit changeVerActiveEv(_index, false, msg.sender);
            if (service.isFull(_index, true)) {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.Processing
                );
                 emit changeProjectStateEv(_index, LibProject.ProjectState.Processing, msg.sender);

            } else {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.WaitingForTrans
                );
                 emit changeProjectStateEv(_index, LibProject.ProjectState.WaitingForTrans, msg.sender);
            }
        }
        return (true, "Allocation completed");
    } 
    function acceptVf(
        uint256 _index,
        uint256[] memory _fileIndex,
        address _taskerIndex
    ) public isAccess{
         service = AmphiTrans(serviceAddess);
        //若长度为0，说明该任务者是首次接收该任务,将校验者存入到校验者名单中
        if (service.getAcceptVfNumber(_index, _taskerIndex) == 0) {
            service.addVf(_index, _taskerIndex);
            isNoTransferState[_taskerIndex] = true;
        }
        for (uint256 q = 0; q < _fileIndex.length; q++) {
            _acceptVfToFileState(_index, _fileIndex[q],_taskerIndex);
            service.pushTaskVfIndex(_index, _taskerIndex, _fileIndex[q]);
            service.isUsedToVf(_index,_fileIndex[q],_taskerIndex);
        }
        //文件状态修改为翻译中
        service.addVfNumber(_index,_fileIndex.length);
        service.addVfWaitNumber(_index,_taskerIndex,_fileIndex.length);
        if (service.isFull(_index, false)) {
            service.changeVerActive(_index, false);
            emit changeVerActiveEv(_index, false, _taskerIndex);
            if (service.isFull(_index, true)) {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.Processing
                );
                emit changeProjectStateEv(_index, LibProject.ProjectState.Processing, _taskerIndex);

            } else {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.WaitingForTrans
                );
                emit changeProjectStateEv(_index, LibProject.ProjectState.WaitingForTrans, _taskerIndex);
            }
        }
        emit acceptTaskEv(_index, _fileIndex, _taskerIndex, false);
    }
    function acceptTrans(
        uint256 _index,
        uint256[] memory _fileIndex,
        address _taskerIndex
    ) public isAccess{
         service = AmphiTrans(serviceAddess);
        //若长度为0，说明该任务者是首次接收该任务,将翻译者存入到翻译者名单中
        if (service.getAcceptTransNumber(_index, _taskerIndex) == 0) {
            service.addTranslators(_index, _taskerIndex);
            isNoTransferState[_taskerIndex] = true;
        }
        for (uint256 q = 0; q < _fileIndex.length; q++) {
            _acceptTransToFileState(_index, _fileIndex[q],_taskerIndex);
            service.pushTaskTransIndex(_index, _taskerIndex, _fileIndex[q]);
            service.isUsedToTrans(_index,_fileIndex[q],_taskerIndex);
        }
        //
        service.addTransNumber(_index,_fileIndex.length);
        service.addTransWaitNumber(_index,_taskerIndex,_fileIndex.length);
        if (service.isFull(_index, true)) {
            service.changeTransActive(_index, false);
            emit changeTransActiveEv(_index, false, _taskerIndex);
            if (service.isFull(_index, false)) {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.Processing
                );
                emit changeProjectStateEv(_index, LibProject.ProjectState.Processing, _taskerIndex);

            } else {
                service.changeProjectState(
                    _index,
                    LibProject.ProjectState.WaitingForVf
                );
                emit changeProjectStateEv(_index, LibProject.ProjectState.WaitingForVf, _taskerIndex);
            }
        }
        emit acceptTaskEv(_index, _fileIndex, _taskerIndex, true);
    }
     //发布者验收
    function receiveTask(
        uint256 _index,
        uint256 _fileIndex,
        bool _isPass,
        address _address,
        string memory _file,
        string memory _illustrate
    ) public isAccess{
        service = AmphiTrans(serviceAddess);
        address  buyer = service.getBuyer(_index);
        //若校验通过，将任务者的状态修改为已完成
        if (_isPass) {
             service.changeTaskVfState(
            _index,
            _address,
            _fileIndex,
            LibProject.TaskerState.Completed
        );
         emit changeTaskerStateEv(
            _index,
            _address,
            _fileIndex,
            LibProject.TaskerState.Completed,
            false,
            buyer
        );
        service.changeFileState(
            _index,
            _fileIndex,
            LibProject.FileState.Accepted
        );
        emit changeFileStateEv(_index, _fileIndex,  LibProject.FileState.Accepted, _address);
        //判断任务中所有子任务是否完成，若该任务的所有子任务完成，则任务状态修改为Completed
        if(isAllCompleted(_index)){
        service.changeProjectState(
                    _index,
                    LibProject.ProjectState.Completed
         );
        emit changeProjectStateEv(_index, LibProject.ProjectState.Completed, buyer);
        }
        service.decutVfWaitNumber(_index,_address);
        if(service.getVfWaitNumber(_index,_address)<=0) {
            delete isNoTransferState[_address];
        }
        } else {
            //任务不通过，将任务者的状态修改为被打回状态
            service.changeTaskVfState(
            _index,
            _address,
            _fileIndex,
            LibProject.TaskerState.Return
        );
        emit changeTaskerStateEv(
            _index,
            _address,
            _fileIndex,
            LibProject.TaskerState.Return,
            false,
            buyer
        );
        service.changeFileState(
            _index,
            _fileIndex,
            LibProject.FileState.WaitVfModify
        );
        emit changeFileStateEv(_index, _fileIndex, LibProject.FileState.WaitVfModify,_address);
        //service.addReturnRecord(_index,_address,buyer,_file,_illustrate);
        returnRecordList[_index][_fileIndex]=LibProject.ReturnRecord(_address,_file,_illustrate);
        emit returnFileEv(_index,_fileIndex,_address,_file,_illustrate);
        }
    }
   

     function _onNoOnePink(uint256 _index) internal {
        service = AmphiTrans(serviceAddess);
        service.changeProjectState(_index, LibProject.ProjectState.NoOnePick);
        emit changeProjectStateEv(_index, LibProject.ProjectState.NoOnePick, msg.sender);
        service.changeVerActive(_index, false);
        emit changeVerActiveEv(_index, false, msg.sender);
        delete isNoTransferState[service.getBuyer(_index)];
        address[] memory transList = service.getTranslatorsList(_index);
        address[] memory vflist = service.getVfList(_index);
        for(uint256 i=0;i<transList.length;i++) {
            delete isNoTransferState[transList[i]];
        }
        for(uint256 i=0;i<transList.length;i++) {
            delete isNoTransferState[vflist[i]];
        }
    }
     function _acceptVfToFileState(uint256 _index, uint256 _fileIndex,address _address) internal {
       service = AmphiTrans(serviceAddess);
        LibProject.FileState _state = service.getFileState(_index, _fileIndex);
        //根据目前文件状态，修改文件状态
        if (_state == LibProject.FileState.Waiting) {
            service.changeFileState(
                _index,
                _fileIndex,
                LibProject.FileState.WaitingForTrans
            );
            emit changeFileStateEv(_index, _fileIndex, LibProject.FileState.WaitingForTrans,_address);
        } else if (_state == LibProject.FileState.WaitingForVf) {
            service.changeFileState(
                _index,
                _fileIndex,
                LibProject.FileState.Translating
            );
            emit changeFileStateEv(_index, _fileIndex, LibProject.FileState.WaitingForTrans, _address);
        } else {
            revert FileException("Error file state", _state);
        }
    }
     //校验者验收
    function validate(
        uint256 _index,
        address _transAddress,
        address _vfAddress,
        uint256 _fileIndex,
        bool _isPass,
        string memory _file, //如校验通过，_file为校验者提交的文件，不通过为校验者的打回报告
        string memory _illustrate
    ) public isAccess returns (uint256 _payBounty) {
        service = AmphiTrans(serviceAddess);
        //若校验通过，将任务者的状态修改为已完成
        if (_isPass) {
            //若用户为自定义支付，则完成后支付任务者赏金
            //_sumbitVfTask(_index, _transAddress, _vfAddress, _fileIndex, _file);
            service.changeTaskTransState(
            _index,
            _transAddress,
            _fileIndex,
            LibProject.TaskerState.Completed
        );
        emit changeTaskerStateEv(
            _index,
            _transAddress,
            _fileIndex,
            LibProject.TaskerState.Completed,
            true,
            msg.sender
        );
        if(service.getTransWaitNumber(_index,_transAddress) <=0) {
                delete isNoTransferState[_transAddress];
        }
         service.decutTransWaitNumber(_index,_transAddress);
        sumbitVf(_index,_fileIndex,_file,_vfAddress);
        bool _Customize = service.isCustomizeState(_index);
            if (_Customize) {
                _payBounty = service.getFileBounty(_index, _fileIndex);
            } else {
                _payBounty = service.getTaskBounty(_index);
            }
        return _payBounty;
        } else {
            //任务不通过，将任务者的状态修改为被打回状态
            service.changeTaskTransState(
            _index,
            _transAddress,
            _fileIndex,
            LibProject.TaskerState.Return
        );
        emit changeTaskerStateEv(
            _index,
            _transAddress,
            _fileIndex,
            LibProject.TaskerState.Return,
            true,
            msg.sender
        );
        
        service.changeFileState(
            _index,
            _fileIndex,
            LibProject.FileState.WaitTransModify
        );
        emit changeFileStateEv(_index, _fileIndex,  LibProject.FileState.WaitTransModify, msg.sender);
            _payBounty = 0;
        }
        //记录打回记录_transAddress
        // service.addReturnRecord(_index,_transAddress,_vfAddress,_file,_illustrate);
        returnRecordList[_index][_fileIndex]=LibProject.ReturnRecord(_transAddress,_file,_illustrate);
        emit returnFileEv(_index,_fileIndex,_transAddress,_file,_illustrate);
    }
    function getReturnRecord(uint256 _index, uint256 _fileIndex) public view returns(LibProject.ReturnRecord memory) {
        return returnRecordList[_index][_fileIndex];
    }
    function sumbitTaskTrans(
        uint256 _index,
        uint256 _fileIndex,
        string memory _file,
        address _tasker
    ) public isAccess{
        service = AmphiTrans(serviceAddess);
        if (service.getFileState(_index, _fileIndex) ==LibProject.FileState.WaitTransModify) {
            emit newSubmitFile(_index,_fileIndex,true);
        }
        service.changeFileState(
            _index,
            _fileIndex,
            LibProject.FileState.Validating
        );
        emit changeFileStateEv(_index, _fileIndex,  LibProject.FileState.Validating, _tasker);
        uint256 _time=service.submitFileByTrans(_index, _tasker, _fileIndex, _file);
        emit submitFileEv(_index, _fileIndex, _time, _file, _tasker, true);
        service.changeTaskTransState(
            _index,
            _tasker,
            _fileIndex,
            LibProject.TaskerState.Submitted
        );
        emit changeTaskerStateEv(
            _index,
            _tasker,
            _fileIndex,
            LibProject.TaskerState.Submitted,
            true,
            msg.sender
        );
    }
    function sumbitVf(
        uint256 _index,
        uint256 _fileIndex,
        string memory _file,
        address _tasker
    ) public isAccess {
        service = AmphiTrans(serviceAddess);
        if (service.getFileState(_index, _fileIndex) ==LibProject.FileState.WaitVfModify) {
            emit newSubmitFile(_index,_fileIndex,false);
        }
        service.changeFileState(
            _index,
            _fileIndex,
            LibProject.FileState.BuyerReview
        );
        emit changeFileStateEv(_index, _fileIndex,  LibProject.FileState.BuyerReview, msg.sender);
        service.changeTaskVfState(
            _index,
            _tasker,
            _fileIndex,
            LibProject.TaskerState.Submitted
        );
        emit changeTaskerStateEv(
            _index,
            _tasker,
            _fileIndex,
            LibProject.TaskerState.Submitted,
            false,
            _tasker
        );
       uint256 _time = service.submitFileByVf(_index, _tasker, _fileIndex, _file);
        emit submitFileEv(
            _index,
            _fileIndex,
            _time,
            _file,
            _tasker,
            false
        );
            
    }
     //超时未提交-翻译者
    function overTimeTrans(uint256 _index, address _taskerIndex)
        public 
        isAccess
        returns (uint256,uint256)
    {
        service = AmphiTrans(serviceAddess);
        //查询超时任务数
        uint256[] memory _unCompleted;
        uint256 _money;
        (_unCompleted, _money) = service.overTimeTasker(
            _index,
            _taskerIndex,
            true
        );
        if (_unCompleted.length == 0) {
            return (0,0);
        }
        //修改任务状态
        for (uint256 i = 0; i < _unCompleted.length; i++) {
            service.changeTaskTransState(
                _index,
                _taskerIndex,
                _unCompleted[i],
                LibProject.TaskerState.Overtime
            );
            emit changeTaskerStateEv(
            _index,
            _taskerIndex,
            _unCompleted[i],
            LibProject.TaskerState.Overtime,
            true,
            msg.sender
        );
        }
        uint256 _allBounty;
        if (service.isCustomizeState(_index)) {
            for (uint256 i = 0; i < _unCompleted.length; i++) {
                _allBounty += service.getFileBounty(_index, _unCompleted[i]);
            }
        } else {
            _allBounty = service.getTaskBounty(_index);
        }
        delete isNoTransferState[_taskerIndex];
        //返回罚金
        return (_money,_allBounty);
    }

    //超时未提交-校验者
    function overTimeVf(uint256 _index, address _taskerIndex)
        public
        isAccess
        returns (uint256,uint256)
    {
        service = AmphiTrans(serviceAddess);
        //查询超时任务数
        uint256[] memory _unCompleted;
        uint256 _money;
        (_unCompleted, _money) = service.overTimeTasker(
            _index,
            _taskerIndex,
            false
        );
        if (_unCompleted.length == 0) {
            return (0,0);
        }
         for (uint256 i = 0; i < _unCompleted.length; i++) {
            service.changeTaskVfState(
                _index,
                _taskerIndex,
                _unCompleted[i],
                LibProject.TaskerState.Overtime
            );
            emit changeTaskerStateEv(
            _index,
            _taskerIndex,
            _unCompleted[i],
            LibProject.TaskerState.Overtime,
            false,
            msg.sender
        );
        }
        //计算罚金
        uint256 _allBounty;
        if (service.isCustomizeState(_index)) {
            for (uint256 i = 0; i < _unCompleted.length; i++) {
                _allBounty += service.getFileBounty(_index, _unCompleted[i]);
            }
        } else {
            _allBounty = service.getTaskBounty(_index);
        }
        delete isNoTransferState[_taskerIndex];
        return (_money,_allBounty);
    }
    function deductPay(address _to,uint256 _value) public isAccess{
        service = AmphiTrans(serviceAddess);
        service.deductPay(_to, _value);
        emit decutPayEv(_to,_value); 
    }
    function addPay(address _to,uint256 _value) public isAccess {
        service = AmphiTrans(serviceAddess);
        service.addPay(_to, _value);
        emit addPayEv(_to,_value);
    }
    function closeTask(uint256 _index) public isAccess{
        service = AmphiTrans(serviceAddess);
        service.changeProjectState(_index, LibProject.ProjectState.Closed);
        emit changeProjectStateEv(_index, LibProject.ProjectState.Closed, msg.sender);
        
    }
    function closeFileState(uint256 _index,uint256 _fileIndex,address _address) public isAccess{
        service.changeFileState(
            _index,
            _fileIndex,
            LibProject.FileState.Closed
        );
        emit changeFileStateEv(_index, _fileIndex,  LibProject.FileState.Closed, _address);
    }
    //判断该任务的所有子任务是否已经全部完成
   function isAllCompleted(uint256 _index) private  view  returns(bool){
     LibProject.TaskInfo[] memory tasks =  service.getFiles(_index);
     //存在未完成的子任务信息
     for(uint256 i=0;i<tasks.length;i++) {
         if (tasks[i].state < LibProject.FileState.Accepted){
             return  false;
         }
     }
     return true;
   }
    
}