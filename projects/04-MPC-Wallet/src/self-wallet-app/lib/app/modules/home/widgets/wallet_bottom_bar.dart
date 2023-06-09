import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class WalletBottomNavigationBar extends StatefulWidget {
  final int currentIndex;
  final void Function(int) onTap;

  WalletBottomNavigationBar({required this.currentIndex, required this.onTap});

  @override
  _WalletBottomNavigationBarState createState() =>
      _WalletBottomNavigationBarState();
}

class _WalletBottomNavigationBarState extends State<WalletBottomNavigationBar> {
  @override
  Widget build(BuildContext context) {
    return Theme(
        data: Theme.of(context).copyWith(
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
        ),
        child: BottomNavigationBar(
          currentIndex: widget.currentIndex,
          onTap: widget.onTap,
          showSelectedLabels: true,
          showUnselectedLabels: false,
          selectedItemColor: Colors.white,
          // backgroundColor: widget.currentIndex != 1
          //     ? Colors.black
          //     : Theme.of(context).colorScheme.surface,
          enableFeedback: false,
          items: [
            BottomNavigationBarItem(
                icon: Image.asset(
                  'assets/icons/home.png',
                  width: 24.w,
                ),
                activeIcon: Image.asset(
                  'assets/icons/home_select.png',
                  width: 24.w,
                ),
                label: "首页"),
            BottomNavigationBarItem(
                icon: Image.asset(
                  'assets/icons/swap.png',
                  width: 24.w,
                ),
                activeIcon: Image.asset(
                  'assets/icons/swap_select.png',
                  width: 24.w,
                ),
                label: "兑换"),
            BottomNavigationBarItem(
                icon: Image.asset(
                  'assets/icons/profile.png',
                  width: 24.w,
                ),
                activeIcon: Image.asset(
                  'assets/icons/profile_select.png',
                  width: 24.w,
                ),
                label: "我的"),
          ],
        ));
  }
}
