// 处理字符串，超过十位中间为省略号
import 'package:clipboard/clipboard.dart';
import 'package:flutter/material.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';

String addressFormat(String str) {
  if (str.length > 18) {
    return '${str.substring(0, 6)}...${str.substring(str.length - 6)}';
  } else {
    return str;
  }
}

// 传入wei返回eth, 保留两位小数
String weiToEth(String? wei) {
  if (wei == null) {
    return '0.00';
  }
  return formatNum(BigInt.parse(wei) / BigInt.from(10).pow(18));
}

// 格式化处理数字，给double保留两位小数添加千分位
String formatNum(double num) {
  return num.toStringAsFixed(2).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?:$|\.))'),
      (Match match) => '${match[1]},');
}

// 复制到剪切板
void copyToClipboard(String content) {
  FlutterClipboard.copy(content).then((value) {
    EasyLoading.showToast('复制成功');
  });
}

// 显示消息内容
void showHelpContent({
  required String title,
  required String content,
  String? confirmText,
}) {
  Get.defaultDialog(
    title: title,
    content: Column(
      children: [
        Text(
          content,
          style: TextStyle(fontSize: 14.sp),
        ),
        TextButton(
            onPressed: () {
              Get.back();
            },
            child: Text(
              confirmText ?? '',
              style: TextStyle(fontSize: 12.sp),
            ))
      ],
    ),
    confirmTextColor: Colors.white,
    backgroundColor: const Color(0xFF000000),
    titleStyle: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w600),
    contentPadding: EdgeInsets.only(top: 15.w, left: 15.w, right: 15.w),
    titlePadding: EdgeInsets.only(top: 15.w, left: 15.w, right: 15.w),
  );
}
