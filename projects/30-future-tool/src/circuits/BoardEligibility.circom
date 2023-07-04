pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/mimcsponge.circom";

include "./templates/shiprange.circom";
include "./templates/shipsnonoverlapping.circom";

/// Validates the specified ship placement is valid
/// and computes a hash privately committing to the ship configuration.
template BoardEligibility() {
    signal input ships[5][3];
    // A user held secret that prevents others from brute forcing the board's configuration
    signal input trapdoor;

    signal output hash;

    // The length of each ship in the order used.
    var lengths[5] = [5, 4, 3, 3, 2];

    // Validate that ship coordinates are within the range of the board.
    component shipWithinRangeValidator[5];
    for (var i = 0; i < 5; i++) {
        shipWithinRangeValidator[i] = ShipWithinRange(lengths[i]);
        shipWithinRangeValidator[i].ship[0] <== ships[i][0];
        shipWithinRangeValidator[i].ship[1] <== ships[i][1];
        shipWithinRangeValidator[i].ship[2] <== ships[i][2];
    }

    // Validate that placed ships do not overlap.
    component shipsNonoverlapping[10];
    var k = 0;
    for (var i = 0; i < 5; i++) {
        for (var j = i + 1; j < 5; j++) {
            shipsNonoverlapping[k] = ShipsNonoverlapping(lengths[i], lengths[j]);
            shipsNonoverlapping[k].ships[0][0] <== ships[i][0];
            shipsNonoverlapping[k].ships[0][1] <== ships[i][1];
            shipsNonoverlapping[k].ships[0][2] <== ships[i][2];
            shipsNonoverlapping[k].ships[1][0] <== ships[j][0];
            shipsNonoverlapping[k].ships[1][1] <== ships[j][1];
            shipsNonoverlapping[k].ships[1][2] <== ships[j][2];

            k += 1;
        }
    }

    // Compute a hash committing to the configuration of this board,
    // salted with a user provided trapdoor to prevent opponent guessing
    // by bruteforce.
    component hasher = MiMCSponge(16, 220, 1);
    hasher.k <== 0;
    hasher.ins[15] <== trapdoor;
    for (var i = 0; i < 15; i++) {
        hasher.ins[i] <== ships[i \ 3][i % 3];
    }

    hash <== hasher.outs[0];
}

component main = BoardEligibility();