# Wallets

Every user that sends a message through the `birdofchess` must have a
wallet object. On every chat event, `botofchess` checks for that user's
wallet and upserts an empty one if a wallet is not found.

The Wallet collection is simple; a user's
Twitch ID (NOT their display name) functions as the key, and the value
is JSON:
```json
  {
    "gw2": 0,
    "ffxiv": 0,
    "ticket": 0
  }
```

Each property in a Wallet represents the amount of `ticket`s that user
has purchased. `gw2` and `ffxiv` should be self-explanatory, and the
`ticket` property exists so we can hold currency-based giveaways
that are not directly related to one of those two games.

---

_related command_: _[!update-wallet](./commands/update-wallet.md)_
