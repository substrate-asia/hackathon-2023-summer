#!/bin/bash

source ${SGX_SDK}/environment
git clone https://github.com/intel/intel-sgx-ssl.git
cd intel-sgx-ssl
git checkout lin_2.18_1.1.1q
cd ..
wget https://www.openssl.org/source/old/1.1.1/openssl-1.1.1q.tar.gz
mv openssl-1.1.1q.tar.gz intel-sgx-ssl/openssl_source
cd intel-sgx-ssl/Linux
make all test SGX_MODE=SIM 
make install 
