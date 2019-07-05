import { Message } from '@yamdbf/core';
import { BanHammerClient } from '../client/banhammer-client';


export async function checkChannelPermissions(
	message: Message, 
	args: any[], 
	authorizedChannelId: string,
	owners: string[]
	// @ts-ignore
	): Promise<[Message, any[]]>{
	if (message.channel.id === authorizedChannelId) { return [message, args]; }
	if ((owners.indexOf(message.author.id) >= 0) && message.channel.type === 'dm') { return [message, args]; }
}