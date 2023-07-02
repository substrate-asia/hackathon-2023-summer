import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_cache_manager/flutter_cache_manager.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:get/get.dart';

class ImageWidget extends StatelessWidget {
  final String imageUrl;
  final double width;
  final double height;

  ImageWidget({
    required this.imageUrl,
    required this.width,
    required this.height,
  });

  @override
  Widget build(BuildContext context) {
    // 判断imageUrl是否为svg
    if (imageUrl.contains('.svg')) {
      return SvgPicture.network(
        imageUrl,
        width: width,
        height: height,
        placeholderBuilder: (BuildContext context) {
          return Container(
            width: width,
            height: height,
            color: Colors.grey,
          );
        },
      );
    }

    return CachedNetworkImage(
      imageUrl: imageUrl,
      width: width,
      height: height,
      cacheManager: DefaultCacheManager(),
      placeholder: (BuildContext context, String url) {
        return Container(
          width: width,
          height: height,
          color: Colors.grey,
        );
      },
      errorWidget: (BuildContext context, String url, dynamic error) {
        return Container(
          width: width,
          height: height,
          color: Colors.grey,
          child: Icon(Icons.error),
        );
      },
    );
  }
}
