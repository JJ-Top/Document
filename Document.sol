// SPDX-License-Identifier: JAIRO LAMUS
//pragma solidity >=0.4.21 <0.7.0;
pragma solidity 0.7.5;

contract Document {
    string public documentTitle;
    string public documentURL;
    address public documentOwner;

    constructor(string memory title, string memory url) public {
        documentTitle = title;
        documentURL = url;
        documentOwner = msg.sender;
    }
}