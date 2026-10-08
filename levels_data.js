// [XYZ300] Level Definitions Module: Campaign sector and wave definitions catalog, tower unlock overrides, and level editor metadata.

// [XYZ301] Campaign Level Waves Catalog: Sector level configurations defining starting resources, wave sequences, enemy spawn compositions, and bounty metrics.
var LEVELS_DATA = {
  "1": {
    "mapId": "L1",
    "startHp": 10,
    "startGold": 90,
    "totalWaves": 2,
    "unlockedTowers": [
      "gun"
    ],
    "canUpgrade": false,
    "waves": [
      {
        "wave": 1,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 5,
            "hp": 32,
            "speed": 50,
            "interval": 1.045,
            "bounty": 7,
            "hpMult": 0.8,
            "speedMult": 0.91,
            "bountyMult": 1
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 2,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 3,
            "hp": 40,
            "speed": 50,
            "interval": 0.88,
            "bounty": 7,
            "hpMult": 1,
            "speedMult": 0.91,
            "bountyMult": 1
          }
        ],
        "delayAfter": 5
      }
    ]
  },
  "2": {
    "mapId": "L2",
    "startHp": 10,
    "startGold": 115,
    "totalWaves": 2,
    "unlockedTowers": [
      "gun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 6,
            "hp": 60,
            "hpMult": 1.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.75,
            "bounty": 7,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 6,
            "hp": 100,
            "hpMult": 1.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.75,
            "bounty": 7,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      }
    ]
  },
  "3": {
    "mapId": "L3",
    "startHp": 10,
    "startGold": 110,
    "totalWaves": 4,
    "unlockedTowers": [
      "gun",
      "laser"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 7,
            "hp": 38,
            "speed": 55,
            "interval": 0.825,
            "bounty": 7,
            "speedMult": 1,
            "hpMult": 0.95,
            "bountyMult": 1
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 2,
        "spawns": [
          {
            "type": "scout",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 6,
            "hp": 24,
            "speed": 110,
            "interval": 0.6,
            "bounty": 6,
            "speedMult": 1,
            "hpMult": 1,
            "bountyMult": 1
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 3,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 8,
            "hp": 40,
            "speed": 55,
            "interval": 0.825,
            "bounty": 12,
            "hpMult": 1,
            "speedMult": 1,
            "bountyMult": 1.71
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 4,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": true,
            "count": 1,
            "hp": 180,
            "speed": 55,
            "interval": 1.3,
            "bounty": 54,
            "speedMult": 1,
            "hpMult": 4.5,
            "bountyMult": 3.09
          }
        ],
        "delayAfter": 5
      }
    ]
  },
  "4": {
    "mapId": "L4",
    "startHp": 10,
    "startGold": 125,
    "totalWaves": 5,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 10,
            "hp": 40,
            "speed": 55,
            "interval": 0.77,
            "bounty": 7,
            "speedMult": 1,
            "hpMult": 1,
            "bountyMult": 1
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 2,
        "spawns": [
          {
            "type": "scout",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 7,
            "hp": 25,
            "speed": 110,
            "interval": 0.562,
            "bounty": 7,
            "hpMult": 1.04,
            "speedMult": 1,
            "bountyMult": 1.17
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 3,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 10,
            "hp": 48,
            "speed": 55,
            "interval": 0.77,
            "bounty": 7,
            "hpMult": 1.2,
            "speedMult": 1,
            "bountyMult": 1
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 4,
        "spawns": [
          {
            "type": "tank",
            "isBoss": false,
            "isMiniBoss": false,
            "count": 2,
            "hp": 115,
            "speed": 38,
            "interval": 1.282,
            "bounty": 12,
            "speedMult": 1,
            "hpMult": 1.15,
            "bountyMult": 1
          }
        ],
        "delayAfter": 5
      },
      {
        "wave": 5,
        "spawns": [
          {
            "type": "grunt",
            "isBoss": false,
            "isMiniBoss": true,
            "count": 1,
            "hp": 380,
            "speed": 44,
            "interval": 1.3,
            "bounty": 35,
            "speedMult": 0.8,
            "hpMult": 9.5,
            "bountyMult": 2
          }
        ],
        "delayAfter": 5
      }
    ]
  },
  "5": {
    "mapId": "L5",
    "startHp": 10,
    "startGold": 135,
    "totalWaves": 6,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 5,
            "hp": 45,
            "hpMult": 1.13,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 15,
            "bountyMult": 2.14,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 7,
            "hp": 29,
            "hpMult": 1.21,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 284,
            "hpMult": 2.84,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 6,
            "hp": 162,
            "hpMult": 4.05,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 13,
            "bountyMult": 1.86,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 7,
            "hp": 86,
            "hpMult": 3.58,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 14,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 711,
            "hpMult": 7.11,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 45,
            "bountyMult": 3.75,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 1851,
            "hpMult": 46.28,
            "speed": 47,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 60,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "6": {
    "mapId": "L6",
    "startHp": 10,
    "startGold": 145,
    "totalWaves": 6,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 6,
            "hp": 66,
            "hpMult": 1.65,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 14,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 207,
            "hpMult": 2.07,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 14,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 8,
            "hp": 53,
            "hpMult": 2.21,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 14,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 7,
            "hp": 210,
            "hpMult": 5.25,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 14,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 7,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 499,
            "hpMult": 4.99,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 15,
            "bountyMult": 1.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 6,
            "hp": 225,
            "hpMult": 5.63,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 8,
            "bountyMult": 1.14,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 14,
            "hp": 130,
            "hpMult": 3.25,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 4,
            "bountyMult": 0.57,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 1166,
            "hpMult": 48.58,
            "speed": 94,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 69,
            "bountyMult": 4.6,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "7": {
    "mapId": "L7",
    "startHp": 10,
    "startGold": 160,
    "totalWaves": 7,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 8,
            "hp": 25,
            "hpMult": 1.04,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 7,
            "hp": 127,
            "hpMult": 3.18,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 8,
            "hp": 62,
            "hpMult": 2.58,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 16,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 10,
            "hp": 261,
            "hpMult": 2.61,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 11,
            "bountyMult": 0.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 8,
            "hp": 79,
            "hpMult": 3.29,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 8,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 12,
            "hp": 123,
            "hpMult": 3.08,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 6,
            "bountyMult": 0.86,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 9,
            "hp": 107,
            "hpMult": 4.46,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 12,
            "hp": 262,
            "hpMult": 2.62,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 7,
            "bountyMult": 0.58,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 9,
            "hp": 135,
            "hpMult": 5.63,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 5803,
            "hpMult": 58.03,
            "speed": 32,
            "speedMult": 0.84,
            "interval": 1.2,
            "bounty": 79,
            "bountyMult": 2.63,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "8": {
    "mapId": "L8",
    "startHp": 10,
    "startGold": 175,
    "totalWaves": 7,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 7,
            "hp": 73,
            "hpMult": 1.83,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 15,
            "bountyMult": 2.14,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 222,
            "hpMult": 2.22,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 15,
            "bountyMult": 1.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 9,
            "hp": 64,
            "hpMult": 2.67,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 16,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 222,
            "hpMult": 5.55,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 16,
            "bountyMult": 2.29,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 411,
            "hpMult": 4.11,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 17,
            "bountyMult": 1.42,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 9,
            "hp": 75,
            "hpMult": 3.13,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 16,
            "hp": 194,
            "hpMult": 4.85,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 584,
            "hpMult": 5.84,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 16,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 3767,
            "hpMult": 94.18,
            "speed": 47,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 89,
            "bountyMult": 2.97,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "9": {
    "mapId": "L9",
    "startHp": 10,
    "startGold": 190,
    "totalWaves": 8,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 966,
            "hpMult": 9.66,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 115,
            "bountyMult": 9.58,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 2,
            "hp": 935,
            "hpMult": 9.35,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 50,
            "bountyMult": 4.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 849,
            "hpMult": 8.49,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 53,
            "bountyMult": 4.42,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 990,
            "hpMult": 9.9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 596,
            "hpMult": 5.96,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 21,
            "bountyMult": 1.75,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 7,
            "hp": 298,
            "hpMult": 7.45,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 9,
            "bountyMult": 1.29,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 650,
            "hpMult": 6.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 133,
            "hpMult": 5.54,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 719,
            "hpMult": 7.19,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 21,
            "bountyMult": 1.75,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 7,
            "hp": 475,
            "hpMult": 11.88,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 9,
            "bountyMult": 1.29,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 654,
            "hpMult": 6.54,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 2507,
            "hpMult": 104.46,
            "speed": 94,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 86,
            "bountyMult": 5.73,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "10": {
    "mapId": "L10",
    "startHp": 10,
    "startGold": 200,
    "totalWaves": 8,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 7,
            "hp": 147,
            "hpMult": 3.68,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 17,
            "bountyMult": 2.43,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 305,
            "hpMult": 3.05,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 16,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "scout",
            "count": 10,
            "hp": 107,
            "hpMult": 4.46,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 17,
            "bountyMult": 2.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 404,
            "hpMult": 4.04,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 14,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 267,
            "hpMult": 6.68,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 7,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 589,
            "hpMult": 5.89,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 119,
            "hpMult": 4.96,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 6,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 647,
            "hpMult": 6.47,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 383,
            "hpMult": 9.58,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 8,
            "bountyMult": 1.14,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 924,
            "hpMult": 9.24,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 26,
            "bountyMult": 2.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 190,
            "hpMult": 7.92,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 5,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 489,
            "hpMult": 12.23,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 15,
            "bountyMult": 2.14,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 196,
            "hpMult": 8.17,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 4,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 9493,
            "hpMult": 94.93,
            "speed": 29,
            "speedMult": 0.76,
            "interval": 1.2,
            "bounty": 100,
            "bountyMult": 1.67,
            "isBoss": true,
            "isMiniBoss": false
          }
        ]
      }
    ]
  },
  "11": {
    "mapId": "L11",
    "startHp": 10,
    "startGold": 125,
    "totalWaves": 8,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 10,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "grunt",
            "count": 7,
            "hp": 75,
            "hpMult": 1.88,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 7,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "swarm",
            "count": 14,
            "hp": 1,
            "hpMult": 0.06,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 7,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 122,
            "hpMult": 3.05,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 12,
            "bountyMult": 1.71,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 7,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 45,
            "hpMult": 1.88,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 7,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "grunt",
            "count": 9,
            "hp": 140,
            "hpMult": 3.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 18,
            "hp": 14,
            "hpMult": 0.88,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 3,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 7,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 111,
            "hpMult": 2.78,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 9,
            "bountyMult": 1.29,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 55,
            "hpMult": 2.29,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 7,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 96,
            "hpMult": 4,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 20,
            "hp": 27,
            "hpMult": 1.69,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 4,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 7,
        "earlyBonus": 20,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 111,
            "hpMult": 4.63,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 3572,
            "hpMult": 89.3,
            "speed": 47,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 130,
            "bountyMult": 18.57,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "12": {
    "mapId": "L12",
    "startHp": 10,
    "startGold": 135,
    "totalWaves": 8,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 14,
            "hp": 5,
            "hpMult": 0.31,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 104,
            "hpMult": 2.6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 10,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 80,
            "hpMult": 0.8,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 21,
            "bountyMult": 1.75,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 18,
            "hp": 26,
            "hpMult": 1.63,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 4,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 15,
            "hp": 80,
            "hpMult": 2,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 6,
            "bountyMult": 0.86,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 80,
            "hpMult": 3.33,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 15,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 40,
            "hpMult": 2.5,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 4,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 544,
            "hpMult": 5.44,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 15,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 185,
            "hpMult": 7.71,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 798,
            "hpMult": 7.98,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 93,
            "hpMult": 5.81,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 3763,
            "hpMult": 156.79,
            "speed": 94,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 180,
            "bountyMult": 30,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "13": {
    "mapId": "L13",
    "startHp": 10,
    "startGold": 145,
    "totalWaves": 8,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 10,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 363,
            "hpMult": 3.63,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 16,
            "hp": 13,
            "hpMult": 0.81,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 216,
            "hpMult": 2.16,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 13,
            "bountyMult": 1.08,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 11,
            "hp": 60,
            "hpMult": 2.5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 5,
            "bountyMult": 0.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 10,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 239,
            "hpMult": 2.39,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 17,
            "bountyMult": 1.42,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 18,
            "hp": 26,
            "hpMult": 1.63,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 3,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 244,
            "hpMult": 6.1,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 8,
            "bountyMult": 1.14,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 536,
            "hpMult": 5.36,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 16,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 10,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "grunt",
            "count": 11,
            "hp": 224,
            "hpMult": 5.6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 9,
            "bountyMult": 1.29,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 572,
            "hpMult": 5.72,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 19,
            "bountyMult": 1.58,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "grunt",
            "count": 11,
            "hp": 361,
            "hpMult": 9.03,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 912,
            "hpMult": 9.12,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 23,
            "bountyMult": 1.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 865,
            "hpMult": 8.65,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 6638,
            "hpMult": 66.38,
            "speed": 32,
            "speedMult": 0.84,
            "interval": 1.2,
            "bounty": 175,
            "bountyMult": 14.58,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "14": {
    "mapId": "L14",
    "startHp": 10,
    "startGold": 155,
    "totalWaves": 8,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 121,
            "hpMult": 3.03,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 10,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 56,
            "hpMult": 1.4,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 5,
            "bountyMult": 0.71,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 159,
            "hpMult": 1.59,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 11,
            "bountyMult": 0.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "scout",
            "count": 24,
            "hp": 44,
            "hpMult": 1.83,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 5,
            "bountyMult": 0.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 225,
            "hpMult": 2.25,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 15,
            "bountyMult": 1.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 11,
            "hp": 127,
            "hpMult": 3.18,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 6,
            "bountyMult": 0.86,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "scout",
            "count": 26,
            "hp": 84,
            "hpMult": 3.5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 10,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "grunt",
            "count": 11,
            "hp": 225,
            "hpMult": 5.63,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 9,
            "bountyMult": 1.29,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 539,
            "hpMult": 5.39,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 23,
            "bountyMult": 1.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 771,
            "hpMult": 7.71,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 23,
            "bountyMult": 1.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 11,
            "hp": 308,
            "hpMult": 7.7,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 12,
            "bountyMult": 1.71,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 386,
            "hpMult": 9.65,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 12,
            "bountyMult": 1.71,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 6970,
            "hpMult": 174.25,
            "speed": 47,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 206,
            "bountyMult": 29.43,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "15": {
    "mapId": "L15",
    "startHp": 10,
    "startGold": 170,
    "totalWaves": 8,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "swarm",
            "count": 16,
            "hp": 48,
            "hpMult": 3,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "scout",
            "count": 13,
            "hp": 70,
            "hpMult": 2.92,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "swarm",
            "count": 18,
            "hp": 90,
            "hpMult": 5.63,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 140,
            "hpMult": 5.83,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 13,
            "bountyMult": 2.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "swarm",
            "count": 22,
            "hp": 150,
            "hpMult": 9.38,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 10,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "scout",
            "count": 15,
            "hp": 229,
            "hpMult": 9.54,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 18,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 195,
            "hpMult": 12.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 13,
            "bountyMult": 4.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 7,
        "earlyBonus": 30,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 152,
            "hpMult": 9.5,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 6569,
            "hpMult": 273.71,
            "speed": 94,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 198,
            "bountyMult": 33,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "16": {
    "mapId": "L16",
    "startHp": 10,
    "startGold": 185,
    "totalWaves": 9,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 14,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "swarm",
            "count": 16,
            "hp": 23,
            "hpMult": 1.44,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 20,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "grunt",
            "count": 11,
            "hp": 104,
            "hpMult": 2.6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 5,
            "bountyMult": 0.71,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 225,
            "hpMult": 2.25,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 13,
            "bountyMult": 1.08,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "scout",
            "count": 13,
            "hp": 135,
            "hpMult": 5.63,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 11,
            "bountyMult": 1.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 14,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 192,
            "hpMult": 4.8,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 8,
            "bountyMult": 1.14,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 489,
            "hpMult": 4.89,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 15,
            "bountyMult": 1.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "swarm",
            "count": 22,
            "hp": 153,
            "hpMult": 9.56,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 11,
            "bountyMult": 3.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 20,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 505,
            "hpMult": 5.05,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 23,
            "bountyMult": 1.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 12,
            "hp": 326,
            "hpMult": 8.15,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 14,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 383,
            "hpMult": 15.96,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 25,
            "bountyMult": 4.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 1069,
            "hpMult": 10.69,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 26,
            "bountyMult": 2.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 13,
            "hp": 505,
            "hpMult": 12.63,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 16,
            "bountyMult": 2.29,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 35,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 217,
            "hpMult": 13.56,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 16280,
            "hpMult": 162.8,
            "speed": 32,
            "speedMult": 0.84,
            "interval": 1.2,
            "bounty": 293,
            "bountyMult": 24.42,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "17": {
    "mapId": "L17",
    "startHp": 10,
    "startGold": 200,
    "totalWaves": 9,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 24,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "swarm",
            "count": 16,
            "hp": 12,
            "hpMult": 0.75,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 14,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 44,
            "hpMult": 1.83,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 5,
            "bountyMult": 0.83,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 18,
            "hp": 13,
            "hpMult": 0.81,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 3,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "scout",
            "count": 13,
            "hp": 88,
            "hpMult": 3.67,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 20,
            "hp": 53,
            "hpMult": 3.31,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 4,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 20,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 188,
            "hpMult": 4.7,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 9,
            "bountyMult": 1.29,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 361,
            "hpMult": 3.61,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 17,
            "bountyMult": 1.42,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 178,
            "hpMult": 7.42,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 11,
            "bountyMult": 1.83,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 22,
            "hp": 80,
            "hpMult": 5,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 147,
            "hpMult": 6.13,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 24,
            "hp": 67,
            "hpMult": 4.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 20,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "grunt",
            "count": 13,
            "hp": 546,
            "hpMult": 13.65,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 13,
            "bountyMult": 1.86,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 7,
            "hp": 899,
            "hpMult": 8.99,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 31,
            "bountyMult": 2.58,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "grunt",
            "count": 14,
            "hp": 536,
            "hpMult": 13.4,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 15,
            "bountyMult": 2.14,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 8,
            "hp": 864,
            "hpMult": 8.64,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 31,
            "bountyMult": 2.58,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 40,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 362,
            "hpMult": 15.08,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 26,
            "hp": 234,
            "hpMult": 14.63,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 15066,
            "hpMult": 376.65,
            "speed": 47,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 250,
            "bountyMult": 35.71,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "18": {
    "mapId": "L18",
    "startHp": 10,
    "startGold": 110,
    "totalWaves": 9,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 14,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "swarm",
            "count": 16,
            "hp": 16,
            "hpMult": 1,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 3,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 14,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 46,
            "hpMult": 1.15,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 148,
            "hpMult": 1.48,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 54,
            "hpMult": 2.25,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 7,
            "bountyMult": 1.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 20,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "grunt",
            "count": 13,
            "hp": 47,
            "hpMult": 1.18,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 179,
            "hpMult": 1.79,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "swarm",
            "count": 22,
            "hp": 16,
            "hpMult": 1,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 20,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 141,
            "hpMult": 1.41,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 14,
            "hp": 78,
            "hpMult": 1.95,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 14,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 84,
            "hpMult": 3.5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 6,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "swarm",
            "count": 26,
            "hp": 58,
            "hpMult": 3.63,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 15,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 364,
            "hpMult": 3.64,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 15,
            "bountyMult": 1.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 1840,
            "hpMult": 76.67,
            "speed": 94,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 180,
            "bountyMult": 30,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "19": {
    "mapId": "L19",
    "startHp": 10,
    "startGold": 230,
    "totalWaves": 10,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 2742,
            "hpMult": 27.42,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 110,
            "bountyMult": 9.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 2,
            "hp": 1626,
            "hpMult": 16.26,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 73,
            "bountyMult": 6.08,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 2301,
            "hpMult": 23.01,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 62,
            "bountyMult": 5.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1700,
            "hpMult": 17,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 59,
            "bountyMult": 4.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 2504,
            "hpMult": 25.04,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 59,
            "bountyMult": 4.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 2307,
            "hpMult": 23.07,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 61,
            "bountyMult": 5.08,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 3216,
            "hpMult": 32.16,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 64,
            "bountyMult": 5.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 2542,
            "hpMult": 25.42,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 66,
            "bountyMult": 5.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 20,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 9,
            "hp": 3629,
            "hpMult": 36.29,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 69,
            "bountyMult": 5.75,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 45,
        "spawns": [
          {
            "type": "tank",
            "count": 10,
            "hp": 1990,
            "hpMult": 19.9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 29844,
            "hpMult": 298.44,
            "speed": 32,
            "speedMult": 0.84,
            "interval": 1.2,
            "bounty": 370,
            "bountyMult": 30.83,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "20": {
    "mapId": "L20",
    "startHp": 10,
    "startGold": 250,
    "totalWaves": 10,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 24,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 18,
            "hp": 65,
            "hpMult": 4.06,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 2,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 72,
            "hpMult": 0.72,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 13,
            "bountyMult": 1.08,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 62,
            "hpMult": 3.88,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 3,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 13,
            "hp": 24,
            "hpMult": 0.6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 7,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 20,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 94,
            "hpMult": 5.88,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 4,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 7,
            "hp": 169,
            "hpMult": 1.69,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 17,
            "bountyMult": 1.42,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 22,
            "hp": 83,
            "hpMult": 5.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 4,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 14,
            "hp": 56,
            "hpMult": 1.4,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 12,
            "bountyMult": 1.71,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 22,
            "hp": 115,
            "hpMult": 7.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 4,
            "bountyMult": 1.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 7,
            "hp": 296,
            "hpMult": 2.96,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 17,
            "bountyMult": 1.42,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 116,
            "hpMult": 7.25,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 14,
            "hp": 110,
            "hpMult": 2.75,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 7,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 20,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 139,
            "hpMult": 8.69,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 8,
            "hp": 476,
            "hpMult": 4.76,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 22,
            "bountyMult": 1.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 26,
            "hp": 148,
            "hpMult": 9.25,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 15,
            "hp": 257,
            "hpMult": 6.43,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 14,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 20,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 26,
            "hp": 202,
            "hpMult": 12.63,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 9,
            "hp": 583,
            "hpMult": 5.83,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 24,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 18,
            "hp": 300,
            "hpMult": 12.5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 28,
            "hp": 300,
            "hpMult": 18.75,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 9,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "hive_empress",
            "count": 1,
            "hp": 29840,
            "hpMult": 13.56,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.2,
            "bounty": 400,
            "bountyMult": 6.67,
            "isBoss": true,
            "isMiniBoss": false
          }
        ]
      }
    ]
  },
  "21": {
    "mapId": "L21",
    "startHp": 10,
    "startGold": 160,
    "totalWaves": 9,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 227,
            "hpMult": 5.68,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.66,
            "bounty": 14,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 7,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "blinker",
            "count": 2,
            "hp": 371,
            "hpMult": 5.71,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 50,
            "bountyMult": 6.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 14,
            "hp": 19,
            "hpMult": 1.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 2,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "grunt",
            "count": 9,
            "hp": 309,
            "hpMult": 7.73,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.66,
            "bounty": 16,
            "bountyMult": 2.29,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 10,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 10,
            "hp": 197,
            "hpMult": 8.21,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 17,
            "bountyMult": 2.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "blinker",
            "count": 2,
            "hp": 989,
            "hpMult": 15.22,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 70,
            "bountyMult": 8.75,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 9,
            "hp": 134,
            "hpMult": 3.35,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.66,
            "bounty": 7,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 12,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "blinker",
            "count": 2,
            "hp": 1276,
            "hpMult": 19.63,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 72,
            "bountyMult": 9,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 11,
            "hp": 197,
            "hpMult": 8.21,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 8,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 16,
            "hp": 200,
            "hpMult": 12.5,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 9,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 3,
            "hp": 1070,
            "hpMult": 16.46,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 49,
            "bountyMult": 6.13,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 11,
            "hp": 568,
            "hpMult": 23.67,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 22,
            "bountyMult": 3.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 16,
            "hp": 176,
            "hpMult": 11,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 7,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 7,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 1606,
            "hpMult": 24.71,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 60,
            "bountyMult": 7.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 10707,
            "hpMult": 164.72,
            "speed": 53,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 240,
            "bountyMult": 30,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "22": {
    "mapId": "L22",
    "startHp": 10,
    "startGold": 170,
    "totalWaves": 9,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 10,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 11,
            "hp": 134,
            "hpMult": 5.58,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 9,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 15,
            "hp": 78,
            "hpMult": 4.88,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 9,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 659,
            "hpMult": 10.14,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 52,
            "bountyMult": 6.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 7,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 11,
            "hp": 185,
            "hpMult": 7.71,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 15,
            "hp": 87,
            "hpMult": 5.44,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 12,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 268,
            "hpMult": 11.17,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 13,
            "bountyMult": 2.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 2,
            "hp": 741,
            "hpMult": 11.4,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 32,
            "bountyMult": 4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 11,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 18,
            "hp": 176,
            "hpMult": 11,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 259,
            "hpMult": 10.79,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 13,
            "hp": 403,
            "hpMult": 16.79,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 15,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 3,
            "hp": 1154,
            "hpMult": 17.75,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 42,
            "bountyMult": 5.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 8,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 309,
            "hpMult": 19.31,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 14,
            "bountyMult": 4.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 3,
            "hp": 989,
            "hpMult": 15.22,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 35,
            "bountyMult": 4.38,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 7,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 395,
            "hpMult": 16.46,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 15,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 9885,
            "hpMult": 411.88,
            "speed": 94,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 255,
            "bountyMult": 42.5,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "23": {
    "mapId": "L23",
    "startHp": 10,
    "startGold": 185,
    "totalWaves": 10,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 948,
            "hpMult": 9.48,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 30,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 330,
            "hpMult": 8.25,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 14,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 700,
            "hpMult": 7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 23,
            "bountyMult": 1.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 176,
            "hpMult": 4.4,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 6,
            "bountyMult": 0.86,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 989,
            "hpMult": 15.22,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 65,
            "bountyMult": 8.13,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 905,
            "hpMult": 9.05,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 25,
            "bountyMult": 2.08,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 2,
            "hp": 824,
            "hpMult": 12.68,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 42,
            "bountyMult": 5.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 1070,
            "hpMult": 10.7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 28,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 433,
            "hpMult": 10.83,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 1339,
            "hpMult": 20.6,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 55,
            "bountyMult": 6.88,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 1400,
            "hpMult": 14,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 28,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 1750,
            "hpMult": 17.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 38,
            "bountyMult": 3.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 3,
            "hp": 1195,
            "hpMult": 18.38,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 44,
            "bountyMult": 5.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 10,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "grunt",
            "count": 11,
            "hp": 814,
            "hpMult": 20.35,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 18,
            "bountyMult": 2.57,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 8,
            "hp": 2369,
            "hpMult": 23.69,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 7,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 2883,
            "hpMult": 28.83,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 23681,
            "hpMult": 236.81,
            "speed": 32,
            "speedMult": 0.84,
            "interval": 1.2,
            "bounty": 290,
            "bountyMult": 24.17,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "24": {
    "mapId": "L24",
    "startHp": 10,
    "startGold": 200,
    "totalWaves": 10,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 14,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "grunt",
            "count": 11,
            "hp": 330,
            "hpMult": 8.25,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 16,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 905,
            "hpMult": 9.05,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 29,
            "bountyMult": 2.42,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 8,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "blinker",
            "count": 2,
            "hp": 1133,
            "hpMult": 17.43,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 60,
            "bountyMult": 7.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 16,
            "hp": 46,
            "hpMult": 2.88,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 3,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 16,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 989,
            "hpMult": 9.89,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 22,
            "bountyMult": 1.83,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 11,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 7,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 11,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "scout",
            "count": 13,
            "hp": 350,
            "hpMult": 14.58,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 19,
            "bountyMult": 3.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 1276,
            "hpMult": 19.63,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 60,
            "bountyMult": 7.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 13,
            "hp": 259,
            "hpMult": 10.79,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 16,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 1689,
            "hpMult": 16.89,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 2,
            "hp": 1195,
            "hpMult": 18.38,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 57,
            "bountyMult": 7.13,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 9,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "swarm",
            "count": 22,
            "hp": 259,
            "hpMult": 16.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 19,
            "bountyMult": 6.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 1833,
            "hpMult": 28.2,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 95,
            "bountyMult": 11.88,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 12,
            "hp": 905,
            "hpMult": 22.63,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 19,
            "bountyMult": 2.71,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 7,
        "earlyBonus": 55,
        "spawns": [
          {
            "type": "grunt",
            "count": 14,
            "hp": 1154,
            "hpMult": 28.85,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 22,
            "bountyMult": 3.14,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 27799,
            "hpMult": 694.98,
            "speed": 47,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 302,
            "bountyMult": 43.14,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "25": {
    "mapId": "L25",
    "startHp": 10,
    "startGold": 215,
    "totalWaves": 10,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 13,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 330,
            "hpMult": 8.25,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 14,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 944,
            "hpMult": 14.52,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 52,
            "bountyMult": 6.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 246,
            "hpMult": 10.25,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 13,
            "bountyMult": 2.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 8,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 227,
            "hpMult": 14.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 11,
            "bountyMult": 3.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 16,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "tank",
            "count": 9,
            "hp": 1689,
            "hpMult": 16.89,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 30,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 1606,
            "hpMult": 24.71,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 65,
            "bountyMult": 8.13,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 13,
            "hp": 433,
            "hpMult": 10.83,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 12,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "scout",
            "count": 15,
            "hp": 494,
            "hpMult": 20.58,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 16,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 22,
            "hp": 227,
            "hpMult": 14.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 7,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 16,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "tank",
            "count": 9,
            "hp": 2368,
            "hpMult": 23.68,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 36,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1400,
            "hpMult": 21.54,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 35,
            "bountyMult": 4.38,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 13,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 2430,
            "hpMult": 37.38,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 70,
            "bountyMult": 8.75,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 24,
            "hp": 453,
            "hpMult": 28.31,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 11,
            "bountyMult": 3.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 7,
        "earlyBonus": 60,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 2163,
            "hpMult": 33.28,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 75,
            "bountyMult": 9.38,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 24710,
            "hpMult": 380.15,
            "speed": 53,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 360,
            "bountyMult": 45,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "26": {
    "mapId": "L26",
    "startHp": 10,
    "startGold": 235,
    "totalWaves": 11,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 9,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "swarm",
            "count": 18,
            "hp": 81,
            "hpMult": 5.06,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 7,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 11,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "scout",
            "count": 15,
            "hp": 156,
            "hpMult": 6.5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 11,
            "bountyMult": 1.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "swarm",
            "count": 22,
            "hp": 134,
            "hpMult": 8.38,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 144,
            "hpMult": 6,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 6,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 10,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 185,
            "hpMult": 11.56,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 10,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 12,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 278,
            "hpMult": 11.58,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 11,
            "bountyMult": 1.83,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 22,
            "hp": 144,
            "hpMult": 9,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 5,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 13,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 989,
            "hpMult": 15.22,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 50,
            "bountyMult": 6.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 24,
            "hp": 197,
            "hpMult": 12.31,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 11,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "scout",
            "count": 18,
            "hp": 433,
            "hpMult": 18.04,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 23,
            "bountyMult": 3.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 12,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "swarm",
            "count": 26,
            "hp": 288,
            "hpMult": 18,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 11,
            "bountyMult": 3.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 309,
            "hpMult": 12.88,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 13,
            "bountyMult": 2.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 10,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 411,
            "hpMult": 25.69,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 20,
            "bountyMult": 6.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 11,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "scout",
            "count": 20,
            "hp": 576,
            "hpMult": 24,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 20,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 30,
            "hp": 371,
            "hpMult": 23.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 10,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 7,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 494,
            "hpMult": 30.88,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 15,
            "bountyMult": 5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 20181,
            "hpMult": 840.88,
            "speed": 94,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 375,
            "bountyMult": 62.5,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "27": {
    "mapId": "L27",
    "startHp": 10,
    "startGold": 255,
    "totalWaves": 11,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 10,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 227,
            "hpMult": 9.46,
            "speed": 55,
            "speedMult": 0.5,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 227,
            "hpMult": 9.46,
            "speed": 55,
            "speedMult": 0.5,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 227,
            "hpMult": 9.46,
            "speed": 55,
            "speedMult": 0.5,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 227,
            "hpMult": 9.46,
            "speed": 55,
            "speedMult": 0.5,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 227,
            "hpMult": 9.46,
            "speed": 55,
            "speedMult": 0.5,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 227,
            "hpMult": 9.46,
            "speed": 55,
            "speedMult": 0.5,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 227,
            "hpMult": 9.46,
            "speed": 55,
            "speedMult": 0.5,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 10,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 989,
            "hpMult": 9.89,
            "speed": 55,
            "speedMult": 1.45,
            "interval": 0.5,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 989,
            "hpMult": 9.89,
            "speed": 55,
            "speedMult": 1.45,
            "interval": 0.5,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 989,
            "hpMult": 9.89,
            "speed": 55,
            "speedMult": 1.45,
            "interval": 0.5,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 989,
            "hpMult": 9.89,
            "speed": 55,
            "speedMult": 1.45,
            "interval": 0.5,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 989,
            "hpMult": 9.89,
            "speed": 55,
            "speedMult": 1.45,
            "interval": 0.5,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 1,
            "hp": 371,
            "hpMult": 9.28,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 10,
            "bountyMult": 1.43,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 989,
            "hpMult": 9.89,
            "speed": 55,
            "speedMult": 1.45,
            "interval": 0.5,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 10,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 1,
            "hp": 103,
            "hpMult": 6.44,
            "speed": 62,
            "speedMult": 0.36,
            "interval": 0.45,
            "bounty": 6,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 601,
            "hpMult": 9.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 23,
            "bountyMult": 2.88,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 10,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "grunt",
            "count": 5,
            "hp": 453,
            "hpMult": 11.33,
            "speed": 65,
            "speedMult": 1.18,
            "interval": 0.45,
            "bounty": 12,
            "bountyMult": 1.71,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 5,
            "hp": 309,
            "hpMult": 12.88,
            "speed": 65,
            "speedMult": 0.59,
            "interval": 0.45,
            "bounty": 15,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 1750,
            "hpMult": 17.5,
            "speed": 65,
            "speedMult": 1.71,
            "interval": 0.45,
            "bounty": 23,
            "bountyMult": 1.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "blinker",
            "count": 10,
            "hp": 948,
            "hpMult": 14.58,
            "speed": 68,
            "speedMult": 1.1,
            "interval": 0.45,
            "bounty": 20,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 5,
            "hp": 453,
            "hpMult": 11.33,
            "speed": 68,
            "speedMult": 1.24,
            "interval": 0.45,
            "bounty": 11,
            "bountyMult": 1.57,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 5,
            "hp": 268,
            "hpMult": 11.17,
            "speed": 68,
            "speedMult": 0.62,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "swarm",
            "count": 12,
            "hp": 246,
            "hpMult": 15.38,
            "speed": 72,
            "speedMult": 0.42,
            "interval": 0.4,
            "bounty": 9,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 6,
            "hp": 536,
            "hpMult": 22.33,
            "speed": 72,
            "speedMult": 0.65,
            "interval": 0.4,
            "bounty": 22,
            "bountyMult": 3.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 6,
            "hp": 2471,
            "hpMult": 24.71,
            "speed": 72,
            "speedMult": 1.89,
            "interval": 0.4,
            "bounty": 21,
            "bountyMult": 1.75,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 2574,
            "hpMult": 25.74,
            "speed": 65,
            "speedMult": 1.71,
            "interval": 0.45,
            "bounty": 30,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 8,
            "hp": 989,
            "hpMult": 15.22,
            "speed": 65,
            "speedMult": 1.05,
            "interval": 0.45,
            "bounty": 25,
            "bountyMult": 3.13,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "grunt",
            "count": 6,
            "hp": 659,
            "hpMult": 16.48,
            "speed": 76,
            "speedMult": 1.38,
            "interval": 0.4,
            "bounty": 18,
            "bountyMult": 2.57,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 6,
            "hp": 391,
            "hpMult": 16.29,
            "speed": 76,
            "speedMult": 0.69,
            "interval": 0.4,
            "bounty": 18,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 6,
            "hp": 288,
            "hpMult": 18,
            "speed": 76,
            "speedMult": 0.45,
            "interval": 0.4,
            "bounty": 12,
            "bountyMult": 4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 2780,
            "hpMult": 42.77,
            "speed": 76,
            "speedMult": 1.23,
            "interval": 0.4,
            "bounty": 40,
            "bountyMult": 5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 3398,
            "hpMult": 33.98,
            "speed": 78,
            "speedMult": 2.05,
            "interval": 0.4,
            "bounty": 40,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 6,
            "hp": 556,
            "hpMult": 23.17,
            "speed": 78,
            "speedMult": 0.71,
            "interval": 0.4,
            "bounty": 20,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 1956,
            "hpMult": 30.09,
            "speed": 78,
            "speedMult": 1.26,
            "interval": 0.4,
            "bounty": 35,
            "bountyMult": 4.38,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 6,
            "hp": 391,
            "hpMult": 24.44,
            "speed": 78,
            "speedMult": 0.46,
            "interval": 0.4,
            "bounty": 10,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 4324,
            "hpMult": 43.24,
            "speed": 82,
            "speedMult": 2.16,
            "interval": 0.38,
            "bounty": 50,
            "bountyMult": 4.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 5,
            "hp": 2163,
            "hpMult": 33.28,
            "speed": 82,
            "speedMult": 1.32,
            "interval": 0.38,
            "bounty": 40,
            "bountyMult": 5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 5,
            "hp": 865,
            "hpMult": 21.63,
            "speed": 82,
            "speedMult": 1.49,
            "interval": 0.38,
            "bounty": 25,
            "bountyMult": 3.57,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 5,
            "hp": 618,
            "hpMult": 25.75,
            "speed": 82,
            "speedMult": 0.75,
            "interval": 0.38,
            "bounty": 20,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 5,
            "hp": 494,
            "hpMult": 30.88,
            "speed": 82,
            "speedMult": 0.48,
            "interval": 0.38,
            "bounty": 14,
            "bountyMult": 4.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 7,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 1750,
            "hpMult": 17.5,
            "speed": 85,
            "speedMult": 2.24,
            "interval": 0.35,
            "bounty": 30,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 865,
            "hpMult": 13.31,
            "speed": 85,
            "speedMult": 1.37,
            "interval": 0.35,
            "bounty": 25,
            "bountyMult": 3.13,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 6,
            "hp": 659,
            "hpMult": 27.46,
            "speed": 85,
            "speedMult": 0.77,
            "interval": 0.35,
            "bounty": 25,
            "bountyMult": 4.17,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 6,
            "hp": 700,
            "hpMult": 43.75,
            "speed": 85,
            "speedMult": 0.5,
            "interval": 0.35,
            "bounty": 15,
            "bountyMult": 5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "hive_empress",
            "count": 1,
            "hp": 30888,
            "hpMult": 14.04,
            "speed": 40,
            "speedMult": 1.05,
            "interval": 1.2,
            "bounty": 260,
            "bountyMult": 4.33,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "28": {
    "mapId": "L28",
    "startHp": 10,
    "startGold": 135,
    "totalWaves": 11,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 18,
            "hp": 73,
            "hpMult": 4.56,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 2,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "grunt",
            "count": 14,
            "hp": 176,
            "hpMult": 4.4,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 2,
            "hp": 453,
            "hpMult": 6.97,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 165,
            "hpMult": 6.88,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 14,
            "bountyMult": 2.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 16,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 659,
            "hpMult": 6.59,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 3,
            "hp": 576,
            "hpMult": 8.86,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 197,
            "hpMult": 12.31,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 14,
            "bountyMult": 4.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 783,
            "hpMult": 12.05,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 15,
            "hp": 185,
            "hpMult": 7.71,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 16,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "grunt",
            "count": 16,
            "hp": 391,
            "hpMult": 9.78,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 15,
            "bountyMult": 2.14,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 8,
            "hp": 1194,
            "hpMult": 11.94,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 30,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "swarm",
            "count": 28,
            "hp": 288,
            "hpMult": 18,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 20,
            "bountyMult": 6.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 1400,
            "hpMult": 21.54,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 15,
            "hp": 494,
            "hpMult": 12.35,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "scout",
            "count": 20,
            "hp": 700,
            "hpMult": 29.17,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 40,
            "bountyMult": 6.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 7,
        "earlyBonus": 25,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 2574,
            "hpMult": 39.6,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 75,
            "bountyMult": 9.38,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 1,
            "hp": 32947,
            "hpMult": 506.88,
            "speed": 53,
            "speedMult": 0.85,
            "interval": 1.2,
            "bounty": 560,
            "bountyMult": 70,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "29": {
    "mapId": "L29",
    "startHp": 10,
    "startGold": 295,
    "totalWaves": 12,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 12,
            "hp": 869,
            "hpMult": 8.69,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 13,
            "bountyMult": 1.08,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 11,
            "hp": 1273,
            "hpMult": 12.73,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 17,
            "bountyMult": 1.42,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 10,
            "hp": 1792,
            "hpMult": 17.92,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 23,
            "bountyMult": 1.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 9,
            "hp": 2517,
            "hpMult": 25.17,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 31,
            "bountyMult": 2.58,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 3474,
            "hpMult": 34.74,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 43,
            "bountyMult": 3.58,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 3265,
            "hpMult": 32.65,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 39,
            "bountyMult": 3.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1483,
            "hpMult": 22.82,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 35,
            "bountyMult": 4.38,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 6727,
            "hpMult": 67.27,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 82,
            "bountyMult": 6.83,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 6424,
            "hpMult": 64.24,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 72,
            "bountyMult": 6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 2163,
            "hpMult": 33.28,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 55,
            "bountyMult": 6.88,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 13901,
            "hpMult": 139.01,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 171,
            "bountyMult": 14.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 21630,
            "hpMult": 216.3,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 267,
            "bountyMult": 22.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 20,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 2,
            "hp": 26054,
            "hpMult": 260.54,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 303,
            "bountyMult": 25.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 5,
            "hp": 2780,
            "hpMult": 42.77,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 63,
            "bountyMult": 7.88,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 14,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 40776,
            "hpMult": 407.76,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 540,
            "bountyMult": 45,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 1,
            "hp": 70013,
            "hpMult": 700.13,
            "speed": 32,
            "speedMult": 0.84,
            "interval": 1.2,
            "bounty": 520,
            "bountyMult": 43.33,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "30": {
    "mapId": "L30",
    "startHp": 10,
    "startGold": 320,
    "totalWaves": 12,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 7,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 652,
            "hpMult": 10.03,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 27,
            "bountyMult": 3.38,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 24,
            "hp": 39,
            "hpMult": 2.44,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 2,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 13,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 824,
            "hpMult": 12.68,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 30,
            "bountyMult": 3.75,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 14,
            "hp": 146,
            "hpMult": 3.65,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 5,
            "bountyMult": 0.71,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 16,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 9,
            "hp": 1115,
            "hpMult": 11.15,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 20,
            "bountyMult": 1.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 652,
            "hpMult": 10.03,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 19,
            "bountyMult": 2.38,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 14,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 1459,
            "hpMult": 22.45,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 43,
            "bountyMult": 5.38,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 172,
            "hpMult": 7.17,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 6,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 8,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 309,
            "hpMult": 19.31,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 8,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 926,
            "hpMult": 14.25,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 23,
            "bountyMult": 2.88,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 16,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 1802,
            "hpMult": 27.72,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 45,
            "bountyMult": 5.63,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 10,
            "hp": 1269,
            "hpMult": 12.69,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 18,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 14,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "scout",
            "count": 18,
            "hp": 824,
            "hpMult": 34.33,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 18,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 1527,
            "hpMult": 23.49,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 36,
            "bountyMult": 4.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 7,
            "hp": 2402,
            "hpMult": 36.95,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 55,
            "bountyMult": 6.88,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 18,
            "hp": 704,
            "hpMult": 17.6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 14,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 16,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 12,
            "hp": 2488,
            "hpMult": 24.88,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 32,
            "bountyMult": 2.67,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 7,
            "hp": 2488,
            "hpMult": 38.28,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 52,
            "bountyMult": 6.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 7,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 755,
            "hpMult": 47.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 12,
            "bountyMult": 4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 8,
            "hp": 2574,
            "hpMult": 39.6,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 65,
            "bountyMult": 8.13,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 16,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 8,
            "hp": 3089,
            "hpMult": 47.52,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 63,
            "bountyMult": 7.88,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 21,
            "hp": 1269,
            "hpMult": 52.88,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 24,
            "bountyMult": 4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 14,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 8,
            "hp": 1287,
            "hpMult": 19.8,
            "speed": 62,
            "speedMult": 1,
            "interval": 0.8,
            "bounty": 45,
            "bountyMult": 5.63,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 30,
            "hp": 275,
            "hpMult": 17.19,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.045,
            "clumps": 3,
            "bounty": 10,
            "bountyMult": 3.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "chronos_warp",
            "count": 1,
            "hp": 47520,
            "hpMult": 11.31,
            "speed": 40,
            "speedMult": 1,
            "interval": 1.2,
            "bounty": 500,
            "bountyMult": 5.88,
            "isBoss": true,
            "isMiniBoss": false
          }
        ]
      }
    ]
  },
  "31": {
    "mapId": "L31",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 10,
    "startGold": 190,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 180,
            "hpMult": 4.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 10,
            "bountyMult": 1.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 13,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 140,
            "hpMult": 3.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 8,
            "bountyMult": 1.1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 2,
            "hp": 1260,
            "hpMult": 3.16,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 38,
            "bountyMult": 1.9,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "scout",
            "count": 8,
            "hp": 110,
            "hpMult": 3.66,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 18,
            "hp": 70,
            "hpMult": 4.66,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.18,
            "bounty": 5,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 14,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 1820,
            "hpMult": 4.56,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.4,
            "bounty": 45,
            "bountyMult": 2.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 3,
            "hp": 780,
            "hpMult": 3.9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.8,
            "bounty": 26,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 13,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 240,
            "hpMult": 6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 11,
            "bountyMult": 1.6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 180,
            "hpMult": 6,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 10,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 110,
            "hpMult": 7.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 14,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 1820,
            "hpMult": 4.56,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 48,
            "bountyMult": 2.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 730,
            "hpMult": 7.3,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 26,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1000,
            "hpMult": 5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 28,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 220,
            "hpMult": 7.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2100,
            "hpMult": 5.26,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 52,
            "bountyMult": 2.6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 340,
            "hpMult": 8.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 13,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "grunt",
            "count": 1,
            "hp": 9000,
            "hpMult": 225,
            "speed": 45,
            "speedMult": 0.82,
            "interval": 1,
            "bounty": 320,
            "bountyMult": 16,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "32": {
    "mapId": "L32",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 10,
    "startGold": 200,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 11,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "scout",
            "count": 8,
            "hp": 150,
            "hpMult": 5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 13,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 900,
            "hpMult": 4.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.8,
            "bounty": 26,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 170,
            "hpMult": 4.26,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 9,
            "bountyMult": 1.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 12,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 1680,
            "hpMult": 4.2,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 42,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 140,
            "hpMult": 4.66,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 10,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 100,
            "hpMult": 6.66,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 5,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 13,
        "earlyBonus": 65,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 980,
            "hpMult": 9.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 250,
            "hpMult": 6.26,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 11,
            "bountyMult": 1.6,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 1960,
            "hpMult": 4.9,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 46,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 4,
            "hp": 1060,
            "hpMult": 5.3,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 28,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "scout",
            "count": 18,
            "hp": 270,
            "hpMult": 9,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 13,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2240,
            "hpMult": 5.6,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 50,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 24,
            "hp": 140,
            "hpMult": 9.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 1240,
            "hpMult": 6.2,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 5,
            "hp": 1000,
            "hpMult": 10,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 2520,
            "hpMult": 6.3,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 60,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 1,
            "hp": 6200,
            "hpMult": 206.6,
            "speed": 105,
            "speedMult": 0.95,
            "interval": 1,
            "bounty": 260,
            "bountyMult": 43.3,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "33": {
    "mapId": "L33",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 11,
    "startGold": 210,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 170,
            "hpMult": 4.26,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.62,
            "bounty": 9,
            "bountyMult": 1.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 11,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 84,
            "hpMult": 5.6,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.18,
            "bounty": 5,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 3,
            "hp": 780,
            "hpMult": 7.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 28,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 860,
            "hpMult": 4.3,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 26,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 170,
            "hpMult": 5.66,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 14,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 2100,
            "hpMult": 5.26,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 50,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 220,
            "hpMult": 5.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.58,
            "bounty": 10,
            "bountyMult": 1.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 12,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 730,
            "hpMult": 7.3,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 26,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 150,
            "hpMult": 5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 9,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 13,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2100,
            "hpMult": 5.26,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 48,
            "bountyMult": 2.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 24,
            "hp": 154,
            "hpMult": 10.26,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 15,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 1280,
            "hpMult": 6.4,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 5,
            "hp": 1060,
            "hpMult": 10.6,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 11,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "scout",
            "count": 20,
            "hp": 320,
            "hpMult": 10.66,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2520,
            "hpMult": 6.3,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 55,
            "bountyMult": 2.75,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 4,
            "hp": 1340,
            "hpMult": 6.7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 12,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 170,
            "hpMult": 11.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 1120,
            "hpMult": 11.2,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.2,
            "bounty": 34,
            "bountyMult": 2.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 11800,
            "hpMult": 59,
            "speed": 35,
            "speedMult": 0.92,
            "interval": 1,
            "bounty": 420,
            "bountyMult": 28,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "34": {
    "mapId": "L34",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 11,
    "startGold": 220,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 14,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 670,
            "hpMult": 3.36,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.8,
            "bounty": 24,
            "bountyMult": 1.6,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "scout",
            "count": 8,
            "hp": 180,
            "hpMult": 6,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 210,
            "hpMult": 5.26,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 10,
            "bountyMult": 1.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 1960,
            "hpMult": 4.9,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 46,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 12,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "blinker",
            "count": 3,
            "hp": 900,
            "hpMult": 9,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 28,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 20,
            "hp": 110,
            "hpMult": 7.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.18,
            "bounty": 5,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 15,
        "earlyBonus": 70,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1180,
            "hpMult": 5.9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 28,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 2,
            "hp": 2380,
            "hpMult": 5.96,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 55,
            "bountyMult": 2.75,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 13,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "scout",
            "count": 15,
            "hp": 310,
            "hpMult": 10.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1000,
            "hpMult": 10,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 15,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2660,
            "hpMult": 6.66,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 56,
            "bountyMult": 2.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 12,
            "hp": 390,
            "hpMult": 9.76,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 12,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 10,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "swarm",
            "count": 36,
            "hp": 170,
            "hpMult": 11.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 1460,
            "hpMult": 7.3,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 340,
            "hpMult": 11.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 15,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3080,
            "hpMult": 7.7,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 60,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 5,
            "hp": 1240,
            "hpMult": 12.4,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "swarm",
            "count": 1,
            "hp": 5376,
            "hpMult": 358.428,
            "speed": 150,
            "speedMult": 0.88,
            "interval": 1,
            "bounty": 450,
            "bountyMult": 30,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "35": {
    "mapId": "L35",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 11,
    "startGold": 230,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 13,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 620,
            "hpMult": 6.2,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 26,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 110,
            "hpMult": 2.75,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 10,
            "bountyMult": 1.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 100,
            "hpMult": 3.33,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 15,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2100,
            "hpMult": 5.26,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 48,
            "bountyMult": 2.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 4,
            "hp": 1000,
            "hpMult": 5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 28,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 11,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "swarm",
            "count": 28,
            "hp": 126,
            "hpMult": 8.4,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 980,
            "hpMult": 9.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 2,
            "hp": 2660,
            "hpMult": 6.66,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 56,
            "bountyMult": 2.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 12,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "scout",
            "count": 18,
            "hp": 340,
            "hpMult": 11.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 14,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 1500,
            "hpMult": 7.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 26,
            "hp": 180,
            "hpMult": 12,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 15,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3220,
            "hpMult": 8.06,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 62,
            "bountyMult": 3.1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 14,
            "hp": 450,
            "hpMult": 11.26,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.52,
            "bounty": 13,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 13,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 1340,
            "hpMult": 13.4,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 36,
            "bountyMult": 2.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 14,
            "hp": 360,
            "hpMult": 12,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 16,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 3080,
            "hpMult": 7.7,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 65,
            "bountyMult": 3.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 1400,
            "hpMult": 7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 34,
            "bountyMult": 2.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "goliath",
            "count": 1,
            "hp": 18760,
            "hpMult": 46.9,
            "speed": 30,
            "speedMult": 0.75,
            "interval": 1,
            "bounty": 480,
            "bountyMult": 24,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "36": {
    "mapId": "L36",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 12,
    "startGold": 240,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 10,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 80,
            "hpMult": 5.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.18,
            "bounty": 5,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 11,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 220,
            "hpMult": 7.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "swarm",
            "count": 24,
            "hp": 90,
            "hpMult": 6,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 5,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 180,
            "hpMult": 6,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 11,
        "earlyBonus": 75,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 230,
            "hpMult": 7.66,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 10,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 30,
            "hp": 90,
            "hpMult": 6,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 5,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 11,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "scout",
            "count": 22,
            "hp": 220,
            "hpMult": 7.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 10,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "swarm",
            "count": 45,
            "hp": 130,
            "hpMult": 8.66,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 12,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "scout",
            "count": 24,
            "hp": 300,
            "hpMult": 10,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 20,
            "hp": 140,
            "hpMult": 9.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.18,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 12,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "swarm",
            "count": 40,
            "hp": 170,
            "hpMult": 11.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 18,
            "hp": 310,
            "hpMult": 10.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 12,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "scout",
            "count": 30,
            "hp": 330,
            "hpMult": 11,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.32,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 10,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "swarm",
            "count": 60,
            "hp": 170,
            "hpMult": 11.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.13,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 13,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "swarm",
            "count": 50,
            "hp": 190,
            "hpMult": 12.66,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 7,
            "bountyMult": 3.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 320,
            "hpMult": 10.66,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "blinker",
            "count": 1,
            "hp": 15200,
            "hpMult": 152,
            "speed": 60,
            "speedMult": 0.92,
            "interval": 1,
            "bounty": 520,
            "bountyMult": 34.7,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "37": {
    "mapId": "L37",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 12,
    "startGold": 250,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 13,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 300,
            "hpMult": 7.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 11,
            "bountyMult": 1.6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 250,
            "hpMult": 8.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 14,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 2240,
            "hpMult": 5.6,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 52,
            "bountyMult": 2.6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1060,
            "hpMult": 10.6,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1060,
            "hpMult": 5.3,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 28,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 240,
            "hpMult": 8,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 11,
            "bountyMult": 1.8,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 14,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 2660,
            "hpMult": 6.66,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 56,
            "bountyMult": 2.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 24,
            "hp": 154,
            "hpMult": 10.26,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "blinker",
            "count": 4,
            "hp": 1180,
            "hpMult": 11.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 390,
            "hpMult": 9.76,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.58,
            "bounty": 12,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2940,
            "hpMult": 7.36,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 60,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 1560,
            "hpMult": 7.8,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 34,
            "bountyMult": 2.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 12,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 390,
            "hpMult": 13,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 30,
            "hp": 210,
            "hpMult": 14,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 7,
            "bountyMult": 3.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3500,
            "hpMult": 8.76,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 65,
            "bountyMult": 3.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 1280,
            "hpMult": 12.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 35,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 1740,
            "hpMult": 8.7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 36,
            "bountyMult": 2.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 14,
            "hp": 500,
            "hpMult": 12.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.52,
            "bounty": 14,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 4060,
            "hpMult": 10.16,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 70,
            "bountyMult": 3.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 450,
            "hpMult": 15,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 13,
            "bountyMult": 2.2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 1460,
            "hpMult": 14.6,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 38,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 36,
            "hp": 240,
            "hpMult": 16,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 7,
            "bountyMult": 3.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "hive_empress",
            "count": 1,
            "hp": 19800,
            "hpMult": 9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1,
            "bounty": 600,
            "bountyMult": 10,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "38": {
    "mapId": "L38",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 12,
    "startGold": 165,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 11,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "swarm",
            "count": 20,
            "hp": 84,
            "hpMult": 5.6,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.18,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 240,
            "hpMult": 6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 12,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 310,
            "hpMult": 10.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 14,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 14,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 2520,
            "hpMult": 6.3,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 11,
        "earlyBonus": 80,
        "spawns": [
          {
            "type": "swarm",
            "count": 32,
            "hp": 126,
            "hpMult": 8.4,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 7,
            "bountyMult": 3.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 1460,
            "hpMult": 7.3,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 13,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 1180,
            "hpMult": 11.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 36,
            "bountyMult": 2.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 360,
            "hpMult": 12,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 15,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3360,
            "hpMult": 8.4,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 12,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "swarm",
            "count": 40,
            "hp": 200,
            "hpMult": 13.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 8,
            "bountyMult": 4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3500,
            "hpMult": 8.76,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 1540,
            "hpMult": 7.7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "blinker",
            "count": 8,
            "hp": 1260,
            "hpMult": 12.6,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 45,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "scout",
            "count": 1,
            "hp": 9720,
            "hpMult": 324,
            "speed": 110,
            "speedMult": 1,
            "interval": 1,
            "bounty": 600,
            "bountyMult": 100,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "39": {
    "mapId": "L39",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 13,
    "startGold": 270,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 500,
            "hpMult": 2.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1,
            "bounty": 45,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 2,
            "hp": 700,
            "hpMult": 3.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.8,
            "bounty": 35,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 15,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 1000,
            "hpMult": 5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.8,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 16,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1400,
            "hpMult": 7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.7,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 16,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 1800,
            "hpMult": 9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.7,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 16,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 2200,
            "hpMult": 11,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 32,
            "bountyMult": 2.1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 17,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 7,
            "hp": 2700,
            "hpMult": 6.76,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 1.8,
            "bounty": 38,
            "bountyMult": 1.9,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 17,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 2900,
            "hpMult": 14.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 35,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 17,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 9,
            "hp": 3300,
            "hpMult": 8.26,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 1.7,
            "bounty": 40,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 18,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 10,
            "hp": 3700,
            "hpMult": 18.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 38,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 18,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "goliath",
            "count": 11,
            "hp": 4200,
            "hpMult": 10.5,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 1.6,
            "bounty": 45,
            "bountyMult": 2.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 18,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "tank",
            "count": 12,
            "hp": 4700,
            "hpMult": 23.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 45,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 32000,
            "hpMult": 160,
            "speed": 35,
            "speedMult": 0.92,
            "interval": 1,
            "bounty": 750,
            "bountyMult": 50,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "40": {
    "mapId": "L40",
    "startHp": 10,
    "canUpgrade": true,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter"
    ],
    "totalWaves": 13,
    "startGold": 280,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 13,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 340,
            "hpMult": 8.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.65,
            "bounty": 12,
            "bountyMult": 1.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 270,
            "hpMult": 9,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 14,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1180,
            "hpMult": 5.9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1000,
            "hpMult": 10,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 30,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3080,
            "hpMult": 7.7,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 55,
            "bountyMult": 2.75,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 11,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 170,
            "hpMult": 11.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 85,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 3500,
            "hpMult": 8.76,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 60,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 320,
            "hpMult": 10.66,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 12,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 1240,
            "hpMult": 12.4,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 34,
            "bountyMult": 2.25,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 26,
            "hp": 210,
            "hpMult": 14,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.17,
            "bounty": 7,
            "bountyMult": 3.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 15,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 1820,
            "hpMult": 9.1,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 36,
            "bountyMult": 2.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 2,
            "hp": 4200,
            "hpMult": 10.5,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 65,
            "bountyMult": 3.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 12,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "scout",
            "count": 20,
            "hp": 460,
            "hpMult": 15.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 13,
            "bountyMult": 2.2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3920,
            "hpMult": 9.8,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 68,
            "bountyMult": 3.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 1460,
            "hpMult": 14.6,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 38,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 1900,
            "hpMult": 9.5,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 38,
            "bountyMult": 2.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 36,
            "hp": 270,
            "hpMult": 18,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 8,
            "bountyMult": 4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 16,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 4340,
            "hpMult": 10.86,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 72,
            "bountyMult": 3.6,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 14,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "blinker",
            "count": 7,
            "hp": 1540,
            "hpMult": 15.4,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 40,
            "bountyMult": 2.6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 490,
            "hpMult": 16.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 14,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 3920,
            "hpMult": 9.8,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 60,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1400,
            "hpMult": 14,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 35,
            "bountyMult": 2.3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "titan_core",
            "count": 1,
            "hp": 36400,
            "hpMult": 364,
            "speed": 40,
            "speedMult": 1,
            "interval": 1,
            "bounty": 1000,
            "bountyMult": 50,
            "isBoss": true,
            "isMiniBoss": false
          }
        ]
      }
    ]
  },
  "41": {
    "mapId": "L41",
    "startHp": 10,
    "startGold": 220,
    "totalWaves": 12,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 480,
            "hpMult": 12,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 420,
            "hpMult": 10.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 6,
            "hp": 480,
            "hpMult": 16,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1140,
            "hpMult": 5.7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 5,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 432,
            "hpMult": 10.8,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 11,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "scout",
            "count": 10,
            "hp": 504,
            "hpMult": 16.8,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 26,
            "hp": 204,
            "hpMult": 13.6,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 13,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "grunt",
            "count": 14,
            "hp": 942,
            "hpMult": 23.56,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 4,
            "bountyMult": 0.7,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 2520,
            "hpMult": 12.6,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 9,
            "bountyMult": 0.6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 720,
            "hpMult": 24,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 6912,
            "hpMult": 17.28,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 25,
            "bountyMult": 1.25,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 11,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "swarm",
            "count": 40,
            "hp": 636,
            "hpMult": 42.4,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 7080,
            "hpMult": 17.7,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 22,
            "bountyMult": 1.1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 4,
            "hp": 2460,
            "hpMult": 12.3,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 8,
            "bountyMult": 0.53,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 13,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 1620,
            "hpMult": 40.5,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 5,
            "bountyMult": 0.88,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 1488,
            "hpMult": 49.6,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 4,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 15,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 11040,
            "hpMult": 27.6,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 29,
            "bountyMult": 1.45,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "goliath",
            "count": 1,
            "hp": 33120,
            "hpMult": 82.8,
            "speed": 30,
            "speedMult": 0.75,
            "interval": 1,
            "bounty": 97,
            "bountyMult": 4.85,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "42": {
    "mapId": "L42",
    "startHp": 10,
    "startGold": 235,
    "totalWaves": 12,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 11,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "scout",
            "count": 10,
            "hp": 484,
            "hpMult": 16.14,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.45,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 352,
            "hpMult": 8.8,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.58,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 330,
            "hpMult": 11,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 1,
            "bountyMult": 0.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 3,
            "hp": 1980,
            "hpMult": 15.24,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 8,
            "bountyMult": 0.62,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 3,
            "hp": 1562,
            "hpMult": 7.81,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 11,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "swarm",
            "count": 32,
            "hp": 319,
            "hpMult": 21.26,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3300,
            "hpMult": 8.25,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 14,
            "bountyMult": 0.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 8,
            "hp": 429,
            "hpMult": 10.73,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.58,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 12,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "scout",
            "count": 18,
            "hp": 946,
            "hpMult": 31.54,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 4,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 13,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 2750,
            "hpMult": 13.75,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 12,
            "bountyMult": 0.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 28,
            "hp": 352,
            "hpMult": 23.46,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 3,
            "hp": 3520,
            "hpMult": 27.08,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 12,
            "bountyMult": 0.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 3,
            "hp": 6160,
            "hpMult": 15.4,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 22,
            "bountyMult": 1.1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 13,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 3652,
            "hpMult": 36.52,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 14,
            "bountyMult": 0.93,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 1210,
            "hpMult": 30.25,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.52,
            "bounty": 3,
            "bountyMult": 0.53,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 15,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 8140,
            "hpMult": 20.35,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 26,
            "bountyMult": 1.3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 2464,
            "hpMult": 12.32,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 12,
        "earlyBonus": 90,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 1815,
            "hpMult": 60.5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.36,
            "bounty": 6,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 36,
            "hp": 605,
            "hpMult": 40.34,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "scout",
            "count": 1,
            "hp": 32890,
            "hpMult": 109.64,
            "speed": 95,
            "speedMult": 0.86,
            "interval": 1,
            "bounty": 96,
            "bountyMult": 4.8,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "43": {
    "mapId": "L43",
    "startHp": 10,
    "startGold": 250,
    "totalWaves": 13,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 418,
            "hpMult": 10.45,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 1320,
            "hpMult": 13.2,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 6,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "scout",
            "count": 10,
            "hp": 418,
            "hpMult": 13.94,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 26,
            "hp": 165,
            "hpMult": 11,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1650,
            "hpMult": 8.25,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 6,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1128,
            "hpMult": 11.28,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 4,
            "bountyMult": 0.27,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 4840,
            "hpMult": 12.1,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 17,
            "bountyMult": 0.85,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 12,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 2310,
            "hpMult": 23.1,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 682,
            "hpMult": 22.74,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 11,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "swarm",
            "count": 42,
            "hp": 537,
            "hpMult": 35.78,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 15,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 5830,
            "hpMult": 14.58,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 19,
            "bountyMult": 0.95,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 1936,
            "hpMult": 9.68,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 6,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 4180,
            "hpMult": 41.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 14,
            "bountyMult": 0.93,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 30,
            "hp": 374,
            "hpMult": 24.94,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 4950,
            "hpMult": 24.75,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 14,
            "bountyMult": 0.93,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 1155,
            "hpMult": 38.5,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.36,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 15,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 8580,
            "hpMult": 21.45,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 23,
            "bountyMult": 1.15,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 5,
            "hp": 2376,
            "hpMult": 23.76,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 6,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 11,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "swarm",
            "count": 50,
            "hp": 1063,
            "hpMult": 70.84,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.13,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "blinker",
            "count": 1,
            "hp": 37950,
            "hpMult": 379.5,
            "speed": 55,
            "speedMult": 0.85,
            "interval": 1,
            "bounty": 98,
            "bountyMult": 6.53,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "44": {
    "mapId": "L44",
    "startHp": 10,
    "startGold": 265,
    "totalWaves": 13,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 386,
            "hpMult": 9.66,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.58,
            "bounty": 1,
            "bountyMult": 0.18,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 394,
            "hpMult": 13.11,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 1830,
            "hpMult": 9.15,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 6,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 2968,
            "hpMult": 22.83,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 9,
            "bountyMult": 0.69,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 12,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 315,
            "hpMult": 20.98,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 1502,
            "hpMult": 15.02,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 4,
            "bountyMult": 0.27,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 2932,
            "hpMult": 22.55,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 8,
            "bountyMult": 0.62,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 829,
            "hpMult": 20.74,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 8480,
            "hpMult": 21.21,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 22,
            "bountyMult": 1.1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 12,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "scout",
            "count": 20,
            "hp": 1566,
            "hpMult": 52.2,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 4,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 5434,
            "hpMult": 41.8,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 14,
            "bountyMult": 1.08,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 3232,
            "hpMult": 16.16,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 10582,
            "hpMult": 26.46,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 24,
            "bountyMult": 1.2,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 32,
            "hp": 419,
            "hpMult": 27.93,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 5792,
            "hpMult": 57.92,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 13,
            "bountyMult": 0.87,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 1630,
            "hpMult": 54.34,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.36,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 15,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 5,
            "hp": 5977,
            "hpMult": 45.98,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 14,
            "bountyMult": 1.08,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 3,
            "hp": 11440,
            "hpMult": 28.6,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 20,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 13,
        "earlyBonus": 95,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 7007,
            "hpMult": 35.04,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 15,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 35,
            "hp": 915,
            "hpMult": 61.02,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 1,
            "hp": 52624,
            "hpMult": 404.8,
            "speed": 46,
            "speedMult": 0.92,
            "interval": 1,
            "bounty": 98,
            "bountyMult": 7.54,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "45": {
    "mapId": "L45",
    "startHp": 10,
    "startGold": 280,
    "totalWaves": 13,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 1166,
            "hpMult": 11.66,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 6,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 541,
            "hpMult": 18.04,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 14,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 2200,
            "hpMult": 5.5,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 8,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 4,
            "hp": 825,
            "hpMult": 4.13,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 4,
            "bountyMult": 0.27,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 12,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 2090,
            "hpMult": 16.08,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 8,
            "bountyMult": 0.62,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 28,
            "hp": 161,
            "hpMult": 10.7,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.16,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 13,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 2090,
            "hpMult": 20.9,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 523,
            "hpMult": 17.41,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 5390,
            "hpMult": 13.48,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 16,
            "bountyMult": 0.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 12,
            "hp": 421,
            "hpMult": 10.54,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 48,
            "hp": 540,
            "hpMult": 36,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 3740,
            "hpMult": 18.7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 12,
            "bountyMult": 0.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 3245,
            "hpMult": 24.96,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 10,
            "bountyMult": 0.77,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 6600,
            "hpMult": 16.5,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 20,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 1925,
            "hpMult": 19.25,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 6,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 4950,
            "hpMult": 24.75,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 13,
            "bountyMult": 0.87,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 990,
            "hpMult": 33,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 15,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 5,
            "hp": 4620,
            "hpMult": 35.54,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 13,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 4,
            "hp": 7673,
            "hpMult": 19.18,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 18,
            "bountyMult": 0.9,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 56,
            "hp": 1108,
            "hpMult": 73.84,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.13,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 44330,
            "hpMult": 221.65,
            "speed": 32,
            "speedMult": 0.84,
            "interval": 1,
            "bounty": 90,
            "bountyMult": 6,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "46": {
    "mapId": "L46",
    "startHp": 10,
    "startGold": 295,
    "totalWaves": 14,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 10,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 26,
            "hp": 232,
            "hpMult": 15.48,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "scout",
            "count": 14,
            "hp": 581,
            "hpMult": 19.36,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 30,
            "hp": 220,
            "hpMult": 14.66,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 10,
            "hp": 374,
            "hpMult": 12.46,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.4,
            "bounty": 1,
            "bountyMult": 0.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "scout",
            "count": 20,
            "hp": 682,
            "hpMult": 22.74,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.36,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 45,
            "hp": 393,
            "hpMult": 26.18,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 12,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 2530,
            "hpMult": 25.3,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 14,
            "hp": 706,
            "hpMult": 23.54,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.36,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 55,
            "hp": 502,
            "hpMult": 33.44,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.13,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 13,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 3850,
            "hpMult": 19.25,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 12,
            "bountyMult": 0.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 45,
            "hp": 488,
            "hpMult": 32.56,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 12,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "scout",
            "count": 26,
            "hp": 1557,
            "hpMult": 51.89,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.32,
            "bounty": 4,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 65,
            "hp": 739,
            "hpMult": 49.28,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.12,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 13,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 5830,
            "hpMult": 44.85,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 15,
            "bountyMult": 1.15,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 18,
            "hp": 1833,
            "hpMult": 61.08,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.32,
            "bounty": 4,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 11,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "swarm",
            "count": 60,
            "hp": 1076,
            "hpMult": 71.72,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.12,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 13,
        "earlyBonus": 100,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 12485,
            "hpMult": 31.22,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 28,
            "bountyMult": 1.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 50,
            "hp": 968,
            "hpMult": 64.54,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.13,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 14,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "swarm",
            "count": 16,
            "hp": 4111,
            "hpMult": 274.04,
            "speed": 150,
            "speedMult": 0.88,
            "interval": 0.15,
            "clumps": 2,
            "bounty": 6,
            "bountyMult": 3,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "47": {
    "mapId": "L47",
    "startHp": 10,
    "startGold": 310,
    "totalWaves": 14,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "grunt",
            "count": 8,
            "hp": 450,
            "hpMult": 11.26,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.6,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 450,
            "hpMult": 15,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 1,
            "bountyMult": 0.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 13,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 2880,
            "hpMult": 7.2,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 8,
            "bountyMult": 0.4,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 900,
            "hpMult": 9,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 4,
            "bountyMult": 0.27,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 1800,
            "hpMult": 9,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 5,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 1230,
            "hpMult": 9.46,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 4,
            "bountyMult": 0.31,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 12,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "scout",
            "count": 12,
            "hp": 660,
            "hpMult": 22,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 28,
            "hp": 282,
            "hpMult": 18.8,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 13,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "blinker",
            "count": 5,
            "hp": 2400,
            "hpMult": 24,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 876,
            "hpMult": 21.9,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 5640,
            "hpMult": 14.1,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 14,
            "bountyMult": 0.7,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 1872,
            "hpMult": 9.36,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 5,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 13,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 4560,
            "hpMult": 35.08,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 11,
            "bountyMult": 0.85,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 14,
            "hp": 1010,
            "hpMult": 33.68,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.36,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 7800,
            "hpMult": 19.5,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 18,
            "bountyMult": 0.9,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 2659,
            "hpMult": 26.59,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 13,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 5760,
            "hpMult": 28.8,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 13,
            "bountyMult": 0.87,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "swarm",
            "count": 34,
            "hp": 533,
            "hpMult": 35.52,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 8880,
            "hpMult": 22.2,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 19,
            "bountyMult": 0.95,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 1274,
            "hpMult": 42.48,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 14,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 5520,
            "hpMult": 55.2,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 13,
            "bountyMult": 0.87,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "emp_bomber",
            "count": 5,
            "hp": 6480,
            "hpMult": 49.85,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 12,
            "bountyMult": 0.92,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 15,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 12240,
            "hpMult": 30.6,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 23,
            "bountyMult": 1.15,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 14,
            "hp": 1928,
            "hpMult": 48.22,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.5,
            "bounty": 3,
            "bountyMult": 0.53,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 14,
        "earlyBonus": 105,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 7800,
            "hpMult": 39,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 13,
            "bountyMult": 0.87,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 18,
            "hp": 2160,
            "hpMult": 72,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.32,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 14,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "goliath",
            "count": 1,
            "hp": 62160,
            "hpMult": 155.4,
            "speed": 30,
            "speedMult": 0.75,
            "interval": 1,
            "bounty": 100,
            "bountyMult": 5,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "48": {
    "mapId": "L48",
    "startHp": 10,
    "startGold": 195,
    "totalWaves": 14,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 11,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 28,
            "hp": 145,
            "hpMult": 9.68,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "grunt",
            "count": 12,
            "hp": 504,
            "hpMult": 12.6,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.58,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "scout",
            "count": 16,
            "hp": 515,
            "hpMult": 17.16,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 4,
            "bountyMult": 0.67,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 3703,
            "hpMult": 9.26,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 12,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 5,
            "hp": 2904,
            "hpMult": 22.34,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 19,
            "bountyMult": 1.46,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 3171,
            "hpMult": 15.86,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 11,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 46,
            "hp": 509,
            "hpMult": 33.96,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.14,
            "bounty": 3,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 2860,
            "hpMult": 28.6,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 999,
            "hpMult": 33.3,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.38,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 8855,
            "hpMult": 22.14,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 40,
            "bountyMult": 2,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 5720,
            "hpMult": 44,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 4026,
            "hpMult": 20.13,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 11,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "swarm",
            "count": 55,
            "hp": 944,
            "hpMult": 62.92,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.13,
            "bounty": 3,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 14,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 9680,
            "hpMult": 24.2,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 4400,
            "hpMult": 22,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 13,
        "earlyBonus": 50,
        "spawns": [
          {
            "type": "blinker",
            "count": 8,
            "hp": 8703,
            "hpMult": 87.03,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.2,
            "bounty": 22,
            "bountyMult": 1.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 14,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "scout",
            "count": 1,
            "hp": 48070,
            "hpMult": 160.24,
            "speed": 95,
            "speedMult": 0.86,
            "interval": 1,
            "bounty": 0,
            "bountyMult": 0,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "49": {
    "mapId": "L49",
    "startHp": 10,
    "startGold": 330,
    "totalWaves": 15,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 2,
            "hp": 1540,
            "hpMult": 7.7,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.8,
            "bounty": 22,
            "bountyMult": 1.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 12,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 3,
            "hp": 1906,
            "hpMult": 9.54,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.7,
            "bounty": 16,
            "bountyMult": 1.07,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 13,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 4,
            "hp": 2365,
            "hpMult": 11.83,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.6,
            "bounty": 14,
            "bountyMult": 0.93,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 13,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 2794,
            "hpMult": 13.97,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 13,
            "bountyMult": 0.87,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 9790,
            "hpMult": 24.48,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.4,
            "bounty": 37,
            "bountyMult": 1.85,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 14,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 4436,
            "hpMult": 22.19,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 14,
            "bountyMult": 0.93,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 15,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 11586,
            "hpMult": 28.96,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 32,
            "bountyMult": 1.6,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 14,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 7,
            "hp": 6333,
            "hpMult": 31.67,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 15,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 13915,
            "hpMult": 34.79,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 30,
            "bountyMult": 1.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 15,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 8,
            "hp": 8538,
            "hpMult": 42.69,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 16,
            "bountyMult": 1.07,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 16,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "goliath",
            "count": 5,
            "hp": 16456,
            "hpMult": 41.14,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 29,
            "bountyMult": 1.45,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 16,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 10,
            "hp": 9614,
            "hpMult": 48.07,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 15,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 16,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "goliath",
            "count": 6,
            "hp": 18553,
            "hpMult": 46.39,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 23,
            "bountyMult": 1.15,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 14,
        "delayAfter": 16,
        "earlyBonus": 110,
        "spawns": [
          {
            "type": "tank",
            "count": 6,
            "hp": 10450,
            "hpMult": 52.25,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.4,
            "bounty": 11,
            "bountyMult": 0.73,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 4,
            "hp": 16583,
            "hpMult": 41.46,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 12,
            "bountyMult": 0.6,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 15,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "tank",
            "count": 1,
            "hp": 120230,
            "hpMult": 601.15,
            "speed": 28,
            "speedMult": 0.74,
            "interval": 1,
            "bounty": 90,
            "bountyMult": 6,
            "isBoss": false,
            "isMiniBoss": true
          }
        ]
      }
    ]
  },
  "50": {
    "mapId": "L50",
    "startHp": 10,
    "startGold": 350,
    "totalWaves": 15,
    "unlockedTowers": [
      "gun",
      "laser",
      "mortar",
      "tesla",
      "stasis",
      "melter",
      "railgun"
    ],
    "canUpgrade": true,
    "waves": [
      {
        "wave": 1,
        "delayAfter": 12,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "grunt",
            "count": 10,
            "hp": 444,
            "hpMult": 11.1,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.58,
            "bounty": 2,
            "bountyMult": 0.35,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 8,
            "hp": 450,
            "hpMult": 15,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.42,
            "bounty": 1,
            "bountyMult": 0.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 2,
        "delayAfter": 13,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 2064,
            "hpMult": 10.32,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 3,
        "delayAfter": 11,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "swarm",
            "count": 36,
            "hp": 377,
            "hpMult": 25.12,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.15,
            "bounty": 1,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 4,
        "delayAfter": 13,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 2940,
            "hpMult": 29.4,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 8,
            "bountyMult": 0.53,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 5,
        "delayAfter": 14,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 5760,
            "hpMult": 14.4,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 16,
            "bountyMult": 0.8,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "grunt",
            "count": 10,
            "hp": 552,
            "hpMult": 13.8,
            "speed": 55,
            "speedMult": 1,
            "interval": 0.55,
            "bounty": 1,
            "bountyMult": 0.18,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 6,
        "delayAfter": 13,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 4980,
            "hpMult": 38.3,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 12,
            "bountyMult": 0.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 14,
            "hp": 650,
            "hpMult": 21.68,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.36,
            "bounty": 2,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 7,
        "delayAfter": 14,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "tank",
            "count": 5,
            "hp": 4560,
            "hpMult": 22.8,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 11,
            "bountyMult": 0.73,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 5,
            "hp": 2616,
            "hpMult": 26.16,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 7,
            "bountyMult": 0.47,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 8,
        "delayAfter": 11,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "swarm",
            "count": 48,
            "hp": 905,
            "hpMult": 60.32,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.13,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 9,
        "delayAfter": 15,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "goliath",
            "count": 3,
            "hp": 11400,
            "hpMult": 28.5,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 26,
            "bountyMult": 1.3,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 3504,
            "hpMult": 17.52,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 9,
            "bountyMult": 0.6,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 10,
        "delayAfter": 14,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "blinker",
            "count": 6,
            "hp": 6600,
            "hpMult": 66,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 14,
            "bountyMult": 0.93,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 16,
            "hp": 1320,
            "hpMult": 44,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 3,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 11,
        "delayAfter": 15,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 5,
            "hp": 7440,
            "hpMult": 57.23,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 15,
            "bountyMult": 1.15,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "goliath",
            "count": 4,
            "hp": 8460,
            "hpMult": 21.16,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 18,
            "bountyMult": 0.9,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 12,
        "delayAfter": 12,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "swarm",
            "count": 60,
            "hp": 1380,
            "hpMult": 92,
            "speed": 170,
            "speedMult": 1,
            "interval": 0.12,
            "bounty": 2,
            "bountyMult": 1,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 13,
        "delayAfter": 15,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "goliath",
            "count": 4,
            "hp": 15000,
            "hpMult": 37.5,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2.2,
            "bounty": 23,
            "bountyMult": 1.15,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 6,
            "hp": 5880,
            "hpMult": 58.8,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.3,
            "bounty": 8,
            "bountyMult": 0.53,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 14,
        "delayAfter": 15,
        "earlyBonus": 115,
        "spawns": [
          {
            "type": "emp_bomber",
            "count": 4,
            "hp": 7800,
            "hpMult": 60,
            "speed": 50,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 12,
            "bountyMult": 0.92,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "tank",
            "count": 5,
            "hp": 10200,
            "hpMult": 51,
            "speed": 38,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 9,
            "bountyMult": 0.6,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "scout",
            "count": 12,
            "hp": 2119,
            "hpMult": 70.64,
            "speed": 110,
            "speedMult": 1,
            "interval": 0.35,
            "bounty": 1,
            "bountyMult": 0.17,
            "isBoss": false,
            "isMiniBoss": false
          }
        ]
      },
      {
        "wave": 15,
        "delayAfter": 0,
        "earlyBonus": 0,
        "spawns": [
          {
            "type": "goliath",
            "count": 2,
            "hp": 16800,
            "hpMult": 42,
            "speed": 34,
            "speedMult": 0.85,
            "interval": 2,
            "bounty": 10,
            "bountyMult": 0.5,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "blinker",
            "count": 4,
            "hp": 6600,
            "hpMult": 66,
            "speed": 65,
            "speedMult": 1,
            "interval": 1.5,
            "bounty": 5,
            "bountyMult": 0.33,
            "isBoss": false,
            "isMiniBoss": false
          },
          {
            "type": "emp_overlord",
            "count": 1,
            "hp": 108000,
            "hpMult": 540,
            "speed": 26,
            "speedMult": 0.7,
            "interval": 1,
            "bounty": 40,
            "bountyMult": 2,
            "isBoss": true,
            "isMiniBoss": false
          }
        ]
      }
    ]
  }
};

// [XYZ301.01] Tower Unlock Overrides: Enforces unlocked tower options for Sector 1 transition levels.
for (let lvl = 5; lvl <= 10; lvl++) {
  LEVELS_DATA[lvl].unlockedTowers = ["gun", "laser", "mortar"];
}

// [XYZ302] Editor Binding Metadata: Level editor template definitions and level generation mode bindings.
const EDITOR_META = {
  "templates": {},
  "bindings": {
    "1": "custom",
    "2": "custom",
    "3": "custom",
    "4": "custom",
    "5": "custom",
    "6": "custom",
    "7": "custom",
    "8": "custom",
    "9": "hard_proc",
    "10": "hard_proc",
    "11": "hard_proc",
    "12": "custom",
    "13": "hard_proc",
    "14": "hard_proc",
    "15": "hard_proc",
    "16": "hard_proc",
    "17": "hard_proc",
    "18": "hard_proc",
    "19": "hard_proc",
    "20": "hard_proc",
    "21": "hard_proc",
    "22": "hard_proc",
    "23": "hard_proc",
    "24": "hard_proc",
    "25": "hard_proc",
    "26": "hard_proc",
    "27": "hard_proc",
    "28": "hard_proc",
    "29": "hard_proc",
    "30": "hard_proc",
    "31": "hard_proc",
    "32": "hard_proc",
    "33": "hard_proc",
    "34": "hard_proc",
    "35": "hard_proc",
    "36": "hard_proc",
    "37": "hard_proc",
    "38": "hard_proc",
    "39": "hard_proc",
    "40": "hard_proc",
    "41": "hard_proc",
    "42": "hard_proc",
    "43": "hard_proc",
    "44": "hard_proc",
    "45": "hard_proc",
    "46": "hard_proc",
    "47": "hard_proc",
    "48": "hard_proc",
    "49": "hard_proc",
    "50": "hard_proc"
  }
};

// [XYZ303] Module Load Verification: Console logging diagnostic confirming levels data initialization.
if (typeof console !== 'undefined') {
  console.log('[levels_data.js] Loaded successfully!', {
    totalLevels: typeof TOTAL_LEVELS !== 'undefined' ? TOTAL_LEVELS : 50,
    levelsDataKeys: Object.keys(LEVELS_DATA).length
  });
}