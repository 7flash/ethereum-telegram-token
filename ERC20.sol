pragma solidity ^0.4.11;

contract ERC20 {
    function totalSupply() public view returns (uint256);
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);

    function mint(address to, uint256 amount) public returns (bool);
}