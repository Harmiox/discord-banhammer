import { Command, Message } from '@yamdbf/core';
import { BanHammerClient } from '../../client/banhammer-client';
import { AppLogger } from '../../util/app-logger';

/**
 * Empty Command
 */

 export default class extends Command<BanHammerClient> {
	 private logger: AppLogger = new AppLogger('EmptyCommand');

	 public constructor() {
		 super({
			desc: 'For testing, empties the database where bans and unbans are logged.',
			group: 'Owner',
			name: 'empty',
			ownerOnly: true,
			usage: '<prefix>empty'
		 });
	 }

	 public async action(message: Message, args: string[]): Promise<Message | Message[]> {
		this.client.storage.set('banned', []);
		this.client.storage.set('unbanned', []);

		return message.reply('The databases have been emptied.');
	 }
 }