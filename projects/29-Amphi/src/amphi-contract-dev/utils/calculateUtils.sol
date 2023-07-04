// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./../contracts/utils/math/SafeMath.sol";
error ParameterException(string);

library CalculateUtils {
    uint256 constant RATE = 100;
    uint256 constant VF_N = 3;

    // uint256 private TransRate ;
    //获得罚金比率
    function punishRatio(uint256 _bounts) public pure returns (uint256) {
        uint256 ratio;
        if (_bounts < RATE) {
            ratio = 1;
        } else if (_bounts >= RATE && _bounts < RATE * 1e1) {
            ratio = 1e1;
        } else if (_bounts >= RATE * 1e1 && _bounts < RATE * 1e2) {
            ratio = 1e2;
        } else if (_bounts >= RATE * 1e2 && _bounts < RATE * 1e3) {
            ratio = 1e3;
        } else if (_bounts >= RATE * 1e3 && _bounts <= RATE * 1e4) {
            ratio = 1e4;
        } else if (_bounts >= RATE * 1e4 && _bounts <= RATE * 1e5) {
            ratio = 1e5;
        } else {
            revert ParameterException(
                "Unable to calculate,Please submit a request"
            );
        }
        return ratio;
    }

    //修改汇率
    // function setRate(uint256 _rate) internal onlyOwner{
    //     rate = _rate;
    // }
    //校对工作量（人） 校对人数= 翻译人数/校对工作量
    // function setvfN(uint256 _vfN) internal onlyOwner {
    //     vfN =_vfN;
    // }
    function getMatNumber(uint256 _transNumber)
        external
        pure
        returns (uint256)
    {
        uint256 _maxV;
        if (_transNumber <= VF_N) {
            _maxV = 1;
        } else {
            _maxV = SafeMath.div(_transNumber, VF_N);
        }
        return _maxV;
    }

    //计算任务赏金-翻译者
    function getBountyForTrans(uint256 _bounty)
        public  
        pure
        returns (uint256 _money)
    {
        _money = getPercentage(_bounty, 60);
    }

    function getBountyForVf(uint256 _bounty)
        external 
        pure
        returns (uint256 _money)
    {
        _money = getPercentage(_bounty, 40);
    }

    function getBountyForAmphi(uint256 _bounty)
        external 
        pure
        returns (uint256 _money)
    {
        _money = getPercentage(_bounty, 10);
    }

    //计算任务赏金
    function getPercentage(uint256 _number, uint256 _ratio)
        public
        pure
        returns (uint256 returnNumber)
    {
        returnNumber = SafeMath.mul(_number, _ratio) / 100;
    }

    //计算罚金
    function getPunish(uint256 _ratio, uint256 _bounty)
        public
        pure
        returns (uint256)
    {
        return SafeMath.div(_bounty, _ratio);
    }

    //计算扣除的赏金
    function getDeductMoney(uint256 _bounty, uint256 _deduct)
        public
        pure
        returns (uint256)
    {
        return getPercentage(_bounty, _deduct);
    }
}
