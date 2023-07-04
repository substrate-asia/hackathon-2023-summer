## The template of Zokrates integration

Here we provide a template to use Zokartes with Moonbeam. The smart contract on the Moonbeam will works as the verifier and any users can use this smart contract to show they know the right answer. The verifier check the discrete square root challenge as shown:

```
def main(private field a, field b) {
	assert(a * a == b);
	return;
}
```

If the user know the private a, he/she can prove it and pass the smart contract verification. Otherwise he/she verse.

To try this template, you can use the following command line:
```
node verify.js
```