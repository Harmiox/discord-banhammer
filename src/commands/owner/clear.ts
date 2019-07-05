import { Command, Message } from '@yamdbf/core';
import { BanHammerClient } from '../../client/banhammer-client';
import { AppLogger } from '../../util/app-logger';

/**
 * Clear Command
 */

 export default class extends Command<BanHammerClient> {
	 private logger: AppLogger = new AppLogger('ClearCommand');

	 public constructor() {
		 super({
			desc: 'For testing, clears bans and unbans logged in the database.',
			group: 'Owner',
			name: 'clear',
			ownerOnly: true,
			usage: '<prefix>clear'
		 });
	 }

	 public async action(message: Message, args: string[]): Promise<Message | Message[]> {
		this.client.storage.set('banned', []);
		this.client.storage.set('unbanned', []);

		return message.reply('Cleared.');
	 }
 }