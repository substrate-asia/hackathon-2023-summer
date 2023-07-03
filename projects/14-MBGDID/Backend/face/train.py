import os
import django
import numpy as np
import torch
from torch import nn
from torch import optim
from torch.nn import functional as F
os.environ.setdefault('DJANGO_SETTING_MODULE', 'deep-diary.settings')
django.setup()
import utils.disp as disp
from face.views import get_people_fts


class Net(nn.Module):

    def __init__(self, class_num = 9):
        super(Net, self).__init__()

        self.fc1 = nn.Linear(512, class_num)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        return x


def train_face(fts):
    nums = len(fts)
    print(f'the feat number is {nums}')
    face_net = Net(1)

    optimizer = optim.SGD(face_net.parameters(), lr=0.01, momentum=0.9)
    train_loss = []
    out_y = torch.tensor([0])
    out_y = disp.one_hot(out_y, depth=1)  # 可以很好的用于分类任务
    for i in range(100):
        out = face_net(torch.tensor(fts))
        loss = F.mse_loss(out, out_y)
        optimizer.zero_grad()
        loss.backward()
        # w' = w - lr*grad
        optimizer.step()
        train_loss.append(loss.item())
        print(f'epoch {i} is finished, loss is {loss}')

    disp.plot_curve(train_loss)
    # torch.save(face_net, './face_md.pt')
    print(f'face mode have been safed, {face_net}')
    print(f'sims out is {out}')
    return out, face_net


fts, cft = get_people_fts('allison')
sims = np.matmul(fts, cft.T)
print(f'INFO sims is {sims}')
sims2, face_net = train_face(fts)
center_ft = face_net(torch.tensor(cft))
print(f'INFO the diff between norm and model is {center_ft}')

fts, cft = get_people_fts('blue')

sims3 = face_net(torch.tensor(fts))