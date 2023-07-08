import 'package:flutter/material.dart';

class WalletSliverPersistentHeaderDelegate
    extends SliverPersistentHeaderDelegate {
  final double minHeight;
  final double maxHeight;
  final Widget collapsedChild;
  final Widget expandedChild;

  WalletSliverPersistentHeaderDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.collapsedChild,
    required this.expandedChild,
  });

  @override
  double get minExtent => minHeight;

  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    if (shrinkOffset == 0) {
      return SizedBox.expand(child: expandedChild);
    } else if (shrinkOffset >= 10) {
      return SizedBox.expand(child: collapsedChild);
    } else {
      final double percentage = 1 - (shrinkOffset / (maxExtent - minExtent));
      return SizedBox.expand(
        child: Stack(
          children: [
            Opacity(
              opacity: percentage,
              child: expandedChild,
            ),
            Opacity(
              opacity: 1 - percentage,
              child: collapsedChild,
            ),
          ],
        ),
      );
    }
  }

  @override
  bool shouldRebuild(
      covariant WalletSliverPersistentHeaderDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        collapsedChild != oldDelegate.collapsedChild ||
        expandedChild != oldDelegate.expandedChild;
  }
}
