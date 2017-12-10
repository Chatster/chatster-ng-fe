export class Message {
    text?: string;
    media?: any;
    info?: string;

    fromUsername?: string;
    toUsername?: string;

    fromSockId?: string;
    toSockId?: string;

    fromMe?: boolean;

    isNewMessage?: boolean;
}
