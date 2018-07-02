pragma solidity ^0.4.24;

import "./ERC20.sol";
import "./Ownable.sol";

contract Manager is Ownable {
    address public token;

    uint256 public dailyLimit;
    uint256 public lastDay;
    uint256 public spentToday;

    event DailyLimitChange(uint256 dailyLimit);

    constructor(address _token) public
    {
        token = _token;
    }

    function mint(address _recipient, uint256 _amount)
        public
        onlyOwner
    {
        require(isUnderLimit(_amount));

        spentToday += _amount;
        assert(spentToday > _amount);

        ERC20(token).mint(_recipient, _amount);
    }

    function changeDailyLimit(uint256 _dailyLimit)
        public
        onlyOwner
    {
        dailyLimit = _dailyLimit;
        emit DailyLimitChange(_dailyLimit);
    }

    function isUnderLimit(uint256 amount)
        internal
        returns (bool)
    {
        if (now > lastDay + 24 hours) {
            lastDay = now;
            spentToday = 0;
        }
        if (spentToday + amount > dailyLimit || spentToday + amount < spentToday)
            return false;

        return true;
    }

    function calcMaxWithdraw()
        public
        constant
        returns (uint)
    {
        if (now > lastDay + 24 hours)
            return dailyLimit;
        if (dailyLimit < spentToday)
            return 0;
        return dailyLimit - spentToday;
    }
}