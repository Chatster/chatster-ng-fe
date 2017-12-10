import { MessageColors } from '../enums/MessageColors.enum';

export class Message {
    text?: string;
    media?: any;

    info?: string;
    infoColor?: MessageColors;

    fromUsername?: string;
    toUsername?: string;

    fromSockId?: string;
    toSockId?: string;

    fromMe?: boolean;

    isNewMessage?: boolean;
}
