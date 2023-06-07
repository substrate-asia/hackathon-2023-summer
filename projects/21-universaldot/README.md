# UNIVERSALDOT Project Proposal

### Overview

##### Executive summary
A freelancing decentralized application (dApp) that allows individuals to create/complete tasks and organize themselves by creating geographically distributed organizations.

##### Brief Description
The creation of Bitcoin allowed for easy exchange of digital tokens of value. Currently, value is created in the real world, and exchanged in the digital world. Our dApp allows for digital creation of value in addition to digital exchange of value.

This dApp will be developed using Substrate. New pallets will create the business logic layer which will allow users to directly interact with each another using tasks. A basic front-end application will be developed as reference.

To be even more concrete, our project improves on the concept of bounties within Polkadot, in the following ways...
- Better UI experience that abstracts out all necessary blockchain knowledge.
- No council approval. Tasks can be created/completed without intermediary.

In addition to the above mentioned points, universaldot will also have the following features:
- Creation of User profiles with basic metadata. 
- Creation of Organizations.
- Transfer of intellectual property through task creation/completion.

### Project Details

#### Techology Stack
  - React, 
  - TypeScript
  - Substrate

### Additional Information

Use Case Diagram
![Architecture Design](https://github.com/UniversalDot/documents/blob/master/designs/architecture/Use-Case.drawio.png?raw=true)


Bellow are provided minimal requirements/implementation details for each pallet. 
Note: The final version _may_ contain more storage items and functions.

Profile Pallet
```
HashMap Profile <Key: AccountID, value: profile> 

profile: {  
  owner:
  balance:
  interests:
  reputation
}

RPC Methods: 
create_profile(origin: OriginFor<T>, interests: Vec<u8>) -> DispatchResult
update_profile((origin: OriginFor<T>, interests: Vec<u8>) > DispatchResult
delete_profile((origin: OriginFor<T>) > DispatchResult 
```
Task Pallet
```
HashMap Task <Key: hash, value: task> 

task: {
  creator:
  requirements:
  budget:
  state:
}

RPC Methods:
create_task(origin: OriginFor<T>, requirements: Vec<u8>, budget: u32) -> DispatchResult
start_task(origin: OriginFor<T>, task_id: T::Hash) -> DispatchResult 
finish_task(origin: OriginFor<T>, task_id: T::Hash) -> DispatchResult

```

DAO Pallet
```
HashNMap Profile

RPC Methods:
create_organization(origin: OriginFor<T>, name: Vec<u8>) -> DispatchResult
add_member(origin: OriginFor<T>, AccountID) -> DispatchResult
remove_member(origin: OriginFor<T>, AccountID) -> DispatchResult
add_task(origin: OriginFor<T>, AccountID) -> DispatchResult
