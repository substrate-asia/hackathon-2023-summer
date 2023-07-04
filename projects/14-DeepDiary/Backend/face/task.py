# Create your views here.
from shutil import move

# Create your models here.
import os
import random
import string
from shutil import move

import cv2 as cv
import numpy as np
from PIL import Image as Image_PIL
# Create your models here.
from celery import shared_task
# Create your models here.
from django.db.models import Count
from insightface.app import FaceAnalysis
from pyexiv2 import Image as Image_pyexiv2

# os.environ.setdefault('DJANGO_SETTING_MODULE', 'deep-diary.settings')
# django.setup()
from deep_diary.config import wallet_info
from deep_diary.settings import FACE_INFO_ROOT
# os.environ.setdefault('DJANGO_SETTING_MODULE', 'deep-diary.settings')
# django.setup()
from face.models import Face, FaceAlbum
from face.serializers import McsDetailSerializer
from utils.mcs_storage import upload_file_pay_face, upload_file_pay


class FaceInfo:
    def __init__(self):
        self.det_score = 0.0
        self.age = 0
        self.gender = 0
        # ndarrary
        self.normed_embedding = 0
        self.bbox = 0
        self.kps = 0
        self.landmark_2d_106 = 0
        self.landmark_3d_68 = 0
        self.pose = 0


# 通过LightRoom人脸识别的方式，保存相关人脸信息
def save_LM_faces(img):
    print(f'INFO: save_LM_faces ... ')
    names, bboxs = get_LM_face_info(img)
    face = Face()
    for [name, bbox] in [names, bboxs]:
        face.name = name
        face.x = bbox[0]
        face.y = bbox[1]
        face.wid = bbox[2] - bbox[0]  # bbox包含左上，右下2个坐标，但这里转换成长宽更有意义，便于更好的删选
        face.height = bbox[3] - bbox[1]
        print(f'INFO: bbox is {bbox}')
        face.img_id = img.id  # 绑定图片对象
        face.state = 0  # 已经保存了图片, "0:正常，1：禁用, 9: 已经删除"
        face.is_confirmed = True

        random_name = ''.join(random.sample(string.ascii_letters + string.digits, 5))
        # src_name = face.name + '_' + 'face_' + random_name + '.jpg'  # 其实不用包含facename的，这里加上去主要考虑在浏览器中查看
        src_name = 'face_' + random_name + '.jpg'  # 其实不用包含facename的，这里加上去主要考虑在浏览器中查看

        face.src = os.path.join('face', face.name, src_name)  # imagefiled 对应的路径名
        face.save()
        if not os.path.exists(os.path.dirname(face.src.path)):  # 确保路径存在，不存在则创建
            os.makedirs(os.path.dirname(face.src.path))

        save_src(face.src.path, img.src.path, bbox)  # 要保存的人脸路径，照片路径，人脸区域

        print(f'INFO: face name is {face.name}')


# 通过LightRoom人脸识别的方式，保存相关人脸信息
def get_LM_face_info(img):
    print(f'INFO: get_LM_face_info ... ')
    num = 1  # xmp 内容下表从1开始
    is_have_face = True

    exiv_info = Image_pyexiv2(img.src.path)  # 登记图片路径
    xmp = exiv_info.read_xmp()  # 读取元数据，这会返回一个字典
    names = []
    bboxs = []
    while is_have_face:
        item = 'Xmp.mwg-rs.Regions/mwg-rs:RegionList[{:d}]/mwg-rs:Type'.format(num)
        is_have_face = xmp.get(item)
        if is_have_face:
            print(f'INFO: LM face detected')
            idx_name = 'Xmp.mwg-rs.Regions/mwg-rs:RegionList[{:d}]/mwg-rs:Name'.format(num)
            idx_h = 'Xmp.mwg-rs.Regions/mwg-rs:RegionList[{:d}]/mwg-rs:Area/stArea:h'.format(num)
            idx_w = 'Xmp.mwg-rs.Regions/mwg-rs:RegionList[{:d}]/mwg-rs:Area/stArea:w'.format(num)
            idx_x = 'Xmp.mwg-rs.Regions/mwg-rs:RegionList[{:d}]/mwg-rs:Area/stArea:x'.format(num)
            idx_y = 'Xmp.mwg-rs.Regions/mwg-rs:RegionList[{:d}]/mwg-rs:Area/stArea:y'.format(num)
            num += 1

            name = xmp.get(idx_name, 'unknown')
            names.append(name)
            lm_face_area = [xmp.get(idx_x), xmp.get(idx_y), xmp.get(idx_w), xmp.get(idx_h)]  # 0~1 之间的字符
            lm_face_area = np.array(lm_face_area).astype(float)  # 0~1 之间的浮点，中心区域，人脸长，宽
            bbox = face_zoom(lm_face_area, 1, img.src.width, img.src.height)  # 转变成像素值，左上区域和右下区域坐标，跟insightface 保持一致
            bboxs.append(bbox)

    return names, bboxs


