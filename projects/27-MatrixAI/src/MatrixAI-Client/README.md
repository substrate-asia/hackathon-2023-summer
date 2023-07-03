# MatrixAI-Client

Share your unused computing capacity to provide support for more AI creators in need and earn profits at the same time.

## Disclaimer

This program is still in the development stage and includes testing and uncertainties. Please do not run it in a production environment.

## System requirements

- Operating System: Windows 10 and above
- GPU：Intel
- Go: 1.20.4 and above
- Python: 3.10
- pip: 20.2.2 and above

## View Go version
```
   go version
```

## View Python version
```
   python --version
```

## View pip version
```
   python -m pip --version
```

## Confirm that Python and pip are 64-bit.

Confirm that Python and pip are 64-bit, and the processor architecture is x86_64 (also known as x64, Intel 64, AMD64). The first line of output should be "64bit", and the second line should be "x86_64", "x64", or "AMD64".
```
   python -c "import platform;print(platform.architecture()[0]);print(platform.machine())"
```

## Install the protobuf and gRPC Python libraries (grpcio and grpcio-tools).
```
   python -m pip install protobuf==3.20.0
   python -m pip install grpcio==1.54.2
   python -m pip install grpcio-tools==1.37.1
```

## Install paddlepaddle CPU version.
```
   python -m pip install paddlepaddle==2.4.2 -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## Check if the versions are consistent.
```
   pip list
```

## Verify the installation.

After the installation is complete, you can use `python` to enter the Python interpreter, enter `import paddle`, and then enter `paddle.utils.run_check()`.

If `PaddlePaddle is installed successfully!` appears, it means you have successfully installed it.

## Prepare the dataset.

Provide dataset template.

Download link: https://d.cess.cloud/913117683.zip

## Instructions for use.

Start the client program: execute the following command in the command line, replacing `your_mnemonic_phrase` with the actual mnemonic phrase:
```
   go_build_MatrixAI_Client.exe client execute -m "your_mnemonic_phrase"
```

Stop the client program: execute the following command in the command line, replacing `your_mnemonic_phrase` with the actual mnemonic phrase:
```
   go_build_MatrixAI_Client.exe client stop -m "your_mnemonic_phrase"
```