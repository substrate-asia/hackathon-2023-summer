# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver

# os.environ.setdefault('DJANGO_SETTING_MODULE', 'deep-diary.settings')
# django.setup()
from face.task import save_insight_faces
from library.models import Img


## graph


# 信号接收函数，每当新建 Image 实例时自动调用
@receiver(post_save, sender=Img)
def create_face_info(sender, instance, created, **kwargs):
    if created:  # 仅创建的时候执行
        print(f'INFO: **************img instance have been created, saving face info now...')
        # save_LM_faces(instance)  # 保存lightroom 结果
        # config = Config()
        # # 关系图中包括(include)哪些函数名。
        # # 如果是某一类的函数，例如类gobang，则可以直接写'gobang.*'，表示以gobang.开头的所有函数。（利用正则表达式）。
        # # config.trace_filter = GlobbingFilter(include=[
        # #     'draw_chessboard',
        # #     'draw_chessman',
        # # ])
        # # 该段作用是关系图中不包括(exclude)哪些函数。(正则表达式规则)
        # # config.trace_filter = GlobbingFilter(exclude=[
        # #     'pycallgraph.*',
        # # ])
        # graphviz = GraphvizOutput()
        # graphviz.output_file = 'graph.png'
        # with PyCallGraph(output=graphviz, config=config):
        save_insight_faces.delay(instance)  # 保存insightface识别结果
        # save_insight_faces(instance)  # 保存insightface识别结果
    pass


# 信号接收函数，每当更新 Img 实例时自动调用
@receiver(post_save, sender=Img)
def update_img_info(sender, instance, **kwargs):
    # print(f'INFO: img instance have been updated')
    # print(f'INFO: instance is {instance}')
    # print(f'INFO: sender is {sender}')
    pass

# def face_save_oss(pil_read, face):
#     #  如果无名字，这里会报错，需要更改
#     width, height = pil_read.size
#     box = face_zoom(face.x, face.y, face.wid, face.height, 1.2, width, height)  # 前两个坐标点是左上角坐标, 后两个坐标点是右下角坐标
#     region = pil_read.crop(box)
#     temp_face = './temp_face.jpg' # 本地临时路径
#     region.save(temp_face)  # 将人脸临时保存到本地，再上传到阿里云oss服务器，此文件反复覆盖
#
#     filename = face.name + '_' + ''.join(
#         (random.sample(string.ascii_letters + string.digits, 5))) + '.jpg'  # face name with random letters
#     face_path = os.path.join('face', face.name, filename).replace('\\', '/')  # 阿里云路径必须事’/‘ 才可以新建路径
#     face.src = face_path  # 数据库保存路径
#     face_oss_path = os.path.join('media', face_path).replace('\\', '/')  # oss 保存路径
#
#     # print(f'relative face_path is {face_path}, fold_path path is {fold_path}')
#
#     auth = oss2.Auth(OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET)  # 填入阿里云账号的 <AccessKey ID> 和 <AccessKey Secret>
#     bucket = oss2.Bucket(auth, OSS_ENDPOINT, OSS_BUCKET_NAME)  # 填入 OSS 的 <域名> 和 <Bucket名>
#     result = bucket.put_object_from_file(face_oss_path, temp_face)
#
#     return face
