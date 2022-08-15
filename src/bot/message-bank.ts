const message_bank: Record<string, string> = {
    /** v v v CURRENT EVENT GOES HERE v v v */
    event: "",
    /** ^ ^ ^ CURRENT EVENT GOES HERE ^ ^ ^ */
    afsp: 'Join the American Foundation for Suicide Prevention in spreading the word that no one is alone, and that we’re here for one another. Your donation helps the AFSP fund research, education, advocacy programs for suicide prevention, and support for survivors of suicide loss. Show your support here: https://afsp.org/donate-to-afsp',
    aha: "Heart disease is the No. 1 killer worldwide, and stroke ranks second globally. The American Heart Association strives to see a world free of cardiovascular diseases and stroke. | Find out more: www.heart.org | Women's heart health: www.goredforwomen.org",
    battletag: 'Blizzard/battle.net: [Rook#11953 :: Main], [Rook#11992 :: Alternate]',
    curiositystream: "Sponsored: Want smarter TV? Get thousands of shows on everything you can imagine - space, dinosaurs, volcanoes and more. Use my code birdofchess for 30 days free. https://wehy.pe/7/birdofchess",
    discord: 'https://discord.gg/K8mtM7s',
    donate: 'https://donate.tiltify.com/@birdofchess/bird-heroes-for-heart',
    eso: 'ESO: [Kelryn Talonir :: @birdofchess]',
    ffxiv: "FFXIV: [Valke D'aubigny :: Crystal - Zalera]",
    games: 'https://bit.ly/2GqYEfS',
    gw1: 'Guild Wars 1: [Vianne Lacelle]',
    gw2: "Guild Wars 2: [Rook.6302 :: Yak's Bend]",
    help: '!help [!commands] :: !shame [!shametoken] :: !flip [!flipcoin|!coinflip|!cointoss] :: !games [!gameslist] :: !roll (number) :: !quote :: !donorquote :: !request (during sub requests) :: !hug :: !stream [!uptime] :: !discord :: !steam :: !balance :: !event :: !ffxiv :: !gw2 :: !battlenet [!bnet|!btag|!battletag|!ow|!overwatch] :: !imanerd for bot specs.',
    imanerd: "botofchess is written in TypeScript, using the twitch-js npm package (RIP tmi.js). Data is persisted on an in-memory lodash json db. botofchess' sister app, birdofbytes, is a server that powers Rook's dynamic graphics.",
    skyforge: `Sponsored: Skyforge, a beautiful, MMORPG game with awesome grinding and battles. Think it looks fun? Check it out here: https://wehy.pe/3/birdofchess`,
    steam: 'steamcommunity.com/id/birdofchess',
    streamgifts: "We're Partnered with StreamGifts, a gifting service that enables Twitch communities to send appreciation gifts to their favorite streamers while protecting personal information on both sides--safer than an Amazon wishlist or even a P.O. box is now. Send a gift through https://stream.gifts/birdofchess",
    trevor: 'The Trevor Project is a leading national organization providing crisis intervention and suicide prevention services to LGBTQIA+ young people under 25. Help save lives by showing your support: https://donate.tiltify.com/@birdofchess/bird-pride-in-september',
    twitter: 'https://twitter.com/rookuri_',
    warframe: 'Warframe: [Rookthebird]',
    youtube: 'Rook is on YouTube! https://www.youtube.com/rookuri',
    hyperx: 'Check out the HyperX Quadcast here!: https://bit.ly/QuadcastS',
    bloodhunt: 'Bloodhunt is a thrilling free-to-play vampire battle royale. Use your supernatural powers, weapons, and wit to hunt your rivals and dominate the night! Go to www.bloodhunt.com for more information! https://bit.ly/3uM3L1j #ad'
};

export const synonyms: Record<string, string> = {
    bnet: 'battletag',
    ow: 'battletag',
    battlenet: 'battletag',
    overwatch: 'battletag',
    btag: 'battletag',
    ff14: 'ffxiv',
    guildwars2: 'gw2',
    guildwars1: 'gw1',
    gameslist: 'games',
    commands: 'help',
}

export default message_bank;
