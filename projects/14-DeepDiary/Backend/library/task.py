import os
import pickle
import time
from datetime import datetime

from celery import shared_task
from django.db.models import Count
from pyexiv2 import Image as exivImg

from deep_diary.config import wallet_info
from face.models import Face
from face.task import set_face_mcs
from library.gps import GPS_format, GPS_to_coordinate, GPS_get_address
from library.imagga import imagga_post
from library.models import Img, ColorBackground, Category, ImgCategory, Address, Date, Evaluate
from library.serializers import McsSerializer, McsDetailSerializer, ColorSerializer, ColorBackgroundSerializer, \
    ColorForegroundSerializer, ColorImgSerializer
from mycelery.main import app
from utils.mcs_storage import upload_file_pay

color_palette = {
    "beige": '#e0c4b2',
    "hot pink": '#c73d77',
    "magenta": '#a7346e',
    "red": '#ae2935',
    "black": '#39373b',
    "teal": '#426972',
    "lavender": '#6a6378',
    "maroon": '#6c2135',
    "blue": '#2f5e97',
    "light blue": '#99b1cb',
    "mauve": '#ac6075',
    "turquoise": '#38afcd',
    "brown": '#574039',
    "navy blue": '#2b2e43',
    "violet": '#473854',
    "dark green": '#176352',
    "light brown": '#ac8a64',
    "orange": '#e2855e',
    "white": '#f4f5f0',
    "gold": '#dcba60',
    "light green": '#aec98e',
    "pink": '#e3768c',
    "yellow": '#ebd07f',
    "green": '#359369',
    "olive green": '#7f8765',
    "plum": '#58304e',
    "skin": '#bd9769',
    "greige": '#a4b39f',
    "light grey": '#bcb8b8',
    "purple": '#875287',
    "grey": '#8c8c8c',
    "light pink": '#e6c1be',
}


# @app.task
@shared_task
def send_email(name):
    print("向%s发送邮件..." % name)
    time.sleep(5)
    print("向%s发送邮件完成" % name)
    return "ok"


# @app.task
# @shared_task
# def save_img_info(instance):
#     print(f'INFO: **************img instance have been created, saving img info now...')
#     lm_tags = []
#     img_read = exivImg(instance.src.path)  # 登记图片路径
#     exif = img_read.read_exif()  # 读取元数据，这会返回一个字典
#     iptc = img_read.read_iptc()  # 读取元数据，这会返回一个字典
#     xmp = img_read.read_xmp()  # 读取元数据，这会返回一个字典
#     if exif:
#         print(f'INFO: exif is true ')
#         instance.longitude_ref = exif.get('Exif.GPSInfo.GPSLongitudeRef')
#         if instance.longitude_ref:  # if have longitude info
#             instance.longitude = GPS_format(
#                 exif.get('Exif.GPSInfo.GPSLongitude'))  # exif.get('Exif.GPSInfo.GPSLongitude')
#             instance.latitude_ref = exif.get('Exif.GPSInfo.GPSLatitudeRef')
#             instance.latitude = GPS_format(exif.get('Exif.GPSInfo.GPSLatitude'))
#
#         instance.altitude_ref = exif.get('Exif.GPSInfo.GPSAltitudeRef')  # 有些照片无高度信息
#         if instance.altitude_ref:  # if have the altitude info
#             instance.altitude_ref = float(instance.altitude_ref)
#             instance.altitude = exif.get('Exif.GPSInfo.GPSAltitude')  # 根据高度信息，最终解析成float 格式
#             alt = instance.altitude.split('/')
#             instance.altitude = float(alt[0]) / float(alt[1])
#         print(f'instance.longitude {instance.longitude},instance.latitude {instance.latitude}')
#         is_located = False
#         if instance.longitude and instance.latitude:
#             # 是否包含经纬度数据
#             instance.is_located = True
#             long_lati = GPS_to_coordinate(instance.longitude, instance.latitude)
#             instance.location, instance.district, instance.city, instance.province, instance.country = GPS_get_address(
#                 long_lati)
#
#         instance.camera_brand = exif.get('Exif.Image.Make')
#         instance.camera_model = exif.get('Exif.Image.Model')
#
#     if iptc:
#         print(f'INFO: iptc is true ')
#         instance.title = iptc.get('iptc.Application2.ObjectName')
#         instance.caption = iptc.get('Iptc.Application2.Caption')  # Exif.Image.ImageDescription
#         lm_tags = iptc.get('Iptc.Application2.Keywords')
#
#     if xmp:
#         print(f'INFO: xmp is true ')
#         instance.label = xmp.get('Xmp.xmp.Label')  # color mark
#         instance.rating = xmp.get('Xmp.xmp.Rating')
#         if instance.rating:
#             instance.rating = int(xmp.get('Xmp.xmp.Rating'))
#
#     # print(f"INFO: instance.src.width: {instance.src.width}")
#     # print(f"INFO: instance.src.height: {instance.src.height}")
#     instance.wid = instance.src.width
#     instance.height = instance.src.height
#     instance.aspect_ratio = instance.height / instance.wid
#     instance.is_exist = True
#     instance.save()
#
#     if lm_tags:
#         print(f'INFO: the lm_tags is {lm_tags}, type is {type(lm_tags)}')
#         print(f'INFO: the instance id is {instance.id}')
#         # time.sleep(5)  # Delays for 5 seconds. You can also use a float value.
#         instance.tags.set(lm_tags)  # 这里一定要在实例保存后，才可以设置外键，不然无法进行关联
#         # obj = Img.objects.get(id=instance.id)
#         # obj.tags.set(lm_tags)

