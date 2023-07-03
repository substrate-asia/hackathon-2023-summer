## Some Thinkings

On this protocol, I have some raw ideas.

### App Prefix in table schema design

Because this will adopt the ODAM to host a network, which has a relatively high cost than the counterpart of a traditional Internet web application, so we'd better to support a cluster of apps in one backend network. And those db schemas of different ODAs should be kept separated from each other by being designated different table names, so this is why we use a `gutp` prefix in the first schema design. And this app would be a monolithic service.

###  The Public and the Privacy

Basically, the content part should be open, where the ODA originates from. 

There would be no `password` field in the user table, since the whole db would be open between all network nodes. That means, in theoretically, anyone can see your password, even that was md5ed and salted by another `salt` field.

In our new ODAM, we will discard the `password` field. So, the user of a ODA, can only rely on an OATH login every time if the browser has no cookie cache on its local. And, the best method is that do NOT login, by the public key/private key signature method, which could verify whether a user is legal by decrypt his signature. This is crucial for the ODA.

And by default, the portion of personal data should be kept encrypted, so if a user hasn't bound his web3 account by a wallet plugin, he can't get the advanced features of this ODA.



