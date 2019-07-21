import { v4 } from '../../util/uuid';

interface ChannelEventParams {
    name: string;
    currency?: boolean;
    id?: string;
}

export class ChannelEvent {
    public static toJSON(event: ChannelEvent): ChannelEventParams {
        return {
            name: event.name,
            currency: event.currency,
            id: event.id,
        };
    }

    public static fromJSON(event: ChannelEventParams) {
        return new ChannelEvent(event);
    }

    public readonly id: string;

    public readonly name: string;

    public readonly currency: boolean;

    public constructor(params: ChannelEventParams) {
        const {
            name,
            currency = false,
            id,
        } = params;
        this.name = name;
        this.currency = currency;
        if (id === undefined) {
            this.id = v4();
        } else {
            this.id = id;
        }
    }

}