# @app.task
# @shared_task
def set_img_mcs(img):  # img = self.get_object()  # 获取详情的实例对象
    if not hasattr(img, 'mcs'):  # 判断是否又对应的mcs存储

        data = upload_file_pay(wallet_info, img.src.path)
        # 调用序列化器进行反序列化验证和转换
        data.update(id=img.id)
        print(data)
        serializer = McsDetailSerializer(data=data)
        # 当验证失败时,可以直接通过声明 raise_exception=True 让django直接跑出异常,那么验证出错之后，直接就再这里报错，程序中断了就

        result = serializer.is_valid(raise_exception=True)
        print(serializer.errors)  # 查看错误信息

        # 获取通过验证后的数据
        print(serializer.validated_data)  # form -- clean_data
        # 保存数据
        mcs_obj = serializer.save()

        msg = 'success to make a copy into mac, the file_upload_id is %d' % mcs_obj.file_upload_id

    else:
        msg = 'there is already have mac info related to this img: file id is %d' % img.mcs.file_upload_id

    print(msg)


# @shared_task
def set_all_img_mcs():
    print('-----------------start upload all the imgs to mcs-----------------')
    imgs = Img.objects.filter(mcs__isnull=True)
    for (img_idx, img) in enumerate(imgs):
        print(f'--------------------INFO: This is img{img_idx}: {img.id} ---------------------')
        set_img_mcs(img)
    print('------------all the imgs have been uploaded to mcs----------------')

    print('-----------------start upload all the faces to mcs-----------------')
    fcs = Face.objects.filter(mcs__isnull=True)
    for (fc_idx, fc) in enumerate(fcs):
        print(f'--------------------NFO: This is face{fc_idx}: {fc.name}---------------------')
        set_face_mcs(fc)
    print('------------all the faces have been uploaded to mcs----------------')

    print('----end----')


# @shared_task
def set_img_tags(img_obj):
    img_path = img_obj.src.path
    endpoint = 'tags'
    tagging_query = {
        'verbose': False,
        'language': 'en',
        'threshold': 25,
    }

    response = imagga_post(img_path, endpoint, tagging_query)
    # with open("tags.txt", 'wb') as f:  # store the result object, which will helpful for debugging
    #     pickle.dump(response, f)
    #
    # with open("tags.txt", 'rb') as f:  # during the debug, we could using the local stored object. since the api numbers is limited
    #     response = pickle.load(f)

    if 'result' in response:
        tags = response['result']['tags']
        tag_list = []

        for tag in tags:
            tag_list.append(tag['tag']['en'])

        # img_obj.tags.set(tag_list)
        img_obj.tags.add(*tag_list)
        print(f'--------------------{img_obj.id} :tags have been store to the database---------------------------')


