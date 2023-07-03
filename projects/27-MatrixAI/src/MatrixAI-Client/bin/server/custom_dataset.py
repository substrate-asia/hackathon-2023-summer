import os
import cv2
import numpy as np
from paddle.io import Dataset

from paddle.vision.transforms import Normalize

class MyDataset(Dataset):
    def __init__(self, data_dir, label_path, transform=None):
        super(MyDataset, self).__init__()
        self.data_list = []
        with open(label_path,encoding='utf-8') as f:
            for line in f.readlines():
                image_path, label = line.strip().split('\t')
                image_path = os.path.join(data_dir, image_path)
                self.data_list.append([image_path, label])
        self.transform = transform

    def __getitem__(self, index):
        image_path, label = self.data_list[index]
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        image = image.astype('float32')
        if self.transform is not None:
            image = self.transform(image)
        label = int(label)
        return image, label

    def __len__(self):
        return len(self.data_list)