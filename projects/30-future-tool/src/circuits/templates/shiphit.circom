pragma circom 2.0.0;

include "../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../node_modules/circomlib/circuits/mux1.circom";

/// Determines whether or not the specified ship will be hit by the shot.
template ShipHit(length) {
    // The x and y coordinates of the ship and
    // a binary flag determining the orientation of the ship (0 is horizontal, 1 is vertical).
    signal input ship[3];
    // The x and y coordinates of the shot.
    signal input shot[2];

    signal output hit;

    // shot.x >= ship.x
    component startXGeq = GreaterEqThan(4);
    startXGeq.in[0] <== shot[0];
    startXGeq.in[1] <== ship[0];

    // shot.y >= ship.y
    component startYGeq = GreaterEqThan(4);
    startYGeq.in[0] <== shot[1];
    startYGeq.in[1] <== ship[1];

    // If the ship is horizontal...
    // shot.x <= ship.x + length - 1
    component endXLeq = LessEqThan(4);
    endXLeq.in[0] <== shot[0];
    endXLeq.in[1] <== ship[0] + length - 1;

    // shot.y <= ship.y
    component startYLeq = LessEqThan(4);
    startYLeq.in[0] <== shot[1];
    startYLeq.in[1] <== ship[1];

    /// If the ship is vertical...
    // shot.x <= ship.x
    component startXLeq = LessEqThan(4);
    startXLeq.in[0] <== shot[0];
    startXLeq.in[1] <== ship[0];

    // shot.y <= ship.y + length - 1
    component endYLeq = LessEqThan(4);
    endYLeq.in[0] <== shot[1];
    endYLeq.in[1] <== ship[1] + length - 1;

    component shipShotOrientationMuxer = Mux1();    
    shipShotOrientationMuxer.s <== ship[2];
    shipShotOrientationMuxer.c[0] <== endXLeq.out * startYLeq.out;
    shipShotOrientationMuxer.c[1] <== startXLeq.out * endYLeq.out;

    signal startWithinShotRange;
    startWithinShotRange <== startXGeq.out * startYGeq.out;

    // If the shot lies between the start and end of the ship then it hit.
    hit <== startWithinShotRange * shipShotOrientationMuxer.out;
}