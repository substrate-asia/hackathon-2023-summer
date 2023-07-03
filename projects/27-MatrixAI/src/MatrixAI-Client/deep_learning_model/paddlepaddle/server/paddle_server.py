from concurrent import futures

import grpc

import paddle_pb2
import paddle_pb2_grpc

import paddle
from paddle.vision.transforms import Normalize


class PaddleService(paddle_pb2_grpc.TrainServiceServicer):

    def TrainAndPredict(self, request, context):
        # 把之前的训练代码块放到这里

        print("Paddle gRPC Server received image data")

        transform = Normalize(mean=[127.5], std=[127.5], data_format='CHW')

        # 下载数据集并初始化 DataSet
        train_dataset = paddle.vision.datasets.MNIST(mode='train', transform=transform)
        test_dataset = paddle.vision.datasets.MNIST(mode='test', transform=transform)

        # 模型组网并初始化网络
        lenet = paddle.vision.models.LeNet(num_classes=10)

        model = paddle.Model(lenet)

        # 模型训练的配置准备，准备损失函数，优化器和评价指标
        model.prepare(paddle.optimizer.Adam(parameters=model.parameters()),
                      paddle.nn.CrossEntropyLoss(),
                      paddle.metric.Accuracy())

        # 模型训练
        model.fit(train_dataset, epochs=5, batch_size=64, verbose=1)
        # 模型评估
        eval_result = model.evaluate(test_dataset, batch_size=64, verbose=1)
        print(eval_result)

        # 保存模型
        model.save('./output/model/mnist')

        return paddle_pb2.TrainResult(message=eval_result,
                                      true_label=int(1),
                                      predicted_label=int(2),
                                      image_data=bytes("img_byte_data", encoding='utf-8'))


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    paddle_pb2_grpc.add_TrainServiceServicer_to_server(PaddleService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    print("Paddle gRPC Server started")

    server.wait_for_termination()


if __name__ == '__main__':
    serve()
