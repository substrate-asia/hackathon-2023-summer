ssh-keygen -t rsa -m PEM -f rsa.key
openssl rsa -in rsa.key -pubout > rsa.pub
export RSA_KEY=`cat rsa.key`
export RSA_PUB_KEY=`cat rsa.pub`
