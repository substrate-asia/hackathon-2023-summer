/* import 'package:flutter/material.dart';

class RefreshTest extends StatefulWidget {
  @override
  _RefreshTestState createState() => _RefreshTestState();
}

class _RefreshTestState extends State<RefreshTest> {
  List<String> items = List.generate(20, (index) => "Item $index");

  Future<void> _refresh() async {
    // 模拟重新加载数据
    await Future.delayed(Duration(seconds: 2));
    setState(() {
      items = List.generate(20, (index) => "Item $index");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Custom Refresh Indicator'),
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        color: Colors.blue,
        backgroundColor: Colors.white,
        displacement: 40.0,
        child: ListView.builder(
          itemCount: items.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(items[index]),
            );
          },
        ),
        // 自定义刷新指示器
        // 注意：这里的child必须是一个Scrollable Widget，比如ListView、GridView等
        // 如果不是Scrollable Widget，会抛出异常
        // 如果需要自定义刷新指示器，可以使用第三方库，比如flutter_easyrefresh
        // https://pub.dev/packages/flutter_easyrefresh
        // 或者自己实现RefreshIndicator的build方法
        // https://api.flutter.dev/flutter/material/RefreshIndicator-class.html
        builder: (BuildContext context, Widget child,
            IndicatorController controller) {
          return AnimatedBuilder(
            animation: controller,
            builder: (BuildContext context, _) {
              return Container(
                height: controller.value * 40.0,
                child: Center(
                  child: CircularProgressIndicator(
                    value: controller.value,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
 */