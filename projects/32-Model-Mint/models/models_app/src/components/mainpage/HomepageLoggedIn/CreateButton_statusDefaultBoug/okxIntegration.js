export function enableOKXWallet(buyButton) {
    window.okxwallet
      .request({ method: 'eth_accounts' })
      .then((accounts) => {
        if (buyButton) {
          buyButton.addEventListener('click', () => {
            window.okxwallet
              .request({
                method: 'eth_sendTransaction',
                params: [
                  {
                    from: accounts[0],
                    to: '0x2f318C334780961FB129D2a6c30D0763d9a5C970',
                    value: '0xA0BE826F7A0000',
                    gasPrice: '0x09184e72a000',
                    gas: '0x2710',
                  },
                ],
              })
              .then((txHash) => {
                console.log(txHash);
              })
              .catch((error) => {
                console.log(error);
              });
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  