# import os
# import random
# import string
#
# import cv2 as cv
# import django
# import numpy as np
# from insightface.app import FaceAnalysis
# os.environ.setdefault('DJANGO_SETTING_MODULE', 'deep-diary.settings')
# django.setup()
# from face.signals import save_src, get_LM_face_info
# from deep_diary.settings import FACE_ROOT, FACE_INFO_ROOT
# from face.models import Face
#
#
# class FaceInfo:
#     def __init__(self):
#         self.det_score = 0.0
#         self.age = 0
#         self.gender = 0
#         # ndarrary
#         self.normed_embedding = 0
#         self.bbox = 0
#         self.kps = 0
#         self.landmark_2d_106 = 0
#         self.landmark_3d_68 = 0
#         self.pose = 0
#
#
# def save_faces(img_id, image_path, faces):  # media/face_info/name/file
#     face_name = 'unknown'
#     for i in range(len(faces)):
#         fc_obj = save_face_database(img_id, faces[i], face_name='unknown')
#         save_face_info(fc_obj.face_info.path, faces[i], face_name)
#         save_src(fc_obj.src.path, image_path, faces[i].bbox)
#
#
# def save_face_database(img_id, face, face_name='unknown'):  # save face to database
#     fc = Face()
#     fc.img_id = img_id
#     fc.name = face_name
#     fc.det_score = face.det_score
#     fc.age = face.age
#     fc.gender = face.gender
#     bbox = np.array(face.bbox).astype(int)
#     fc.x = bbox[0]
#     fc.y = bbox[1]
#     fc.wid = bbox[2] - bbox[0]
#     fc.height = bbox[3] - bbox[1]
#
#     random_name = ''.join(random.sample(string.ascii_letters + string.digits, 5))
#     face_info_name = face_name + '_' + 'face_info_' + random_name + '.npy'
#     src_name = face_name + '_' + 'face_' + random_name + '.jpg'  # face name with random letters
#
#     fc.face_info = os.path.join('face_info', face_name, face_info_name)
#     fc.src = os.path.join('face', face_name, src_name)
#     fc.save()
#
#     if not os.path.exists(os.path.dirname(fc.face_info.path)):
#         os.makedirs(os.path.dirname(fc.face_info.path))
#     if not os.path.exists(os.path.dirname(fc.src.path)):
#         os.makedirs(os.path.dirname(fc.src.path))
#
#     return fc
#
#
# def save_face_info(filepath, face, face_name='unknown'):  # media/face_info/name/file
#     fc_info = FaceInfo()
#     fc_info.normed_embedding = face.normed_embedding
#     fc_info.bbox = face.bbox
#     fc_info.kps = face.kps
#     fc_info.landmark_2d_106 = face.landmark_2d_106
#     fc_info.landmark_3d_68 = face.landmark_3d_68
#     fc_info.pose = face.pose
#     # 处理相关路径
#     # filename = ''.join(random.sample(string.ascii_letters + string.digits, 5))
#     # fold_path = os.path.join(FACE_INFO_ROOT, face_name)  # face flod
#     # if not os.path.exists(fold_path):
#     #     os.makedirs(fold_path)
#     # face_info_path = os.path.join(fold_path, filename)  # face path name
#
#     np.save(filepath, fc_info)
#
#
# def load_face_info(filepath):  # media/face_info/name/file
#
#     face_info = FaceInfo()
#     fc_info = np.load(filepath, allow_pickle=True)
#     face_info = fc_info.item()
#     return face_info
#
#
# # name='allison'
# # face = Face.objects.filter(det_method=True, name=name).last()
# # img_obj=face.img
# # image_path = img_obj.image.path
# # image_path = 'c:\\Users\\Blue\\Desktop\\friend.png'
# #
# #
# # app = FaceAnalysis(providers=['CUDAExecutionProvider', 'CPUExecutionProvider'])
# # app.prepare(ctx_id=0, det_size=(640, 640))
# # # img = ins_get_image('t1',to_rgb=True)   # 官方提供的路径
# #
# # img = cv.imread(image_path)  # 自己用openCV进行读取
# # faces = app.get(img)
# # rimg = app.draw_on(img, faces)
# # cv.imwrite("./demo1_out.jpg", rimg)
# #
# # names, bboxs = get_LM_face_info(img_obj)  # 从lightroom 中获取人脸信息
# # bboxs = np.array(bboxs).astype(int)
# # for box in bboxs:
# #     cv.rectangle(rimg, (box[0], box[1]), (box[2], box[3]), (0, 255, 0), 2)
# #
# # cv.imwrite("./demo1_out_combine.jpg", rimg)
# #
# # # with open("a.txt", 'wb') as f:  # 打开文件
# # #     f.write(pickle.dumps(faces))
# # #     # pickle.dump(faces, f)  # 用 dump 函数将 Python 对象转成二进制对象文件
# # #
# # # with open("a.txt", 'rb') as f:  # 打开文件
# # #     faces_read = pickle.load(f)  # 将二进制文件对象转换成 Python 对象
# # #     print(faces_read)
# # save_faces(64, img, faces)
#
# # faces = Face.objects.filter(name = 'allison')
# # face_info = load_face_info(faces[0].face_info.path)
# # print(face_info.bbox)