# 要保存的人脸路径，照片路径，人脸区域
def save_src(filepath, img_path, bbox):  # bbox 0，1 表示左上整数，2，3表示右下整数
    # if type(img) is str:
    #     img = Image_PIL.open(img)
    # else:
    #     img = img
    # img = cv.imread(img_path)  # 这里不用cv进行读取，理由是如果路径名包含中文，保存就会乱码
    img = Image_PIL.open(img_path)
    # print(f'INFO: face path is {filepath}')
    bbox = np.array(bbox).astype(int)
    if bbox.min() < 0:  # 不完整的人脸
        return
    region = img.crop(bbox)
    region.save(filepath)


def face_zoom(area, ratio, width, height):  # area: 中心坐标，宽度，高度
    [x, y, w, h] = area

    w = w * ratio
    h = h * ratio
    x1 = max(x - w / 2, 0)
    y1 = max(y - h / 2, 0)
    x2 = min(x1 + w, 1)
    y2 = min(y1 + h, 1)
    # print(f'INFO: the face width is {width}, face height is {height}')
    bbox = [x1 * width, y1 * height, x2 * width, y2 * height]

    return bbox  # 这里的bbox 还是浮点型，后续保存图片的时候同意转换
    # return np.array(bbox).astype(int)


def save_face_database(img, face, names,
                       bboxs):  # save face to database, this face is the result of insightface, not the obj

    # 1. 获取人脸名字
    if len(names) == 0:  # 通过LM方式未检测到人脸
        print(f'INFO: there is no LM_face_info detected ... ')
        print(f'INFO: estimated face name based on exist feats now  ... ')
        face_name, sim = get_face_name(face.normed_embedding)  # 通过跟人脸特征库的比较，推理出相关人脸名称

    else:  # 通过LM方式检测到了人脸
        ious = []
        for bbox in bboxs:
            iou = compute_IOU(bbox, face.bbox)  # 计算LM 人脸区域跟insight face 人脸区域的重合度
            ious = np.append(ious, iou)
        idx = ious.argmax()
        # print(f'INFO ious is {ious}')
        # print(f'INFO names is {names}')
        # print(f'INFO: the identified idx is {idx}')
        if ious[idx] > 0.3:  # 重合度超过30%
            face_name = names[idx]
            sim = 1
        else:
            face_name = 'unknown'
            sim = 0
        print(f"\033[1;32m INFO: estimated name is {face_name}, which is from LM \033[0m")

    # get the album info
    random_name = ''.join(random.sample(string.ascii_letters + string.digits, 5))
    if face_name == 'unknown':
        face_name = face_name + '_' + random_name

    face_info_name = 'face_info_' + random_name + '.npy'  # 人脸信息把名字去掉
    src_name = 'face_' + random_name + '.jpg'  # face name with random letters
    face_info = os.path.join('face_info', face_info_name)  # 不按人名进行分类
    face_src = os.path.join('face', src_name)
    # face_info = os.path.join('face_info', face_name, face_info_name)
    # face_src = os.path.join('face', face_name, src_name)

    # 2. 判断人脸相册是否存在该人，不存在则创建,
    album = update_album_database(face_name, face_info, face_src)

    # 3. 保存人脸信息到数据库
    fc = Face()
    fc.img_id = img.id
    fc.name = face_name
    fc.det_score = face.det_score
    fc.face_score = sim
    # if sim == 1:  # 已经确认是该人了, 更新人脸信息到本地
    if sim > 0.8:  # 概率大于0.8， 基本上可以确认是该人了
        print(f"\033[1;32m INFO: the face name is confirmed, which is {face_name} \033[0m")
        fc.is_confirmed = True
    fc.age = face.age
    fc.gender = face.gender
    fc.det_method = 1  # InsightFace 识别方式

    bbox = np.array(face.bbox).astype(int)
    fc.x = bbox[0]
    fc.y = bbox[1]
    fc.wid = bbox[2] - bbox[0]
    fc.height = bbox[3] - bbox[1]
    # if fc.wid < 100:  # 人脸照片太小，则直接返回，不进行保存
    #     return
    fc.face_info = face_info
    fc.src = face_src

    fc.face_album_id = album.id

    fc.save()

    # if not os.path.exists(os.path.dirname(fc.face_info.path)):
    #     os.makedirs(os.path.dirname(fc.face_info.path))
    # if not os.path.exists(os.path.dirname(fc.src.path)):
    #     os.makedirs(os.path.dirname(fc.src.path))

    return fc


