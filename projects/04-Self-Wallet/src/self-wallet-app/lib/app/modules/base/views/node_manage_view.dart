import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:get/get.dart';
import 'package:sunrise/core/utils/common.dart';
import '../controllers/node_network_controller.dart';

class NodeManageView extends GetView {
  const NodeManageView({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return GetBuilder(
      init: NodeNetworkController(),
      builder: (controller) => Scaffold(
        appBar: AppBar(
          title: Text(
            '节点设置',
            style: TextStyle(fontSize: 18.sp),
          ),
          centerTitle: false,
          leading: IconButton(
            onPressed: () {
              Get.back();
            },
            icon: Icon(
              Icons.arrow_back_ios_rounded,
              size: 18.sp,
            ),
          ),
          actions: [
            IconButton(
                onPressed: () {
                  controller.rePing();
                },
                icon: const Icon(Icons.speed_rounded))
          ],
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              ...List.generate(
                  controller.nodeNetworkList.length,
                  (index) => ListTile(
                      title: Text(controller.nodeNetworkList[index].chainName),
                      subtitle: Text(
                        controller.nodeNetworkList[index].rpc,
                        overflow: TextOverflow.ellipsis,
                        style:
                            TextStyle(fontSize: 12.sp, color: Colors.white54),
                      ),
                      // onTap: () {
                      //   // controller.changeNodeNetwork(index);
                      // },
                      trailing:
                          _pingSpeedLabel(controller.pingSpeedList[index])))
            ],
          ),
        ),
      ),
    );
  }

  // 根据speed值返回不同的颜色
  Color speedColors(int speed) {
    if (speed < 200 && speed > 0) {
      return Colors.green;
    } else if (speed < 300) {
      return Colors.yellow;
    } else {
      return Colors.red;
    }
  }

  Widget _pingSpeedLabel(int speed) {
    return SizedBox(
      width: 100.w,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 10.w,
            height: 10.w,
            decoration: BoxDecoration(
                color: speedColors(speed),
                borderRadius: BorderRadius.circular(10.w)),
          ),
          SizedBox(
            width: 5.w,
          ),
          SizedBox(
            width: 50.w,
            child: Text(
              speed == 0 ? "连接失败" : "$speed ms",
              textAlign: TextAlign.right,
              style: TextStyle(fontSize: 12.sp, color: speedColors(speed)),
            ),
          )
        ],
      ),
    );
  }
}
