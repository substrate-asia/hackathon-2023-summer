#!/bin/bash

cd /root/
git clone https://github.com/keysafe-protocol/keysafe-sgx.git
cd keysafe-sgx
git checkout dev
make SGX_MODE=SW
