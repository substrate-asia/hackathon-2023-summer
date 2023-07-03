from concurrent import futures
import json

import grpc
import numpy as np

import paddle_pb2
import paddle_pb2_grpc

import paddle
from paddle.vision.transforms import Normalize

from custom_dataset import MyDataset


class PaddleService(paddle_pb2_grpc.TrainServiceServicer):

    def TrainAndPredict(self, request, context):

        print("Paddle gRPC Server received image data")

        transform = Normalize(mean=[127.5], std=[127.5], data_format='CHW')

        # train_dataset = paddle.vision.datasets.MNIST(mode='train', transform=transform)
        # test_dataset = paddle.vision.datasets.MNIST(mode='test', transform=transform)

        train_dataset = MyDataset('server/datasets/train', 'server/datasets/train/label.txt', transform)
        test_dataset = MyDataset('server/datasets/val', 'server/datasets/val/label.txt', transform)

        lenet = paddle.vision.models.LeNet(num_classes=10)

        model = paddle.Model(lenet)

        model.prepare(paddle.optimizer.Adam(parameters=model.parameters()),
                      paddle.nn.CrossEntropyLoss(),
                      paddle.metric.Accuracy())

        model.fit(train_dataset, epochs=5, batch_size=64, verbose=1)

        eval_result = model.evaluate(test_dataset, batch_size=64, verbose=1)
        print(eval_result)

        processed_eval_result = self.numpy_float_to_python_float(eval_result)
        bytes_data = json.dumps(processed_eval_result).encode()

        # bytes_data = json.dumps(eval_result).encode()

        model.save('./output/model/matrix')

        return paddle_pb2.TrainResult(message=bytes_data,
                                      true_label=int(1),
                                      predicted_label=int(2),
                                      image_data=bytes("img_byte_data", encoding='utf-8'))

    def numpy_float_to_python_float(self, data):
        if isinstance(data, dict):
            return {k: self.numpy_float_to_python_float(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self.numpy_float_to_python_float(element) for element in data]
        elif isinstance(data, np.float32):
            return float(data)
        else:
            return data


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    paddle_pb2_grpc.add_TrainServiceServicer_to_server(PaddleService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Paddle gRPC Server started")

    server.wait_for_termination()


if __name__ == '__main__':
    serve()
