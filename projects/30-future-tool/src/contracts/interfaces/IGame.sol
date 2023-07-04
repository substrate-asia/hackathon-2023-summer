// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGame {
    event Started(uint256 _gameId, address _by);
    event Joined(uint256 _gameId, address _by);
    event ShotFired(uint256 _gameId, uint8 _shotIndex);
    event ShotLanded(uint256 _gameId, uint8 _shipId);
    event Won(uint256 _gameId, address _by);

    struct Game {
        /// The address of the two players.
        address[2] participants;
        /// The hash committing to the ship configuration of each playment.
        uint256[2] boards;
        /// The turn number of this game.
        uint256 turn;
        /// Mapping of player shot indices to turn number.
        /// The shot indices of the second player are offset by 100.
        mapping(uint256 => uint256) shots;
        /// The number of hits each player has made on a ship.
        uint256[2] hits;
        /// The winner of the game.
        address winner;
    }

    function gameState(uint256 _gameId)
        external
        view
        returns (
            address[2] memory _participants,
            uint256[2] memory _boards,
            uint256 _turn,
            uint256[2] memory _hits,
            address _winner
        );

    function startGame(
        uint256 _boardHash,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    ) external;

    function joinGame(
        uint256 _gameId,
        uint256 _boardHash,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    ) external;

    function playFirstTurn(uint256 _gameId, uint256 _turnShotIndex) external;

    function playTurn(
        uint256 _gameId,
        uint256 _hitShipId,
        uint256 _prevTurnShotIndex,
        uint256 _turnShotIndex,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    ) external;
}