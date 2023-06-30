import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:flutter/src/widgets/placeholder.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class UnitSettingWidget extends StatelessWidget {
  const UnitSettingWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height * 0.8,
      // color: Colors.amber,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Padding(
              padding: EdgeInsets.symmetric(vertical: 10.h),
              child: Center(
                child: Container(
                  width: 44.w,
                  height: 4.w,
                  decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(2.w)),
                ),
              ),
            ),
          ),
          SizedBox(height: 10.w),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 15.w),
            child: Text(
              "选择货币单位",
              style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w700),
            ),
          ),
          SizedBox(height: 20.w),
          Expanded(
              child: ListView.builder(
            padding: EdgeInsets.only(bottom: 50.sp),
            itemCount: 2,
            itemBuilder: (BuildContext context, int index) {
              return ListTile(
                onTap: () {},
                minLeadingWidth: 5.w,
                trailing: index % 2 == 0
                    ? Icon(
                        Icons.check_rounded,
                        color: Theme.of(context).colorScheme.primary,
                      )
                    : null,
                title: Text(index % 2 == 0 ? "CNY" : "HKD",
                    style: TextStyle(
                        fontSize: 16.sp,
                        color: index % 2 == 0
                            ? Theme.of(context).colorScheme.primary
                            : Colors.white70)),
              );
            },
          ))
        ],
      ),
    );
  }
}
