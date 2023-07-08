import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class VerificationCodeInput extends StatefulWidget {
  // 验证码完成
  Function(String) onCompleted;
  Function(String) onChange;

  VerificationCodeInput(
      {Key? key, required this.onCompleted, required this.onChange})
      : super(key: key);

  @override
  VerificationCodeInputState createState() => VerificationCodeInputState();
}

class VerificationCodeInputState extends State<VerificationCodeInput> {
  final List<FocusNode> _focusNodes = _generateFocusNodes();
  final List<TextEditingController> _controllers =
      _generateTextEditingControllers();
  static final double _boxSize = 45.w;
  static const EdgeInsets _boxMargin = EdgeInsets.symmetric(horizontal: 0);
  static final double _fontSize = 18.w;
  static const int _maxLength = 6;
  static const String _hintText = '';

  String get codeStr =>
      _controllers.map((controller) => controller.text).join();

  static List<FocusNode> _generateFocusNodes() {
    return List.generate(_maxLength, (_) => FocusNode());
  }

  static List<TextEditingController> _generateTextEditingControllers() {
    return List.generate(_maxLength, (_) => TextEditingController());
  }

  void clear() {
    _controllers.forEach((controller) => controller.clear());
    _focusNodes[0].requestFocus();
  }

  @override
  void initState() {
    super.initState();
    _focusNodes[0].requestFocus();
  }

  @override
  void dispose() {
    _focusNodes.forEach((node) => node.dispose());
    _controllers.forEach((controller) => controller.dispose());
    super.dispose();
  }

  void _onChanged(String value, int index) {
    // 计算code调用onChange
    widget.onChange(codeStr);
    if (value.length == 1) {
      if (index < _maxLength - 1) {
        _focusNodes[index + 1].requestFocus();
      } else {
        // Submit the verification code
        _focusNodes[index].unfocus();
        // String code = _controllers.map((controller) => controller.text).join();
        print('Verification code submitted: $codeStr');
        widget.onCompleted(codeStr);
      }
    } else if (value.length > 1) {
      // 改变当前输入框的值
      _controllers[index].text = value.substring(value.length - 1);
      _focusNodes[index].unfocus();
      if (index < _maxLength - 1) {
        _focusNodes[index + 1].requestFocus();
      }
    }
  }

  void _onKeyPressed(RawKeyEvent event, int index) {
    if (event.logicalKey == LogicalKeyboardKey.backspace) {
      if (index > 0 && _controllers[index].text == '') {
        _focusNodes[index - 1].requestFocus();
      }
    }
  }

  Widget _buildTextField(int index) {
    return Container(
      width: _boxSize,
      height: _boxSize,
      margin: _boxMargin,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(5.w),
        color: Color(0xAF262626),
        // border: Border.all(color: Theme.of(context).colorScheme.primary),
      ),
      alignment: Alignment.center,
      child: RawKeyboardListener(
        focusNode: FocusNode(),
        onKey: (RawKeyEvent event) {
          _onKeyPressed(event, index);
        },
        child: TextField(
          controller: _controllers[index],
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          textAlignVertical: TextAlignVertical.center,
          style: TextStyle(fontSize: _fontSize),
          maxLength: _maxLength,
          focusNode: _focusNodes[index],
          decoration: InputDecoration(
              hintText: _hintText,
              hintStyle: TextStyle(fontSize: _fontSize),
              contentPadding: EdgeInsets.zero,
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5.w),
                borderSide: const BorderSide(
                  color: Colors.transparent,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(5.w),
                borderSide: BorderSide(
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
              counterText: ""),
          onChanged: (value) => _onChanged(value, index),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: List.generate(_maxLength, _buildTextField),
    );
  }
}
