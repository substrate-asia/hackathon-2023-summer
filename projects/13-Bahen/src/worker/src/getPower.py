# power.py
import GPUtil

flops_dict = {
    'Tesla T4': 65e12,  # 125 TFLOPS for Tensor Cores
    'Tesla V100': 125e12,  # 125 TFLOPS for Tensor Cores
    'Tesla A100': 312e12,  # 312 TFLOPS for Tensor Cores
    'RTX 2080': 42.4e12,  # 285.6 TFLOPS for Tensor Cores
    'RTX 3070': 40.6e12,  # 285.6 TFLOPS for Tensor Cores
    'RTX 3080': 59.5e12,  # 285.6 TFLOPS for Tensor Cores
    'RTX 3090': 71e12,  # 285.6 TFLOPS for Tensor Cores
    'RTX A6000': 154.8e12,  # 112 TFLOPS for Tensor Cores
    'A40': 149.7e12,  # 112 TFLOPS for Tensor Cores
}

RTX3090_FLOPs = 71e12

def get_gpu_power():
    total_gpu_flops = 0
    gpus = GPUtil.getGPUs()
    for gpu in gpus:
        gpu_name = gpu.name
        for k in flops_dict.keys():
            if k in gpu_name:
                total_gpu_flops += flops_dict[k]
                break
    return total_gpu_flops

def get_power():
    return round(get_gpu_power() / RTX3090_FLOPs)

