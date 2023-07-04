package main

import (
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
)

type EventDepDnsDnsRecord struct {
	Phase      types.Phase
	Name       string
	RecordType types.U8
	Value      string
	Topics     []types.Hash
}

type EventDepDnsDnsRecordRemoved struct {
	Phase      types.Phase
	Name       string
	RecordType types.U8
	Topics     []types.Hash
}

type EventDepDnsRigistrationUpdated struct {
	Phase  types.Phase
	Name   string
	Topics []types.Hash
}

type EventDepDnsCancelDomain struct {
	Phase  types.Phase
	Name   string
	Owner  types.AccountID
	Topics []types.Hash
}

type EventDepDnsRenew struct {
	Phase  types.Phase
	Name   string
	Expire types.U32
	Topics []types.Hash
}

type EventDepDnsOwnerShip struct {
	Phase    types.Phase
	Name     string
	OldOwner types.AccountID
	Owner    types.AccountID
	Topics   []types.Hash
}

type EventDepDnsRigistration struct {
	Phase  types.Phase
	Name   string
	Owner  types.AccountID
	Expire types.U32
	Topics []types.Hash
}

type MyEvent struct {
	types.EventRecords
	DepDns_DnsRecord           []EventDepDnsDnsRecord
	DepDns_DnsRecordRemoved    []EventDepDnsDnsRecordRemoved
	DepDns_Rigistration        []EventDepDnsRigistration
	DepDns_OwnerShip           []EventDepDnsOwnerShip
	DepDns_Renew               []EventDepDnsRenew
	DepDns_CancelDomain        []EventDepDnsCancelDomain
	DepDns_RigistrationUpdated []EventDepDnsRigistrationUpdated
}
