import { Pipe, PipeTransform } from '@angular/core';
import { Message } from '../x-shared/entities/Message.entity';

@Pipe({
    name: 'newMessages'
})
export class NewMessagesPipe implements PipeTransform {

    transform(value: Message[], args?: any): boolean {
        return !!value.find(msg => msg.isNewMessage);
    }

}
