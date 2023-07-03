// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IBoardEligibilityVerifier.sol";
import "./interfaces/IRevealAttackVerifier.sol";
import "./interfaces/IGame.sol";

contract Game is IGame {
    uint256 public gameIndex;

    mapping(uint256 => Game) public games;

    /// The number of unique hits it takes to win a game.
    uint256 public constant WIN_HIT_COUNT = 17;

    IBoardEligibilityVerifier boardEligibilityVerifier;
    IRevealAttackVerifier revealAttackVerifier;

    constructor(address _boardEligibilityVerifier, address _revealAttackVerifier) {
        boardEligibilityVerifier = IBoardEligibilityVerifier(_boardEligibilityVerifier);
        revealAttackVerifier = IRevealAttackVerifier(_revealAttackVerifier);
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
        )
    {
        Game storage game = games[_gameId];

        _participants = game.participants;
        _boards = game.boards;
        _turn = game.turn;
        _hits = game.hits;
        _winner = game.winner;
    }

    function startGame(
        uint256 _boardHash,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    ) external {
        require(BoardEligibilityVerifier.verifyProof(a, b, c, [_boardHash]), "Invalid ship configuration!");

        games[gameIndex].participants[0] = msg.sender;
        games[gameIndex].boards[0] = _boardHash;

        emit Started(gameIndex, msg.sender);

        gameIndex++;
    }

    function joinGame(
        uint256 _gameId,
        uint256 _boardHash,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    ) external {
        Game storage game = games[_gameId];

        require(game.participants[1] == address(0), "Game already full!");
        require(BoardEligibilityVerifier.verifyProof(a, b, c, [_boardHash]), "Invalid ship configuration!");

        game.participants[1] = msg.sender;
        game.boards[1] = _boardHash;

        emit Joined(_gameId, msg.sender);
    }

    function playFirstTurn(uint256 _gameId, uint256 _turnShotIndex) external {
        Game storage game = games[_gameId];

        require(game.turn == 0, "Not the first turn!");
        require(msg.sender == game.participants[0], "Not turn!");
        require(_turnShotIndex < 100, "Shot coordinates invalid!");

        game.shots[_turnShotIndex] = game.turn;

        emit ShotFired(_gameId, uint8(_turnShotIndex));

        game.turn++;
    }

    function playTurn(
        uint256 _gameId,
        uint256 _hitShipId,
        uint256 _prevTurnShotIndex,
        uint256 _turnShotIndex,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c
    ) external {
        Game storage game = games[_gameId];

        uint256 prevPlayerIndex = (game.turn - 1) % 2;
        uint256 currPlayerIndex = game.turn % 2;

        require(game.turn > 0, "The first turn!");
        require(msg.sender == game.participants[currPlayerIndex], "Not turn!");
        require(game.winner == address(0), "Game already over!");
        require(_turnShotIndex < 100, "Next shot coordinates invalid!");
        require(game.turn - 1 == game.shots[_prevTurnShotIndex + prevPlayerIndex * 100], "Incorrect shot for previous turn provided!");
        require(RevealAttackVerifier.verifyProof(a, b, c, [_hitShipId, game.boards[currPlayerIndex], _prevTurnShotIndex]), "Invalid proof!");

        if (_hitShipId != 0) {
            game.hits[prevPlayerIndex]++;
        }

        emit ShotLanded(_gameId, uint8(_hitShipId));

        if (game.hits[prevPlayerIndex] >= WIN_HIT_COUNT) {
            game.winner = game.participants[prevPlayerIndex];
            emit Won(_gameId, game.winner);
        } else {
            require(game.shots[_turnShotIndex + currPlayerIndex * 100] == 0, "Shots must be unique!");

            game.shots[_turnShotIndex + currPlayerIndex * 100] = game.turn;
            emit ShotFired(_gameId, uint8(_turnShotIndex));
            game.turn++;
        }
    }
}