def save_face_info(filepath, face, face_name='unknown'):  # media/face_info/name/file
    fc_info = FaceInfo()
    fc_info.normed_embedding = face.normed_embedding
    fc_info.bbox = face.bbox
    fc_info.kps = face.kps
    fc_info.landmark_2d_106 = face.landmark_2d_106
    fc_info.landmark_3d_68 = face.landmark_3d_68
    fc_info.pose = face.pose

    np.save(filepath, fc_info)  # 保存所有的人脸信息


# encoding: utf-8
def compute_IOU(rec1, rec2):  # 这里的矩形，包括左上角坐标和右下角坐标
    """
    计算两个矩形框的交并比。
    :param rec1: (x0,y0,x1,y1)      (x0,y0)代表矩形左上的顶点，（x1,y1）代表矩形右下的顶点。下同。
    :param rec2: (x0,y0,x1,y1)
    :return: 交并比IOU.
    """
    left_column_max = max(rec1[0], rec2[0])
    right_column_min = min(rec1[2], rec2[2])
    up_row_max = max(rec1[1], rec2[1])
    down_row_min = min(rec1[3], rec2[3])
    # 两矩形无相交区域的情况
    if left_column_max >= right_column_min or down_row_min <= up_row_max:
        return 0
    # 两矩形有相交区域的情况
    else:
        S1 = (rec1[2] - rec1[0]) * (rec1[3] - rec1[1])
        S2 = (rec2[2] - rec2[0]) * (rec2[3] - rec2[1])
        S_cross = (down_row_min - up_row_max) * (right_column_min - left_column_max)
        return S_cross / (S1 + S2 - S_cross)


def change_confirm_state(fc, serializer):  # fc 更新前的实例对象，serializer： 更新后并经过校验的序列化器
    data = serializer.validated_data
    # print(f'INFO serializer.validated_data{data}')
    old_confirm = fc.is_confirmed
    new_confirm = data['is_confirmed']
    if old_confirm != new_confirm:
        # 3. 人脸相册数据库更新
        album = update_album_database(fc.name)

        # 4. 保存相关人脸信息到数据库
        fc_obj = serializer.save()  # 执行 is_confirmed = True 到数据库

        # 5. 更新并保存该人脸所有特征和中心特征到文件系统，并返回结果
        fts, cft = save_people_feats(fc.name)

        # 6. 更新并保存所有人脸姓名和中心特征到文件系统，并返回结果
        names, all_fts = save_all_feats()

        # 7. 根据计算好的中心向量，更新该人脸所有的相似度
        update_face_sim(fc.name, cft)

        return True
    return False


