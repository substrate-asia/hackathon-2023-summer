FROM baiduxlab/sgx-rust

# install sgx_ssl for encryption/decryption inside sgx
ADD get_sgx_ssl.sh /root 
ENV SGX_SDK=/opt/sgxsdk/
RUN bash /root/get_sgx_ssl.sh 

# install rust_sgx_sdk
ADD get_sgx_rust.sh /root
RUN bash /root/get_sgx_rust.sh

ENV SGX_SDK_RUST=/root/incubator-teaclave-sgx-sdk
ENV SGX_MODE=SW
ENV SGXSSL_CRYPTO=/opt/intel/sgxssl/

ADD get_ks_sgx.sh /root

ENV KS_SGX_SRC=/root/keysafe-sgx/

WORKDIR /root 
