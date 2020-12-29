import db from '../../db';
import { ChannelPointReward } from '../../bot/rewards';
import { Model } from '../../db/db-constants';
import { PubSubRedemptionMessage } from 'twitch-pubsub-client';
import { User } from 'twitch';


type UserResolvable = User | PubSubRedemptionMessage;


function getUserProps(user: UserResolvable) {
    let id;
    let name;
    let displayName;
    if ((user as PubSubRedemptionMessage).userId !== undefined) {
        ({ userId: id, userName: name, userDisplayName: displayName } = user as PubSubRedemptionMessage);
    } else {
        ({ id, name, displayName } = user as User);
    }
    return { id, name, displayName };
}

export default function updateChannelPointRewardBalance(user: UserResolvable, rewardID: ChannelPointReward, amount: number) {
    try {
        const { id, name, displayName } = getUserProps(user);
        if (id === undefined) {
            return false;
        }

        if (db.get(Model.Channel_Points).get(id).value() === undefined) {
            db
                .get(Model.Channel_Points)
                .set(id, {
                    rewards: {
                        [ChannelPointReward.ffxiv_graha_tia_keychain]: 0,
                        [ChannelPointReward.ffxiv_random_minion]: 0,
                        [ChannelPointReward.ffxiv_ruby_weapon_t_shirt]: 0,
                        [ChannelPointReward.ffxiv_scarf]: 0,
                        [ChannelPointReward.gw2_800_gems]: 0,
                        [ChannelPointReward.gw2_aurene_funko_pop]: 0,
                        [ChannelPointReward.gw2_shimmering_aurene_skin]: 0,
                        [ChannelPointReward.gw2_mount_t_shirt]: 0,
                        [ChannelPointReward.warframe_deluxe_skin]: 0,
                    },
                    userName: name,
                    userDisplayName: displayName,
                    userID: id,
                })
                .write();
        }

        const currentValue = parseInt(
            db
                .get(Model.Channel_Points)
                .get(id)
                .get('rewards')
                .get(rewardID, 0)
                .value(),
            10,
        );

        db
            .get(Model.Channel_Points)
            .get(id)
            .get('rewards')
            .set(rewardID, currentValue + amount)
            .write();

        return true;
    } catch (e) {
        console.log('something went wrong', e);
        return false;
    }
}
