pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/mimcsponge.circom";

include "./templates/shiphit.circom";

template RevealAttack() {
    // The x, y, z of ship positions.
    signal input ships[5][3];
    // A user held secret that prevents others from brute forcing the board's configuration
    signal input trapdoor;
    signal input hash;

    // The linearized coordinate of the player's shot.
    signal input shotIndex;

    signal output hitShipId;

    // The length of each ship in the order used.
    var lengths[5] = [5, 4, 3, 3, 2];

    // Verify that the specified ship configuration matches with that of the committed hash.
    component hasher = MiMCSponge(16, 220, 1);
    hasher.k <== 0;
    hasher.ins[15] <== trapdoor;
    for (var i = 0; i < 15; i++) {
        hasher.ins[i] <== ships[i \ 3][i % 3];
    }

    hasher.outs[0] === hash;

    // Compute which ship the shot hit.
    // Use "<--" on shotIndex here to avoid snarkjs bug with proof completeness.
    // TODO: Investigate snarkjs bug.
    signal shot[2];
    shot[1] <-- shotIndex \ 10;
    shot[0] <== shotIndex - shot[1] * 10;

    shot[1] * 10 + shot[0] === shotIndex;

    component shipHits[5];
    component shipBitlistToInteger = Bits2Num_strict();

    for (var i = 0; i < 5; i++) {
        shipHits[i] = ShipHit(lengths[i]);
        shipHits[i].ship[0] <== ships[i][0];
        shipHits[i].ship[1] <== ships[i][1];
        shipHits[i].ship[2] <== ships[i][2];
        shipHits[i].shot[0] <== shot[0];
        shipHits[i].shot[1] <== shot[1];

        shipBitlistToInteger.in[i] <== shipHits[i].hit;
    }

    // Output the ship hit bitlist as an integer.
    for (var i = 5; i < 254; i++) {
        shipBitlistToInteger.in[i] <== 0;
    }

    hitShipId <== shipBitlistToInteger.out;
}

component main { public [hash, shotIndex] } = RevealAttack();