# @shared_task
def set_all_img_tags():
    imgs = Img.objects.all()
    for img in imgs:
        set_img_tags(img)


# @shared_task
def set_img_colors(img_obj):
    # this is through post method to get the tags. mainly is used for local img
    img_path = img_obj.src.path
    endpoint = 'colors'
    # color_query = {                 #  if it is necessary, we could add the query info here
    #     'verbose': False,
    #     'language': False,
    #     'threshold': 25.0,
    # # }

    response = imagga_post(img_path, endpoint)
    # print(response)
    # with open("colors.txt", 'wb') as f:  # store the result object, which will helpful for debugging
    #     pickle.dump(response, f)

    # with open("colors.txt", 'rb') as f:  # during the debug, we could using the local stored object. since the api numbers is limited
    #     response = pickle.load(f)

    # print(response)

    if response['status']['type'] != 'success':
        return []

    if 'result' in response:
        colors = response['result'][endpoint]
        background_colors = colors['background_colors']
        foreground_colors = colors['foreground_colors']
        image_colors = colors['image_colors']

        # print(colors)

        # 调用序列化器进行反序列化验证和转换
        colors.update(img=img_obj.id)  # bind the one to one field image info
        if not hasattr(img_obj, 'colors'):  # if img_obj have no attribute of colors, then create it
            print('no colors object existed')
            serializer = ColorSerializer(data=colors)
        else:  # if img_obj already have attribute of colors, then updated it
            print('colors object already existed')
            serializer = ColorSerializer(img_obj.colors, data=colors)
        result = serializer.is_valid(raise_exception=True)
        color_obj = serializer.save()

        # print(type(color_obj))
        # print(color_obj.background.all().exists())
        # print(color_obj.foreground.all().exists())
        # print(color_obj.image.all().exists())

        if not color_obj.background.all().exists():
            for bk in background_colors:
                bk.update(color=color_obj.pk)
                serializer = ColorBackgroundSerializer(data=bk)
                result = serializer.is_valid(raise_exception=True)
                back_color_obj = serializer.save()
        # else:
        # for bk in background_colors:
        #     bk.update(color=color_obj.pk)
        #     serializer = ColorBackgroundSerializer(color_obj.background, data=bk)
        #     result = serializer.is_valid(raise_exception=True)
        #     back_color_obj = serializer.save()

        if not color_obj.foreground.all().exists():
            for fore in foreground_colors:
                fore.update(color=color_obj.pk)
                serializer = ColorForegroundSerializer(data=fore)
                result = serializer.is_valid(raise_exception=True)
                fore_color_obj = serializer.save()
        # else:
        #     for fore in foreground_colors:
        #         fore.update(color=color_obj.pk)
        #         serializer = ColorForegroundSerializer(color_obj.foreground, data=fore)
        #         result = serializer.is_valid(raise_exception=True)
        #         fore_color_obj = serializer.save()

        if not color_obj.image.all().exists():
            for img in image_colors:
                img.update(color=color_obj.pk)
                serializer = ColorImgSerializer(data=img)
                result = serializer.is_valid(raise_exception=True)
                img_color_obj = serializer.save()
        # else:
        #     for img in image_colors:
        #         img.update(color=color_obj.pk)
        #         serializer = ColorImgSerializer(color_obj.image, data=img)
        #         result = serializer.is_valid(raise_exception=True)
        #         img_color_obj = serializer.save()
        print(f'--------------------{img_obj.id} :colors have been store to the database---------------------------')


# @shared_task
def set_all_img_colors():
    imgs = Img.objects.all()
    for img in imgs:
        set_img_colors(img)