def update_face_path(query, old_name, new_name):
    new_src = ''
    new_face_info = ''
    if query.src.name:
        new_src = query.src.name.replace(old_name, new_name)  # 更新数据库内容
    if query.face_info.name:
        new_face_info = query.face_info.name.replace(old_name, new_name)
    return new_src, new_face_info


def move_face_file(old_path, old_name, new_name):
    # 移动文件存储位置
    if not os.path.exists(old_path):  # 源路径不存在
        return

    new_img_path = old_path.replace(old_name, new_name)

    if not os.path.exists(os.path.dirname(new_img_path)):
        os.makedirs(os.path.dirname(new_img_path), exist_ok=True)
    move(old_path, new_img_path)

    print(f'移动文件并重命名，原文件 {old_path},目标目录{new_img_path}')


def update_album_database(face_name, face_info='', face_src=''):
    """
    输入：
        更新后的名字
    输出：
        album: 更新后的相册对象
    """

    # face_feat = os.path.join('face_info', new_name, 'center_feats.txt')  #
    album = FaceAlbum.objects.filter(name=face_name)
    # TODO 对老相册如何处理？中心特征向量依然存在的
    if album.exists():
        album = album.first()  # 不加get-->AttributeError: 'TreeQuerySet' object has no attribute 'id'
        album.name = face_name
        # album.face_feat = face_info
        # album.avatar = face_src
        # album.is_has_feat = True
        album.save()
        print(f"INFO the face album already exist, name is  {album.name}")
    else:
        # album = FaceAlbum.objects.create(name=face_name)
        print(f'#######face_info: {face_info}, face_src: {face_src}')
        album = FaceAlbum.objects.create(name=face_name, face_feat=face_info, avatar=face_src, is_has_feat=True)
        print(f"INFO the face album not exist, creating now, the new album id is {album.id}")

    return album


def save_people_feats(name):  # 保存所有人脸的中心特征

    fts_pth = os.path.join(FACE_INFO_ROOT, name, 'all_feats.txt')
    cft_pth = os.path.join(FACE_INFO_ROOT, name, 'center_feat.txt')

    fts, cft = get_people_fts(name)

    np.savetxt(fts_pth, fts, delimiter=',', fmt='%.4f')  # 保存所有人脸特征
    np.savetxt(cft_pth, cft, delimiter=',', fmt='%s')  # 保存所有人对应人名

    return fts, cft


def get_people_fts(name):
    """
    输入：
        name:一个人人脸的姓名
    输出：
        fts: 所有人脸特征
        cft: 该人的人脸特征中心
    """
    # print(f'INFO start getting {name} feats...')
    faces = Face.objects.filter(det_method=True, is_confirmed=True, name=name)
    # print(faces)
    fts = np.array([])
    cft = np.array([])
    for i in range(len(faces)):
        fc_info = np.load(faces[i].face_info.path, allow_pickle=True)
        ft = fc_info.item().normed_embedding.reshape(1, -1)
        # print(ft.shape)
        fts = ft if i == 0 else np.concatenate((fts, ft), axis=0)

    if fts.ndim == 2:  # fts 有数据，ndim是2
        cft = fts.mean(axis=0).reshape(1, -1)  # 将数组a转化为行向量
    return fts, cft
    # else:  # fts 无数据，ndim是1
    #     return None, None


def save_all_feats():  # 保存所有人脸的中心特征

    combined_fts_pth = os.path.join(FACE_INFO_ROOT, 'combined_feats.txt')
    names_pth = os.path.join(FACE_INFO_ROOT, 'names.txt')

    names, all_fts = get_all_fts()

    np.savetxt(combined_fts_pth, all_fts, delimiter=',', fmt='%.4f')  # 保存所有人脸特征
    np.savetxt(names_pth, names, delimiter=',', fmt='%s')  # 保存所有人对应人名

    return names, all_fts


