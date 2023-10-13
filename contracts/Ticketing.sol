// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Ticketing is Initializable, ERC721Upgradeable, OwnableUpgradeable {

    //Mapping to associate a token with a duration
    uint256 public availableTickets;
    uint256 public ticketPrice;
    uint256 private _nextTokenId;

    function initialize(uint256 number, uint256 price, address initialOwner) initializer public {
        __ERC721_init("Ticket", "TCK");
        __Ownable_init(initialOwner);

        availableTickets = number;
        ticketPrice = price;
    }

    function mint() public payable {
        require(availableTickets > 0, "Not enough tickets");
        require(msg.value >= ticketPrice, "Not enough MATIC!");

        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        availableTickets = availableTickets - 1;
    }

    function getAvailableTickets() public view returns (uint256) {
        return availableTickets;
    }

    function getTicketPrice() public view returns (uint256) {
        return ticketPrice;
    }

    function getOwner(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner()).transfer(balance);
    }


}