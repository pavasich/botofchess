# !set-reminder, !clear-reminder

A pair of commands enabling mods to set and clear a message for bot to
say at some regular interval.

The `message` portion of the command **MUST** be enclosed by quotes or
some other character not present in the rest of the text.

---

#### Usage
`!reminder`__*`"<message>" <interval>`*__

|Parameter|Type|
|---|---|
|__message__|_text_|
|__interval__|_number_|

__Examples__:

`!set-reminder "bobobobobobo" 15`
> Bot will say `bobobobobobo` ever 15 minutes

`!set-reminder %This message has "quotes" in it% 7`
> Bot will way `This message has "quotes" in it` every 7 minutes

`!clear-reminder`
> No more reminder :c