def get_all_fts():  # 获取所有人脸的中心特征
    """
    输入：
        None
    输出：
        names: 所有已识别的人脸名字
        all_fts: 所有人脸特征中心的集合
    """
    names = []  # 保存所有人脸名字
    all_fts = np.array([])

    albums = FaceAlbum.objects.filter(is_has_feat=True)

    for album in albums:  # 直接从人脸相册中获取
        names = np.append(names, album.name)
        if not os.path.exists(album.face_feat.path):  # if the path is not exist due some issues, then, just skip
            continue

        # print('++++++++++++++:', album.face_feat.path)
        fc_info = np.load(album.face_feat.path, allow_pickle=True)
        ft = fc_info.item().normed_embedding.reshape(1, -1)
        # print(ft)
        # all_fts = np.concatenate(all_fts, ft)
        all_fts = ft if all_fts.ndim == 1 else np.concatenate((all_fts, ft), axis=0)  # all_fts != 2 表示all_fts还没有数据

    # for i in range(len(albums)):  # 重新计算不同人脸的中心向量
    #     # names.append(album.name)
    #
    #     fts, cft = get_people_fts(albums[i].name)
    #     if fts.ndim == 2:  # fts 有数据，ndim是2:
    #         # print(f'INFO face_{i}:fts shape is {fts.shape}, cft shape is {cft.shape}')
    #         # print(f'INFO face_{i}:fts ndim is {fts.ndim}, cft ndim is {cft.ndim}')
    #         # print(f'INFO face_{i}:all_fts ndim is {all_fts.ndim}')
    #         names = np.append(names, albums[i].name)
    #         # all_fts = cft if i == 0 else np.concatenate((all_fts, cft), axis=0)
    #         all_fts = cft if all_fts.ndim == 1 else np.concatenate((all_fts, cft), axis=0)  # all_fts != 2 表示all_fts还没有数据
    return names, all_fts


def update_face_sim(name, cft):
    """
    输入：
        该人脸的中心特征
    输出：
        album: 更新后的相册对象
    """

    faces = Face.objects.filter(det_method=True, is_confirmed=True, name=name)
    # print(f'INFO: total found  {len(faces)} faces instance, based on the name of {name}')

    for i in range(len(faces)):
        fc_info = np.load(faces[i].face_info.path, allow_pickle=True)
        ft = fc_info.item().normed_embedding.reshape(1, -1)
        faces[i].face_score = np.matmul(ft, cft.T)
        # print(f'INFO faces[i].face_score {faces[i].face_score}')
    Face.objects.bulk_update(faces, ['face_score'])  # 这里的更新，不经过Face 视图级中的perform update
    # return fts, cft


def get_face_name(ft, based='database'):
    """
    输入：
        None
    输出：
        name: 估算出来的人脸姓名
        sim: 是该人的相似度
    """
    names = []
    all_fts = []
    if based == 'os':
        combined_fts_pth = os.path.join(FACE_INFO_ROOT, 'combined_feats.txt')
        names_pth = os.path.join(FACE_INFO_ROOT, 'names.txt')
        if os.path.exists(combined_fts_pth):
            all_fts = np.loadtxt(combined_fts_pth, delimiter=',', dtype=float, skiprows=0, comments='#')  # 加载现有的所有人脸特征
            if all_fts.ndim == 1:  # 如果是一维数据，则转换成行向量
                all_fts = all_fts.reshape(1, -1)
        if os.path.exists(names_pth):
            names = np.loadtxt(names_pth, delimiter=',', dtype=str, skiprows=0, comments='#')  # 加载现有的所有人名

    if based == 'database':
        names, all_fts = get_all_fts()  # 得到所有的人名和中心向量

    # print(f'INFO names is {names}')
    # if len(names) == 0:  # there is no info in the database
    if len(names) == 0:  # there is no info in the database
        print('there is no info in the database')
        return 'unknown', 0

    # print(f'INFO all_fts.shape is {all_fts.shape}')

    sims = np.matmul(all_fts, ft.T)
    # print(f'INFO sims is {sims}')
    idx = sims.argmax()
    # print(f'INFO idx is {idx}')
    name = names[idx]
    sim = sims[idx]

    if sim > 0.3:  # 相似度比较高
        print('--------------------------------------------------------------------')
        print(f'\033[1;32m INFO: estimated name is {name}, p is {sim} \033[0m')  # \033[0m 是系统默认颜色
        print('--------------------------------------------------------------------')
    else:
        print(f'could not found the similar face from the database')
        name = 'unknown'
    return name, sim


