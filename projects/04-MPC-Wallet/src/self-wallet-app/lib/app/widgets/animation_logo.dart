import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class AnimationLogo extends StatefulWidget {
  @override
  _AnimationLogoState createState() => _AnimationLogoState();
}

class _AnimationLogoState extends State<AnimationLogo>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  double opacityValue = 0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _controller.addListener(() {
      setState(() {
        opacityValue = _controller.value;
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 50.w,
      height: 50.w,
      child: AnimatedOpacity(
        opacity: opacityValue,
        duration: const Duration(milliseconds: 100),
        child: Image.asset('assets/images/logo-mpc-light.png'),
      ),
    );
  }
}
