import { Message } from './Message.entity';

export class Conversation {
    with: string;   //  the name of who you're conversating
    sockId: string;
    messages: Message[];
    isCurrentActive: boolean;
    cannotBeClosed?: boolean;
}