# @app.task
@shared_task
def set_face_mcs(fc_obj):  # img = self.get_object()  # 获取详情的实例对象
    if not hasattr(fc_obj, 'mcs'):  # 判断是否又对应的mcs存储

        data = upload_file_pay(wallet_info, fc_obj.src.path)

        if data["status"] != 'success':
            return

        # 调用序列化器进行反序列化验证和转换
        data.update(id=fc_obj.id)
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
        msg = 'there is already have mac info related to this img: file id is %d' % fc_obj.mcs.file_upload_id

    print(msg)


# @app.task
@shared_task
# 通过InsightFace 人脸识别的方式，保存相关人脸信息
def save_insight_faces(img):
    print(f'INFO: insight face detecting the face now ... ')
    app = FaceAnalysis(providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
    app.prepare(ctx_id=0, det_size=(640, 640))
    image_path = img.src.path

    req_img = cv.imread(image_path)  # 自己用openCV进行读取
    faces = app.get(req_img)  # 使用insight face 获取人脸信息

    names, bboxs = get_LM_face_info(img)  # 从lightroom 中获取人脸信息
    print(f'INFO LM names is {names}')
    for face in faces:
        if face.det_score < 0.3:  # 是人脸的可能性 < 0.4
            continue
        fc_obj = save_face_database(img, face, names, bboxs)  # 保存相关信息到数据库
        save_face_info(fc_obj.face_info.path, face, fc_obj.name)  # 保存人脸信息到磁盘
        save_src(fc_obj.src.path, image_path, face.bbox)  # 保存人脸图片到磁盘
        # upload_face_to_mcs(fc_obj)  # update the face to mcs

        # if fc_obj.is_confirmed == 1:  # 如果人脸通过LM识别进行了确认，也就是IOU大于一定的程度
        #     # 5. 更新并保存该人脸所有特征和中心特征到文件系统，并返回结果
        #     fts, cft = save_people_feats(fc_obj.name)
        #
        #     # 6. 更新并保存所有人脸姓名和中心特征到文件系统，并返回结果
        #     all_names, all_fts = save_all_feats()
        #
        #     # 7. 根据计算好的中心向量，更新该人脸所有的相似度
        #     update_face_sim(fc_obj.name, cft)


@shared_task
def change_album_name(album, serializer):  # serializer
    data = serializer.validated_data

    old_name = album.name
    new_name = data['name']
    if old_name != new_name:
        print(f'人脸相册名字更新：新的名字是 {old_name} --> {new_name}')

        # 相册中是否存在这个人
        obj = FaceAlbum.objects.filter(name=new_name)
        if obj.exists():
            print("there is another same existed")
            # 2. 更新人脸数据库中的名字
            querys = Face.objects.filter(name=old_name)  # 获取并更新人脸照片中的名字
            for query in querys:
                query.name = new_name
                query.face_album = obj.first()
                # query.src, query.face_info = update_face_path(query, old_name, new_name)
            # # Face.objects.bulk_update(querys, ['name', 'src', 'face_info'])  # 这里的更新，不经过Face 视图级中的perform update
            Face.objects.bulk_update(querys, ['name', 'face_album'])  # 这里的更新，不经过Face 视图级中的perform update
            album.delete()  # delete the obj, since there is another album already existed
        else:
            # 1. 更新相册中的人脸及中心特征
            # new_face_feat = album.face_feat.name.replace(old_name, new_name)
            serializer.save(name=new_name)  # 更新相册中的名字

            # 2. 更新人脸数据库中的名字，信息路径
            querys = Face.objects.filter(face_album=album)  # 获取并更新人脸照片中的名字
            for query in querys:
                query.name = new_name
                # query.src, query.face_info = update_face_path(query, old_name, new_name)
            # # Face.objects.bulk_update(querys, ['name', 'src', 'face_info'])  # 这里的更新，不经过Face 视图级中的perform update
            Face.objects.bulk_update(querys, ['name'])  # 这里的更新，不经过Face 视图级中的perform update

            # # 3. 更改文件系统中文件夹名称: 重命名人脸目录，b. 重命名人脸信息目录
            # fc_fold = os.path.join(FACE_ROOT, old_name)
            # fc_info_fold = os.path.join(FACE_INFO_ROOT, old_name)
            # new_fc_fold = os.path.join(FACE_ROOT, new_name)
            # new_fc_info_fold = os.path.join(FACE_INFO_ROOT, new_name)
            # if not os.path.exists(new_fc_fold):  # 如果文件夹不存在
            #     os.rename(fc_fold, new_fc_fold)
            # else:  # 如果文件夹已存在
            #     pass  # 移动所有文件到已存在的目录
            # if not os.path.exists(new_fc_info_fold):  # 如果文件夹不存在
            #     os.rename(fc_info_fold, new_fc_info_fold)
            # else:  # 如果文件夹已存在
            #     pass  # 移动所有文件到已存在的目录, 合并人脸特征。
            #
            # # 4. 更新并保存该人脸所有特征和中心特征到文件系统，并返回结果
            # fts, cft = save_people_feats(new_name)
            #
            # # 5. 更新并保存所有人脸姓名和中心特征到文件系统，并返回结果
            # names, all_fts = save_all_feats()

        return old_name, new_name


@shared_task
def change_face_name(fc, serializer):  # fc 更新前的实例对象，serializer： 更新后并经过校验的序列化器
    # data = self.request.data.copy()
    data = serializer.validated_data
    # print(f'INFO serializer.validated_data{data}')
    old_name = fc.name
    new_name = data['name']
    print(f'人脸更新：新的人脸是 {old_name} --> {new_name}')
    if old_name != new_name:
        # 3. 人脸相册数据库更新
        album = update_album_database(new_name, fc.face_info, fc.src)
        # 4. 保存相关人脸信息到数据库
        face = serializer.save(face_album_id=album.id, is_confirmed=True)  # 序列化器貌似无法直接更新外键

        # check whether there are still some faces in the album after changed, if no faces left, then, delete this album
        queryset = FaceAlbum.objects.annotate(item_cnt=Count('faces')).filter(item_cnt=0).delete()

        #
        # # 1. 更新数据库路径信息
        # new_img_path, new_info_path = update_face_path(fc, old_name, new_name)
        #
        # # 2. 移动相关文件, TODO 特性向量还是没有移动，后续需要优化：移出去，移回来后，就多了一个特征向量
        # move_face_file(fc.src.path, old_name, new_name)  # 移动文件
        # move_face_file(fc.face_info.path, old_name, new_name)
        # # print(f'INFO new_img_path = {new_img_path}，new_info_path = {new_info_path}')
        #
        # # 3. 人脸相册数据库更新
        # album = update_album_database(new_name, fc.face_info, fc.src)
        #
        # # 4. 保存相关人脸信息到数据库
        # face = serializer.save(src=new_img_path, face_info=new_info_path,
        #                        face_album_id=album.id, is_confirmed=True)  # 序列化器貌似无法直接更新外键
        #
        # # 5. 更新并保存该人脸所有特征和中心特征到文件系统，并返回结果
        # fts, cft = save_people_feats(new_name)
        #
        # # 6. 更新并保存所有人脸姓名和中心特征到文件系统，并返回结果
        # names, all_fts = save_all_feats()
        #
        # # 7. 根据计算好的中心向量，更新所有人脸的相似度
        # update_face_sim(new_name, cft)
        return True

    return False
