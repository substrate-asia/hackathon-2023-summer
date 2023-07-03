import os
import shutil
from PIL import Image


def resizeImg(imgPath, to_scale):
    """
    输入：
        imgPath: 原始图像路径
        to_scale: 缩放比例
    描述：
        函数的运行结果，会在原始图像路径下面，生成一个'scaled'的文件夹，保存压缩后的照片
    """
    processIndex = 0
    resized_fold = os.path.join(imgPath, 'scaled')
    if not os.path.exists(resized_fold):
        os.makedirs(resized_fold)
    fileList = []
    files = os.listdir(imgPath)
    for f in files:
        filePath = os.path.join(imgPath, f)
        if os.path.isfile(filePath):
            fileList.append(f)
        elif os.path.isdir(filePath):
            # resizeImg(imgPath, to_scale)
            pass
    for fileName in fileList:
        processIndex += 1
        fileFullName = os.path.join(imgPath, fileName)

        resized_path = os.path.join(resized_fold, fileName)
        suffix = fileName[fileName.rfind('.'):]
        if suffix == '.png' or suffix == '.jpg':
            print('processing the ' + str(processIndex) + 'th file:' + fileFullName)
            img = Image.open(fileFullName)
            w, h = img.size
            tw = int(w * to_scale)
            th = int(h * to_scale)
            reImg = img.resize((tw, th), Image.ANTIALIAS)
            reImg.save(resized_path)
            del reImg


if __name__ == '__main__':
    to_scale = 0.5
    imgPath = r"D:\BlueDoc\deep_diary\mmdetection\demo\img"
    resizeImg(imgPath, to_scale)