# @shared_task
def set_img_categories(img_obj):
    img_path = img_obj.src.path
    endpoint = 'categories/personal_photos'

    response = imagga_post(img_path, endpoint)
    # with open("categories.txt", 'wb') as f:  # store the result object, which will helpful for debugging
    #     pickle.dump(response, f)

    # with open("categories.txt",
    #           'rb') as f:  # during the debug, we could using the local stored object. since the api numbers is limited
    #     response = pickle.load(f)

    if 'result' in response:
        categories = response['result']['categories']
        categories_list = []
        img_cate_list = []
        data = {}

        for item in categories:
            # obj = Category(name=item['name']['en'], confidence=item['confidence'])
            checkd_obj = Category.objects.filter(name=item['name']['en'])
            if checkd_obj.exists():
                # print(f'--------------------categories have already existed---------------------------')
                # return
                obj = checkd_obj.first()
            else:
                obj = Category.objects.create(name=item['name']['en'])

            if ImgCategory.objects.filter(img=img_obj, category=obj).exists():
                print(f'--------------------ImgCategory have already existed---------------------------')
                continue
            item = ImgCategory(img=img_obj, category=obj, confidence=item['confidence'])
            img_cate_list.append(item)
            categories_list.append(obj)

        ImgCategory.objects.bulk_create(img_cate_list)

        # img_obj.categories.add(*categories_list, through_defaults=confidence_list)

        print(
            f'--------------------{img_obj.id} :categories have been store to the database---------------------------')


# @shared_task
def set_all_img_categories():
    imgs = Img.objects.all()
    for img in imgs:
        set_img_categories(img)


def set_img_date(date_str):  # '%Y:%m:%d %H:%M:%S'
    date = Date()
    if not date_str:
        date_str = '1970:01:01 00:00:00'

    tt = datetime.strptime(date_str, '%Y:%m:%d %H:%M:%S')

    date.capture_date = tt.strftime("%Y-%m-%d")
    date.capture_time = tt.strftime("%H:%M:%S")
    date.year = str(tt.year).rjust(2, '0')
    date.month = str(tt.month).rjust(2, '0')
    date.day = str(tt.day).rjust(2, '0')

    if tt.weekday() < 5:
        date.is_weekend = False
    else:
        date.is_weekend = True
    if 0 < tt.hour < 5:
        date.earthly_branches = 0  # 这个判断需要后续完善，可以直接把字符串格式化后，再判读时间是否属于朝九晚五
    elif 5 < tt.hour < 8:
        date.earthly_branches = 1
    elif 8 < tt.hour < 17:
        date.earthly_branches = 2
    elif 17 < tt.hour < 21:
        date.earthly_branches = 3
    else:
        date.earthly_branches = 4

    return date


