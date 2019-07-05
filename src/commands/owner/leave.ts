import { Command, Message } from '@yamdbf/core';
import { Guild } from 'discord.js';
import { BanHammerClient } from '../../client/banhammer-client';
import { AppLogger } from '../../util/app-logger';

/**
 * Leave Command
 */

 export default class extends Command<BanHammerClient> {
	 private logger: AppLogger = new AppLogger('LeaveCommand');

	 public constructor() {
		 super({
			desc: 'Leave the current guild.',
			group: 'Owner',
			name: 'leave',
			ownerOnly: true,
			usage: '<prefix>leave #guild-id'
		 });
	 }

	 public async action(message: Message, args: string[]): Promise<Message | Message[]> {
		const guild: Guild | undefined = this.client.guilds.get(args[0]);
		if (!args[0] || !args[0].match(/!?(\d{17,19})/g)) { return message.reply('an invalid Guild ID was given.'); }
		if (!guild) { return message.reply(''); }
		try {
			await guild.leave();
		} catch (err) {
			this.logger.error(`Error when leaving ${guild.name} (${guild.id}): `, err);

			return message.reply(` an error occurred: \`${err.message}\``)
		}

		return message.author.send(`I have successfully left ${guild.name} (${guild.id}).`);
	 }
 }