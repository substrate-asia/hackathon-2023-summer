pragma circom 2.0.0;

include "../../../node_modules/circomlib/circuits/comparators.circom";
include "../../../node_modules/circomlib/circuits/mux1.circom";

/// Validate that the specified ship is within the range of the board.
template ShipWithinRange(length) {
    // The x and y coordinates of the ship and
    // a binary flag determining the orientation of the ship (0 is horizontal, 1 is vertical).
    signal input ship[3];

    /// Ensure that orientation is a binary flag.
    ship[2] * (1 - ship[2]) === 0;

    /// Ensure that the starting x and y coordinates of the ship are on the board.
    // x < 10
    component startXLt = LessThan(4);
    startXLt.in[0] <== ship[0];
    startXLt.in[1] <== 10;

    // y < 10
    component startYLt = LessThan(4);
    startYLt.in[0] <== ship[1];
    startYLt.in[1] <== 10;

    startXLt.out * startYLt.out === 1;

    /// For horizontal ship configurations...
    // x + length - 1 < 10
    component endXLt = LessThan(4);
    endXLt.in[0] <== ship[0] + length - 1;
    endXLt.in[1] <== 10;

    /// For vertical ship configurations...
    // y + length - 1 < 10
    component endYLt = LessThan(4);
    endYLt.in[0] <== ship[1] + length - 1;
    endYLt.in[1] <== 10;

    // Pick the right end constraint to apply based on the ship's orientation.
    component shipEndConstraintMuxer = Mux1();
    shipEndConstraintMuxer.s <== ship[2];
    shipEndConstraintMuxer.c[0] <== endXLt.out;
    shipEndConstraintMuxer.c[1] <== endYLt.out;

    shipEndConstraintMuxer.out === 1;
}