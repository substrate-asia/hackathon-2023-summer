import  torch
from    matplotlib import pyplot as plt
import cv2 as cv
import os


def plot_curve(data):
    fig = plt.figure()
    plt.plot(range(len(data)), data, color='blue')
    plt.legend(['value'], loc='upper right')
    plt.xlabel('step')
    plt.ylabel('value')
    plt.show()



def plot_image(img, label, name):

    fig = plt.figure()
    for i in range(6):
        plt.subplot(2, 3, i + 1)
        plt.tight_layout()
        plt.imshow(img[i][0]*0.3081+0.1307, cmap='gray', interpolation='none')
        plt.title("{}: {}".format(name, label[i].item()))
        plt.xticks([])
        plt.yticks([])
    plt.show()


def one_hot(label, depth=9):
    out = torch.zeros(label.size(0), depth)
    idx = label.view(-1, 1).long()
    out.scatter_(dim=1, index=idx, value=1)
    return out


def plot_best_worst_faces(paths, sims):

    row = 2
    col = int(len(paths)/2)
    total = int(row * col)
    fig = plt.figure()
    for i in range(total):  # best, worst, best, worst...
        plt.subplot(row, col, i+1)
        plt.tight_layout()
        img = cv.imread(paths[i])
        img = img[:, :, ::-1]
        plt.imshow(img, interpolation='none')
        plt.title("{}: {:.2f}".format(os.path.basename(paths[i]), sims[i]))
        plt.xticks([])
        plt.yticks([])
    plt.show()