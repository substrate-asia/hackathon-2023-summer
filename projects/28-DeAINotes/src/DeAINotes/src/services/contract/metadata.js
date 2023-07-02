export default {
  "source": {
    "hash": "0xdc07f8eab0f42135e751d5f0b3f7357c3aac3730a49ce5972747b5d83db533dc",
    "language": "ink! 3.0.1",
    "compiler": "rustc 1.66.0-nightly"
  },
  "contract": {
    "name": "videown",
    "version": "1.0.0",
    "authors": [
      "The best developer ever"
    ]
  },
  "V3": {
    "spec": {
      "constructors": [
        {
          "args": [],
          "docs": [],
          "label": "new",
          "payable": false,
          "selector": "0x9bae9d5e"
        }
      ],
      "docs": [],
      "events": [
        {
          "args": [
            {
              "docs": [],
              "indexed": true,
              "label": "from",
              "type": {
                "displayName": [
                  "Option"
                ],
                "type": 18
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "to",
              "type": {
                "displayName": [
                  "Option"
                ],
                "type": 18
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 1
              }
            }
          ],
          "docs": [
            " Event emitted when a token transfer occurs."
          ],
          "label": "Transfer"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": true,
              "label": "from",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 8
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "to",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 8
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "id",
              "type": {
                "displayName": [
                  "Option"
                ],
                "type": 14
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "approved",
              "type": {
                "displayName": [
                  "bool"
                ],
                "type": 26
              }
            }
          ],
          "docs": [
            " Event emitted when a token approve occurs."
          ],
          "label": "Approval"
        },
        {
          "args": [
            {
              "docs": [],
              "indexed": true,
              "label": "seller",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 8
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "buyer",
              "type": {
                "displayName": [
                  "AccountId"
                ],
                "type": 8
              }
            },
            {
              "docs": [],
              "indexed": true,
              "label": "id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 1
              }
            },
            {
              "docs": [],
              "indexed": false,
              "label": "price",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 6
              }
            }
          ],
          "docs": [
            " Event emitted when a token trade occurs."
          ],
          "label": "Trade"
        }
      ],
      "messages": [
        {
          "args": [
            {
              "label": "id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 1
              }
            },
            {
              "label": "price",
              "type": {
                "displayName": [
                  "Balance"
                ],
                "type": 6
              }
            }
          ],
          "docs": [],
          "label": "ask",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "Result"
            ],
            "type": 22
          },
          "selector": "0x020f741e"
        },
        {
          "args": [
            {
              "label": "id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 1
              }
            }
          ],
          "docs": [],
          "label": "buy",
          "mutates": true,
          "payable": true,
          "returnType": {
            "displayName": [
              "Result"
            ],
            "type": 22
          },
          "selector": "0x15d62801"
        },
        {
          "args": [
            {
              "label": "id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 1
              }
            }
          ],
          "docs": [],
          "label": "cancel",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "Result"
            ],
            "type": 22
          },
          "selector": "0x9796e9a7"
        },
        {
          "args": [
            {
              "label": "id",
              "type": {
                "displayName": [
                  "Id"
                ],
                "type": 1
              }
            }
          ],
          "docs": [],
          "label": "price",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "Option"
            ],
            "type": 25
          },
          "selector": "0xd4bd7bc1"
        },
        {
          "args": [
            {
              "label": "owner",
              "type": {
                "displayName": [
                  "psp34_external",
                  "AllowanceInput1"
                ],
                "type": 8
              }
            },
            {
              "label": "operator",
              "type": {
                "displayName": [
                  "psp34_external",
                  "AllowanceInput2"
                ],
                "type": 8
              }
            },
            {
              "label": "id",
              "type": {
                "displayName": [
                  "psp34_external",
                  "AllowanceInput3"
                ],
                "type": 14
              }
            }
          ],
          "docs": [],
          "label": "PSP34::allowance",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34_external",
              "AllowanceOutput"
            ],
            "type": 26
          },
          "selector": "0x4790f55a"
        },
        {
          "args": [
            {
              "label": "operator",
              "type": {
                "displayName": [
                  "psp34_external",
                  "ApproveInput1"
                ],
                "type": 8
              }
            },
            {
              "label": "id",
              "type": {
                "displayName": [
                  "psp34_external",
                  "ApproveInput2"
                ],
                "type": 14
              }
            },
            {
              "label": "approved",
              "type": {
                "displayName": [
                  "psp34_external",
                  "ApproveInput3"
                ],
                "type": 26
              }
            }
          ],
          "docs": [],
          "label": "PSP34::approve",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34_external",
              "ApproveOutput"
            ],
            "type": 22
          },
          "selector": "0x1932a8b0"
        },
        {
          "args": [],
          "docs": [],
          "label": "PSP34::total_supply",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34_external",
              "TotalSupplyOutput"
            ],
            "type": 6
          },
          "selector": "0x628413fe"
        },
        {
          "args": [
            {
              "label": "id",
              "type": {
                "displayName": [
                  "psp34_external",
                  "OwnerOfInput1"
                ],
                "type": 1
              }
            }
          ],
          "docs": [],
          "label": "PSP34::owner_of",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34_external",
              "OwnerOfOutput"
            ],
            "type": 18
          },
          "selector": "0x1168624d"
        },
        {
          "args": [
            {
              "label": "to",
              "type": {
                "displayName": [
                  "psp34_external",
                  "TransferInput1"
                ],
                "type": 8
              }
            },
            {
              "label": "id",
              "type": {
                "displayName": [
                  "psp34_external",
                  "TransferInput2"
                ],
                "type": 1
              }
            },
            {
              "label": "data",
              "type": {
                "displayName": [
                  "psp34_external",
                  "TransferInput3"
                ],
                "type": 7
              }
            }
          ],
          "docs": [],
          "label": "PSP34::transfer",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34_external",
              "TransferOutput"
            ],
            "type": 22
          },
          "selector": "0x3128d61b"
        },
        {
          "args": [],
          "docs": [],
          "label": "PSP34::collection_id",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34_external",
              "CollectionIdOutput"
            ],
            "type": 1
          },
          "selector": "0xffa27a5f"
        },
        {
          "args": [
            {
              "label": "owner",
              "type": {
                "displayName": [
                  "psp34_external",
                  "BalanceOfInput1"
                ],
                "type": 8
              }
            }
          ],
          "docs": [],
          "label": "PSP34::balance_of",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34_external",
              "BalanceOfOutput"
            ],
            "type": 4
          },
          "selector": "0xcde7e55f"
        },
        {
          "args": [
            {
              "label": "account",
              "type": {
                "displayName": [
                  "psp34mintable_external",
                  "MintInput1"
                ],
                "type": 8
              }
            },
            {
              "label": "id",
              "type": {
                "displayName": [
                  "psp34mintable_external",
                  "MintInput2"
                ],
                "type": 1
              }
            }
          ],
          "docs": [],
          "label": "PSP34Mintable::mint",
          "mutates": true,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34mintable_external",
              "MintOutput"
            ],
            "type": 22
          },
          "selector": "0x6c41f2ec"
        },
        {
          "args": [
            {
              "label": "owner",
              "type": {
                "displayName": [
                  "psp34enumerable_external",
                  "OwnersTokenByIndexInput1"
                ],
                "type": 8
              }
            },
            {
              "label": "index",
              "type": {
                "displayName": [
                  "psp34enumerable_external",
                  "OwnersTokenByIndexInput2"
                ],
                "type": 6
              }
            }
          ],
          "docs": [],
          "label": "PSP34Enumerable::owners_token_by_index",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34enumerable_external",
              "OwnersTokenByIndexOutput"
            ],
            "type": 27
          },
          "selector": "0x3bcfb511"
        },
        {
          "args": [
            {
              "label": "index",
              "type": {
                "displayName": [
                  "psp34enumerable_external",
                  "TokenByIndexInput1"
                ],
                "type": 6
              }
            }
          ],
          "docs": [],
          "label": "PSP34Enumerable::token_by_index",
          "mutates": false,
          "payable": false,
          "returnType": {
            "displayName": [
              "psp34enumerable_external",
              "TokenByIndexOutput"
            ],
            "type": 27
          },
          "selector": "0xcd0340d0"
        }
      ]
    },
    "storage": {
      "struct": {
        "fields": [
          {
            "layout": {
              "struct": {
                "fields": [
                  {
                    "layout": {
                      "cell": {
                        "key": "0xca887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                        "ty": 0
                      }
                    },
                    "name": "token_owner"
                  },
                  {
                    "layout": {
                      "cell": {
                        "key": "0xcb887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                        "ty": 11
                      }
                    },
                    "name": "owned_tokens_count"
                  },
                  {
                    "layout": {
                      "cell": {
                        "key": "0xcc887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                        "ty": 12
                      }
                    },
                    "name": "operator_approvals"
                  },
                  {
                    "layout": {
                      "cell": {
                        "key": "0xcd887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                        "ty": 6
                      }
                    },
                    "name": "total_supply"
                  },
                  {
                    "layout": {
                      "enum": {
                        "dispatchKey": "0xce887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                        "variants": {
                          "0": {
                            "fields": [
                              {
                                "layout": {
                                  "cell": {
                                    "key": "0xcf887b42fe11b9165176009de2f405a7b125d635c1cce6b1c20dbec072c3df76",
                                    "ty": 15
                                  }
                                },
                                "name": null
                              }
                            ]
                          },
                          "1": {
                            "fields": []
                          }
                        }
                      }
                    },
                    "name": "_reserved"
                  }
                ]
              }
            },
            "name": "psp34"
          },
          {
            "layout": {
              "struct": {
                "fields": [
                  {
                    "layout": {
                      "struct": {
                        "fields": [
                          {
                            "layout": {
                              "cell": {
                                "key": "0x0391b8a2812992ad5b7f27efbc1900a7844ca2e0c7d339f1fb06830ec558f750",
                                "ty": 16
                              }
                            },
                            "name": "id_to_index"
                          },
                          {
                            "layout": {
                              "cell": {
                                "key": "0x0491b8a2812992ad5b7f27efbc1900a7844ca2e0c7d339f1fb06830ec558f750",
                                "ty": 19
                              }
                            },
                            "name": "index_to_id"
                          }
                        ]
                      }
                    },
                    "name": "enumerable"
                  },
                  {
                    "layout": {
                      "enum": {
                        "dispatchKey": "0x0591b8a2812992ad5b7f27efbc1900a7844ca2e0c7d339f1fb06830ec558f750",
                        "variants": {
                          "0": {
                            "fields": [
                              {
                                "layout": {
                                  "cell": {
                                    "key": "0x0691b8a2812992ad5b7f27efbc1900a7844ca2e0c7d339f1fb06830ec558f750",
                                    "ty": 15
                                  }
                                },
                                "name": null
                              }
                            ]
                          },
                          "1": {
                            "fields": []
                          }
                        }
                      }
                    },
                    "name": "_reserved"
                  }
                ]
              }
            },
            "name": "enumerable"
          },
          {
            "layout": {
              "cell": {
                "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                "ty": 21
              }
            },
            "name": "asks"
          }
        ]
      }
    },
    "types": [
      {
        "id": 0,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 10,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 1
            },
            {
              "name": "V",
              "type": 8
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 1,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 2,
                      "typeName": "u8"
                    }
                  ],
                  "index": 0,
                  "name": "U8"
                },
                {
                  "fields": [
                    {
                      "type": 3,
                      "typeName": "u16"
                    }
                  ],
                  "index": 1,
                  "name": "U16"
                },
                {
                  "fields": [
                    {
                      "type": 4,
                      "typeName": "u32"
                    }
                  ],
                  "index": 2,
                  "name": "U32"
                },
                {
                  "fields": [
                    {
                      "type": 5,
                      "typeName": "u64"
                    }
                  ],
                  "index": 3,
                  "name": "U64"
                },
                {
                  "fields": [
                    {
                      "type": 6,
                      "typeName": "u128"
                    }
                  ],
                  "index": 4,
                  "name": "U128"
                },
                {
                  "fields": [
                    {
                      "type": 7,
                      "typeName": "Vec<u8>"
                    }
                  ],
                  "index": 5,
                  "name": "Bytes"
                }
              ]
            }
          },
          "path": [
            "contracts",
            "traits",
            "psp34",
            "psp34",
            "Id"
          ]
        }
      },
      {
        "id": 2,
        "type": {
          "def": {
            "primitive": "u8"
          }
        }
      },
      {
        "id": 3,
        "type": {
          "def": {
            "primitive": "u16"
          }
        }
      },
      {
        "id": 4,
        "type": {
          "def": {
            "primitive": "u32"
          }
        }
      },
      {
        "id": 5,
        "type": {
          "def": {
            "primitive": "u64"
          }
        }
      },
      {
        "id": 6,
        "type": {
          "def": {
            "primitive": "u128"
          }
        }
      },
      {
        "id": 7,
        "type": {
          "def": {
            "sequence": {
              "type": 2
            }
          }
        }
      },
      {
        "id": 8,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "type": 9,
                  "typeName": "[u8; 32]"
                }
              ]
            }
          },
          "path": [
            "ink_env",
            "types",
            "AccountId"
          ]
        }
      },
      {
        "id": 9,
        "type": {
          "def": {
            "array": {
              "len": 32,
              "type": 2
            }
          }
        }
      },
      {
        "id": 10,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "type": 9,
                  "typeName": "[u8; 32]"
                }
              ]
            }
          },
          "path": [
            "ink_primitives",
            "Key"
          ]
        }
      },
      {
        "id": 11,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 10,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 8
            },
            {
              "name": "V",
              "type": 4
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 12,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 10,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 13
            },
            {
              "name": "V",
              "type": 15
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 13,
        "type": {
          "def": {
            "tuple": [
              8,
              8,
              14
            ]
          }
        }
      },
      {
        "id": 14,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "index": 0,
                  "name": "None"
                },
                {
                  "fields": [
                    {
                      "type": 1
                    }
                  ],
                  "index": 1,
                  "name": "Some"
                }
              ]
            }
          },
          "params": [
            {
              "name": "T",
              "type": 1
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 15,
        "type": {
          "def": {
            "tuple": []
          }
        }
      },
      {
        "id": 16,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 10,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 17
            },
            {
              "name": "V",
              "type": 6
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 17,
        "type": {
          "def": {
            "tuple": [
              18,
              1
            ]
          }
        }
      },
      {
        "id": 18,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "index": 0,
                  "name": "None"
                },
                {
                  "fields": [
                    {
                      "type": 8
                    }
                  ],
                  "index": 1,
                  "name": "Some"
                }
              ]
            }
          },
          "params": [
            {
              "name": "T",
              "type": 8
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 19,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 10,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 20
            },
            {
              "name": "V",
              "type": 1
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 20,
        "type": {
          "def": {
            "tuple": [
              18,
              6
            ]
          }
        }
      },
      {
        "id": 21,
        "type": {
          "def": {
            "composite": {
              "fields": [
                {
                  "name": "offset_key",
                  "type": 10,
                  "typeName": "Key"
                }
              ]
            }
          },
          "params": [
            {
              "name": "K",
              "type": 1
            },
            {
              "name": "V",
              "type": 6
            }
          ],
          "path": [
            "ink_storage",
            "lazy",
            "mapping",
            "Mapping"
          ]
        }
      },
      {
        "id": 22,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 15
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 23
                    }
                  ],
                  "index": 1,
                  "name": "Err"
                }
              ]
            }
          },
          "params": [
            {
              "name": "T",
              "type": 15
            },
            {
              "name": "E",
              "type": 23
            }
          ],
          "path": [
            "Result"
          ]
        }
      },
      {
        "id": 23,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 24,
                      "typeName": "String"
                    }
                  ],
                  "index": 0,
                  "name": "Custom"
                },
                {
                  "index": 1,
                  "name": "SelfApprove"
                },
                {
                  "index": 2,
                  "name": "NotApproved"
                },
                {
                  "index": 3,
                  "name": "TokenExists"
                },
                {
                  "index": 4,
                  "name": "TokenNotExists"
                },
                {
                  "fields": [
                    {
                      "type": 24,
                      "typeName": "String"
                    }
                  ],
                  "index": 5,
                  "name": "SafeTransferCheckFailed"
                }
              ]
            }
          },
          "path": [
            "contracts",
            "traits",
            "errors",
            "psp34",
            "PSP34Error"
          ]
        }
      },
      {
        "id": 24,
        "type": {
          "def": {
            "primitive": "str"
          }
        }
      },
      {
        "id": 25,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "index": 0,
                  "name": "None"
                },
                {
                  "fields": [
                    {
                      "type": 6
                    }
                  ],
                  "index": 1,
                  "name": "Some"
                }
              ]
            }
          },
          "params": [
            {
              "name": "T",
              "type": 6
            }
          ],
          "path": [
            "Option"
          ]
        }
      },
      {
        "id": 26,
        "type": {
          "def": {
            "primitive": "bool"
          }
        }
      },
      {
        "id": 27,
        "type": {
          "def": {
            "variant": {
              "variants": [
                {
                  "fields": [
                    {
                      "type": 1
                    }
                  ],
                  "index": 0,
                  "name": "Ok"
                },
                {
                  "fields": [
                    {
                      "type": 23
                    }
                  ],
                  "index": 1,
                  "name": "Err"
                }
              ]
            }
          },
          "params": [
            {
              "name": "T",
              "type": 1
            },
            {
              "name": "E",
              "type": 23
            }
          ],
          "path": [
            "Result"
          ]
        }
      }
    ]
  }
}