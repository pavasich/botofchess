# !update-wallet
A Mod tool for managing user wallets
<br><br>
#### Usage
`!update-balance <`__*`username`*__`> <`__*`operation`*__`> <`__*`ticket_type`*__`> <`__*`amount`*__`>`

|Parameter|Type|
|---|---|
|__username__|_text_|
|__operation__|_`set`_, _`inc`_, _`dec`_|
|__ticket_type__|_`ffxiv`_, _`gw2`_|
|__amount__|_number_|

__Examples__:

`!update-wallet bebop_bebop set ffxiv 5`
- Set bebop_bebop's ffxiv ticket balance to 5

`!update-wallet bebop_bebop inc ffxiv 5`
-  Add 5 to bebop_bebop's ffxiv ticket balance

`!update-wallet bebop_bebop dec ffxiv 5`
- Subtract 5 from bebop_bebop's ffxiv ticket balance

___

#### Operations
|Operation|Description|
|---|---|
|__set__|Overwrite a user's _ticket_type_ ticket balance to be _amount_.|
|__inc__|Increment a user's _ticket_type_ ticket balance by _amount_.|
|__dec__|Decrement a user's _ticket_type_ ticket balance by _amount_.|

> These operations exist to empower moderators such that they can
manage balances as they deem necessary. Feel free to use them. I only
ask that you kindly refrain from using them on yourself if you plan
to enter a giveaway >D

---

_[About Wallets](../wallet.md)_
