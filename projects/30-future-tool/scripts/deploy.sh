export $(grep -v '^#' .env | xargs -d '\n')
export $(grep -v '^#' .env-secret | xargs -d '\n')

forge --version
if [ $? != 0 ]; then
    export PATH="$PATH:~/.foundry/bin"
    forge --version
    if [ $? != 0 ]; then
        echo "forge is not installed, please install first"
        exit 2
    fi
fi

if [[ $RPC_URL == "" ]]; then
    echo "set RPC_URL in .env file before use this program"
    exit 3
fi

if [[ $PRIVATE_KEY == "" ]]; then
    echo "set PRIVATE_KEY in .env-secret file before use this program"
    exit 4
fi

set -e

output=$(forge create src/contracts/BoardEligibilityVerifier.sol:BoardEligibilityVerifier \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy | tee /dev/tty)
echo $output

boardAddress=$(echo "$output" | grep "Deployed to:"  | awk -F ': ' '{print $2}')

echo $boardAddress

output=$(forge create src/contracts/RevealAttackVerifier.sol:RevealAttackVerifier \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy | tee /dev/tty)
echo $output

attackAddress=$(echo "$output" | grep "Deployed to:"  | awk -F ': ' '{print $2}')

echo $attackAddress

forge create src/contracts/Game.sol:Game \
    --constructor-args $boardAddress $attackAddress \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --legacy
