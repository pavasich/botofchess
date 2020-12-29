export const ffxiv_graha_tia_keychain = '0a1a2db6-a361-43c7-bf73-b7497d1ed4a3';
export const ffxiv_ruby_weapon_t_shirt = '82d70fef-ecc9-47c3-be89-5063fe61d451';
export const ffxiv_scarf = 'd3e60870-3b3e-4aff-97fe-2f43bfb4b36f';
export const gw2_800_gems = 'aa5764f4-b72f-49ac-afde-cadd4ceac5f0';
export const gw2_aurene_funko_pop = '084148d2-b936-4d88-a14d-a27e6a49dff0';
export const gw2_mount_t_shirt = 'f17f94ed-1d0e-48e7-82f2-faaea5e2d2ee';
export const warframe_deluxe_skin = 'bea9d93b-bc33-46fc-a343-08c0a0f75118';

export enum ChannelPointReward {
    ffxiv_graha_tia_keychain = '0a1a2db6-a361-43c7-bf73-b7497d1ed4a3',
    ffxiv_ruby_weapon_t_shirt = '82d70fef-ecc9-47c3-be89-5063fe61d451',
    ffxiv_scarf = 'd3e60870-3b3e-4aff-97fe-2f43bfb4b36f',
    gw2_800_gems = 'aa5764f4-b72f-49ac-afde-cadd4ceac5f0',
    gw2_aurene_funko_pop = '084148d2-b936-4d88-a14d-a27e6a49dff0',
    gw2_mount_t_shirt = 'f17f94ed-1d0e-48e7-82f2-faaea5e2d2ee',
    warframe_deluxe_skin = 'bea9d93b-bc33-46fc-a343-08c0a0f75118',
}

type Rewards = Record<ChannelPointReward, string> & { [key: string]: string; };

const rewardNames: Rewards = {
    [ffxiv_graha_tia_keychain]: 'ffxiv_graha_tia_keychain',
    [ffxiv_ruby_weapon_t_shirt]: 'ffxiv_ruby_weapon_t_shirt',
    [ffxiv_scarf]: 'ffxiv_scarf',
    [gw2_800_gems]: 'gw2_800_gems',
    [gw2_aurene_funko_pop]: 'gw2_aurene_funko_pop',
    [gw2_mount_t_shirt]: 'gw2_mount_t_shirt',
    [warframe_deluxe_skin]: 'warframe_deluxe_skin',
}

export default rewardNames;
