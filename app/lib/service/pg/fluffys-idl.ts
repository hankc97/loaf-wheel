export type FluffiesWheel = {
  "version": "0.1.0",
  "name": "fluffies_wheel",
  "instructions": [
    {
      "name": "enterGame",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wheelState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "usdValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "payoutPrizeAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wheelState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "winner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createGameAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gameId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wheelState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "gameId",
            "type": "publicKey"
          },
          {
            "name": "usdValue",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "wheelState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "gameId",
            "type": "publicKey"
          },
          {
            "name": "winner",
            "type": "publicKey"
          },
          {
            "name": "usdValue",
            "type": "u64"
          },
          {
            "name": "timestampEnds",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GameNotStarted",
      "msg": "Game not started."
    },
    {
      "code": 6001,
      "name": "IncorrectAdminKey",
      "msg": "Incorrect admin key"
    },
    {
      "code": 6002,
      "name": "InvalidPaymentType",
      "msg": "Invalid payment type"
    },
    {
      "code": 6003,
      "name": "ExpectedWinner",
      "msg": "Expected a winner."
    },
    {
      "code": 6004,
      "name": "GameNotReady",
      "msg": "Game not ready."
    },
    {
      "code": 6005,
      "name": "GameIsOver",
      "msg": "Game is over."
    },
    {
      "code": 6006,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    }
  ]
};

export const IDL: FluffiesWheel = {
  "version": "0.1.0",
  "name": "fluffies_wheel",
  "instructions": [
    {
      "name": "enterGame",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wheelState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameId",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "usdValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "payoutPrizeAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "wheelState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "winner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createGameAdmin",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "gameId",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "wheelState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "gameId",
            "type": "publicKey"
          },
          {
            "name": "usdValue",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "wheelState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "gameId",
            "type": "publicKey"
          },
          {
            "name": "winner",
            "type": "publicKey"
          },
          {
            "name": "usdValue",
            "type": "u64"
          },
          {
            "name": "timestampEnds",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GameNotStarted",
      "msg": "Game not started."
    },
    {
      "code": 6001,
      "name": "IncorrectAdminKey",
      "msg": "Incorrect admin key"
    },
    {
      "code": 6002,
      "name": "InvalidPaymentType",
      "msg": "Invalid payment type"
    },
    {
      "code": 6003,
      "name": "ExpectedWinner",
      "msg": "Expected a winner."
    },
    {
      "code": 6004,
      "name": "GameNotReady",
      "msg": "Game not ready."
    },
    {
      "code": 6005,
      "name": "GameIsOver",
      "msg": "Game is over."
    },
    {
      "code": 6006,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds"
    }
  ]
};