# @shared_task
def set_img_info(instance):
    print(f'INFO: **************img instance have been created, saving img info now...')

    addr = Address()
    eval = Evaluate()
    date = Date()
    lm_tags = []
    img_read = exivImg(instance.src.path)  # 登记图片路径
    exif = img_read.read_exif()  # 读取元数据，这会返回一个字典
    iptc = img_read.read_iptc()  # 读取元数据，这会返回一个字典
    xmp = img_read.read_xmp()  # 读取元数据，这会返回一个字典
    if exif:
        print(f'INFO: exif is true ')
        # deal with timing
        date_str = exif['Exif.Photo.DateTimeOriginal']
        date = set_img_date(date_str)  # return the date instance

        # deal with address
        addr.longitude_ref = exif.get('Exif.GPSInfo.GPSLongitudeRef')
        if addr.longitude_ref:  # if have longitude info
            addr.longitude = GPS_format(
                exif.get('Exif.GPSInfo.GPSLongitude'))  # exif.get('Exif.GPSInfo.GPSLongitude')
            addr.latitude_ref = exif.get('Exif.GPSInfo.GPSLatitudeRef')
            addr.latitude = GPS_format(exif.get('Exif.GPSInfo.GPSLatitude'))

        addr.altitude_ref = exif.get('Exif.GPSInfo.GPSAltitudeRef')  # 有些照片无高度信息
        if addr.altitude_ref:  # if have the altitude info
            addr.altitude_ref = float(addr.altitude_ref)
            addr.altitude = exif.get('Exif.GPSInfo.GPSAltitude')  # 根据高度信息，最终解析成float 格式
            alt = addr.altitude.split('/')
            addr.altitude = float(alt[0]) / float(alt[1])
        addr.is_located = False
        if addr.longitude and addr.latitude:
            # 是否包含经纬度数据
            addr.is_located = True
            long_lati = GPS_to_coordinate(addr.longitude, addr.latitude)
            # TODO: need update the lnglat after transform the GPS info
            addr.longitude = round(long_lati[0], 6)  # only have Only 6 digits of precision for AMAP
            addr.latitude = round(long_lati[1], 6)
            # print(f'instance.longitude {addr.longitude},instance.latitude {addr.latitude}')
            long_lati = f'{long_lati[0]},{long_lati[1]}'  # change to string

            addr.location, addr.district, addr.city, addr.province, addr.country = GPS_get_address(
                long_lati)

        instance.camera_brand = exif.get('Exif.Image.Make')
        instance.camera_model = exif.get('Exif.Image.Model')

    if iptc:
        print(f'INFO: iptc is true ')
        instance.title = iptc.get('iptc.Application2.ObjectName')
        instance.caption = iptc.get('Iptc.Application2.Caption')  # Exif.Image.ImageDescription
        lm_tags = iptc.get('Iptc.Application2.Keywords')

    if xmp:
        print(f'INFO: xmp is true ')
        instance.label = xmp.get('Xmp.xmp.Label')  # color mark
        eval.rating = int(xmp.get('Xmp.xmp.Rating', 0))
        # if eval.rating:
        #     eval.rating = int(xmp.get('Xmp.xmp.Rating'))

    instance.wid = instance.src.width
    instance.height = instance.src.height
    instance.aspect_ratio = instance.height / instance.wid
    instance.is_exist = True
    instance.save()   # save the image instance, already saved during save the author

    if lm_tags:
        print(f'INFO: the lm_tags is {lm_tags}, type is {type(lm_tags)}')
        print(f'INFO: the instance id is {instance.id}')
        # instance.tags.set(lm_tags)  # 这里一定要在实例保存后，才可以设置外键，不然无法进行关联
        instance.tags.add(*lm_tags)  # 这里一定要在实例保存后，才可以设置外键，不然无法进行关联

    addr.img = instance
    eval.img = instance
    date.img = instance
    addr.save()
    eval.save()
    date.save()
    print(
        f'--------------------{instance.id} :img infos have been store to the database---------------------------')


# @shared_task
def set_all_img_info():
    imgs = Img.objects.all()
    for img in imgs:
        set_img_info(img)


@shared_task
def img_process(instance):
    set_img_info(instance)  # if this add the delay function, this function will be processed by celery
    set_img_tags(instance)  # if this add the delay function, this function will be processed by celery
    set_img_colors(instance)  # if this add the delay function, this function will be processed by celery
    set_img_categories(instance)  # if this add the delay function, this function will be processed by celery
    # set_img_mcs(instance)
    instance.refresh_from_db()

    add_img_face_to_category(instance)
    add_img_addr_to_category(instance)
    add_img_colors_to_category(instance)


# @shared_task
def add_img_face_to_category(img_obj):
    if not hasattr(img_obj, 'faces'):
        print(f"\033[1;32m ----------{img_obj.id} INFO: there is no faces info in this img--------- \033[0m")
        return
    # check whether has the unknown face, unknown means unnamed
    fc_unknown_obj = img_obj.faces.filter(name__startswith='unknown')
    if fc_unknown_obj.exists():
        print(f'\033[1;32m ----------{img_obj.id} INFO: there is unknown face in this img---------- \033[0m')
        return
    names = img_obj.faces.order_by('name').values_list('name', flat=True)
    name_cnt = names.count()
    name_str = 'no face'  # default
    if name_cnt <= 1:
        # print(
        #     f'----------------{img_obj.id} :return-->this is the single or no face-----------------------')
        return
    elif 1 < name_cnt <= 6:  # if faces biger then 1, small then 6
        # print(
            # f'----------------{img_obj.id} :found the face group-----------------------')
        name_str = ','.join(names)
    elif name_cnt > 6:  # if faces biger then 5, then break
        # print(
        #     f'----------------{img_obj.id} :too many faces in the img-----------------------')
        name_str = 'group face'

    rst = Category.objects.filter(type='group', name=name_str)

    if rst.exists():
        rst = rst.first()
        # rst.img.add(*img_set)
        print(f"\033[1;32m --------{img_obj.id} :img group have been added to the database------------ \033[0m")
    else:
        rst = Category.objects.create(name=name_str, type='group', numeric_value=name_cnt, avatar=img_obj.src)
        print(f"\033[1;32m --------{img_obj.id} :img group have been created to the database---------- \033[0m")
        # rst.img.set(img_set)
    rst.img.add(img_obj)


