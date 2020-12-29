import { PubSubRedemptionMessage } from 'twitch-pubsub-client';
import rewardNames, { ChannelPointReward } from '../../bot/rewards';
import updateChannelPointRewardBalance from './update-channel-point-reward-balance';

interface Redemptions {
    rewards: Record<ChannelPointReward, number>;
    userName: string;
    userDisplayName: string;
    userID: string;
}

export default function handleRedeem(message: PubSubRedemptionMessage) {
    console.log('REDEEMER::' + message.userId + '::' + message.userDisplayName);
    console.log('REWARD::' + message.rewardId + '::' + rewardNames[message.rewardId]);
    updateChannelPointRewardBalance(message, message.rewardId as ChannelPointReward, 1);
}
