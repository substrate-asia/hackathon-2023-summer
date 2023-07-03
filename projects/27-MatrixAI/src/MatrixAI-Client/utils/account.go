/*
	Copyright (C) CESS. All rights reserved.
	Copyright (C) Cumulus Encrypted Storage System. All rights reserved.

	SPDX-License-Identifier: Apache-2.0
*/

package utils

import (
	"bytes"
	"fmt"
	"github.com/btcsuite/btcutil/base58"
	"github.com/centrifuge/go-substrate-rpc-client/v4/types"
	"github.com/pkg/errors"
	"golang.org/x/crypto/blake2b"
)

var (
	SSPrefix        = []byte{0x53, 0x53, 0x35, 0x38, 0x50, 0x52, 0x45}
	SubstratePrefix = []byte{0x2a}
	CessPrefix      = []byte{0x50, 0xac}
)

func ParsingPublickey(address string) ([]byte, error) {
	err := VerityAddress(address, CessPrefix)
	if err != nil {
		err := VerityAddress(address, SubstratePrefix)
		if err != nil {
			return nil, errors.New("Invalid account")
		}
		data := base58.Decode(address)
		if len(data) != (34 + len(SubstratePrefix)) {
			return nil, errors.New("Public key decoding failed")
		}
		return data[len(SubstratePrefix) : len(data)-2], nil
	} else {
		data := base58.Decode(address)
		if len(data) != (34 + len(CessPrefix)) {
			return nil, errors.New("Public key decoding failed")
		}
		return data[len(CessPrefix) : len(data)-2], nil
	}
}

// func DecodePublicKeyOfSubstrateAccount(address string) ([]byte, error) {
// 	err := VerityAddress(address, SubstratePrefix)
// 	if err != nil {
// 		return nil, errors.New("Invalid account")
// 	}
// 	data := base58.Decode(address)
// 	if len(data) != (34 + len(SubstratePrefix)) {
// 		return nil, errors.New("Public key decoding failed")
// 	}
// 	return data[len(SubstratePrefix) : len(data)-2], nil
// }

func PubBytesToString(b []byte) string {
	s := ""
	for i := 0; i < len(b); i++ {
		tmp := fmt.Sprintf("%#02x", b[i])
		s += tmp[2:]
	}
	return s
}

func EncodePublicKeyAsSubstrateAccount(publicKey []byte) (string, error) {
	if len(publicKey) != 32 {
		return "", errors.New("Invalid public key")
	}
	payload := appendBytes(SubstratePrefix, publicKey)
	input := appendBytes(SSPrefix, payload)
	ck := blake2b.Sum512(input)
	checkum := ck[:2]
	address := base58.Encode(appendBytes(payload, checkum))
	if address == "" {
		return address, errors.New("Public key encoding failed")
	}
	return address, nil
}

func EncodePublicKeyAsCessAccount(publicKey []byte) (string, error) {
	if len(publicKey) != 32 {
		return "", errors.New("invalid public key")
	}
	payload := appendBytes(CessPrefix, publicKey)
	input := appendBytes(SSPrefix, payload)
	ck := blake2b.Sum512(input)
	checkNum := ck[:2]
	address := base58.Encode(appendBytes(payload, checkNum))
	if address == "" {
		return address, errors.New("public key encoding failed")
	}
	return address, nil
}

func appendBytes(data1, data2 []byte) []byte {
	if data2 == nil {
		return data1
	}
	return append(data1, data2...)
}

func VerityAddress(address string, prefix []byte) error {
	decodeBytes := base58.Decode(address)
	if len(decodeBytes) != (34 + len(prefix)) {
		return errors.New("Public key decoding failed")
	}
	if decodeBytes[0] != prefix[0] {
		return errors.New("Invalid account prefix")
	}
	pub := decodeBytes[len(prefix) : len(decodeBytes)-2]

	data := append(prefix, pub...)
	input := append(SSPrefix, data...)
	ck := blake2b.Sum512(input)
	checkSum := ck[:2]
	for i := 0; i < 2; i++ {
		if checkSum[i] != decodeBytes[32+len(prefix)+i] {
			return errors.New("Invalid account")
		}
	}
	if len(pub) != 32 {
		return errors.New("Invalid account public key")
	}
	return nil
}

func AreStorageKeysEqual(a, b types.StorageKey) bool {
	return bytes.Equal([]byte(a), []byte(b))
}