@shared_task
def add_all_img_face_to_category():
    imgs = Img.objects.all()
    for img in imgs:
        add_img_face_to_category(img)


# @shared_task
def add_img_addr_to_category(img_obj):
    if not hasattr(img_obj, 'address'):
        print(f'\033[1;32m ----------{img_obj.id} INFO: there is no address info in this img--------- \033[0m')
        return
    city = img_obj.address.city
    if city is None:
        # print(f'----------------{img_obj.id} :there is no address info in this img---------------------')
        city = 'No GPS'

    rst, created = Category.objects.get_or_create(name=city, type='address')

    rst.img.add(img_obj)
    if created:
        print(f'\033[1;32m --------{img_obj.id} :img address have been created to the database-------- \033[0m')
    else:
        print(f'\033[1;32m --------{img_obj.id} :img address have been added to the database---------- \033[0m')


@shared_task
def add_all_img_addr_to_category():
    imgs = Img.objects.all()
    for img in imgs:
        add_img_addr_to_category(img)


# @shared_task
def add_img_colors_to_category(img_obj):
    if not hasattr(img_obj, 'colors'):
        print(f'----------{img_obj.id} INFO: there is no color info in this img---------')
        return
        # Color fetch here later
        # set_img_colors(img_obj)
        # img_obj.refresh_from_db()  # refresh the result from the database since the color is checked

    img_colors = img_obj.colors.image.all()
    fore_colors = img_obj.colors.foreground.all()
    back_colors = img_obj.colors.background.all()
    for color in img_colors:
        cate_obj = Category.objects.filter(name=color.closest_palette_color_parent, type='img_color')  # checking whether exist this palette
        if cate_obj.exists():
            cate_obj = cate_obj.first()
            print(f'\033[1;32m --------{img_obj.id} :img colors have been added to the category database---- \033[0m')
        else:
            cate_obj = Category.objects.create(name=color.closest_palette_color_parent, type='img_color',
                                               value=color_palette[color.closest_palette_color_parent])
            print(f'\033[1;32m --------{img_obj.id} :img colors have been created to the category database---- \033[0m')
        cate_obj.img.add(img_obj)

    for color in fore_colors:
        cate_obj = Category.objects.filter(name=color.closest_palette_color_parent, type='fore_color')  # checking whether exist this palette
        if cate_obj.exists():
            cate_obj = cate_obj.first()
            print(f'\033[1;32m --------{img_obj.id} :fore colors have been added to the category database---- \033[0m')
        else:
            cate_obj = Category.objects.create(name=color.closest_palette_color_parent, type='fore_color',
                                               value=color_palette[color.closest_palette_color_parent])
            print(f'\033[1;32m --------{img_obj.id} :fore colors have been created to the category database---- \033[0m')
        cate_obj.img.add(img_obj)

    for color in back_colors:
        cate_obj = Category.objects.filter(name=color.closest_palette_color_parent, type='back_color')  # checking whether exist this palette
        if cate_obj.exists():
            cate_obj = cate_obj.first()
            print(f'\033[1;32m --------{img_obj.id} :back colors have been added to the category database---- \033[0m')
        else:
            cate_obj = Category.objects.create(name=color.closest_palette_color_parent, type='back_color',
                                               value=color_palette[color.closest_palette_color_parent])
            print(f'\033[1;32m --------{img_obj.id} :back colors have been created to the category database---- \033[0m')
        cate_obj.img.add(img_obj)


@shared_task
def add_all_img_colors_to_category():
    imgs = Img.objects.all()
    for img in imgs:
        add_img_colors_to_category(img)
