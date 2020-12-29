import { PubSubRedemptionMessage } from 'twitch-pubsub-client';
import db from '../../db';
import { Model } from '../../db/db-constants';
import { ChannelPointReward } from '../../bot/rewards';

interface Redemptions {
    rewards: Record<ChannelPointReward, number>;
    userName: string;
    userDisplayName: string;
    userID: string;
}

export default function handleRedeem(message: PubSubRedemptionMessage) {
    if (db.get(Model.Channel_Points).get(message.userId).value() === undefined) {
        db
            .get(Model.Channel_Points)
            .set(message.userId, {
                rewards: {
                    [ChannelPointReward.ffxiv_graha_tia_keychain]: 0,
                    [ChannelPointReward.ffxiv_ruby_weapon_t_shirt]: 0,
                    [ChannelPointReward.ffxiv_scarf]: 0,
                    [ChannelPointReward.gw2_800_gems]: 0,
                    [ChannelPointReward.gw2_aurene_funko_pop]: 0,
                    [ChannelPointReward.gw2_mount_t_shirt]: 0,
                    [ChannelPointReward.warframe_deluxe_skin]: 0,
                },
                userName: message.userName,
                userDisplayName: message.userDisplayName,
                userID: message.userId,
            })
            .write();
    }
    const currentValue = parseInt(db
        .get(Model.Channel_Points)
        .get(message.userId)
        .get('rewards')
        .get(message.rewardId)
        .value(), 10);
    db
        .get(Model.Channel_Points)
        .get(message.userId)
        .get('rewards')
        .set(message.rewardId, currentValue + 1)
        .write();
}
