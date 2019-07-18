import { Command, Message } from '@yamdbf/core';
import { BanHammerClient } from '../../client/banhammer-client';
import { ILoggedAction } from '../../config/interfaces/logged-action.interface';
import { AppLogger } from '../../util/app-logger';

/**
 * Ban Command
 */

 export default class extends Command<BanHammerClient> {
	 private logger: AppLogger = new AppLogger('BanCommand');

	 public constructor() {
		 super({
			desc: 'Ban a user in all guilds.',
			group: 'BanHammer',
			guildOnly: true,
			name: 'ban',
			usage: '<prefix>ban User-ID'
		 });
	 }

	 public async action(message: Message, args: string[]): Promise<Message | Message[]> {
		 // Validate arguments
		const userId: string = args[0] || '';
		const reason: string = args.splice(1).join(' ');
		if (!userId.match(/!?(\d{17,19})/g)) { return message.reply('please give a valid user id.'); }
		if (!reason) { return message.reply('please give a reason for the global ban.');}

		// Update database
		const bannedArray: ILoggedAction[] = await this.client.storage.get('banned') || [];
		const authorId: string = message.author ? message.author.id : '';
		bannedArray.push({
			authorId,
			reason,
			userId
		});
		this.client.storage.set('banned', bannedArray);

		// Execute the bans
		const failed: Array<{ name: string, reason: string }> = [];
		const succeeded: Array<{ name: string }> = [];

		for (const guild of this.client.guilds.values()) {
			try {
				const banned = await guild.members.ban(userId, { reason });
				if (!banned) { this.logger.info('Failed Ban'); }
				succeeded.push({ name: guild.name });
			} catch (error) {
				this.logger.error(`Error when banning in guild '${guild.id}' for '${error.message}'. `, error);
				failed.push({ name: guild.name, reason: error.message });
			}
		}

		// Generate response string
		const succeededText: string = `The user '${userId}' has been banned in **${succeeded.length} guild(s)**. `;
		const failedText: string = `I was unable to ban that user in the following guilds:`
															+ `\`\`\`HTTP\n${failed.map((f) => `${f.name}: ${f.reason}`).join('\n')}\n\`\`\``;
		let response: string = '';
		if (succeeded.length === 0) { response = failedText; }
		else if (failed.length === 0) { response = succeededText; }
		else { response = succeededText + failedText; }

		return message.reply(response);
	 }
 }