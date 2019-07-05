import { Command, Message } from '@yamdbf/core';
import { BanHammerClient } from '../../client/banhammer-client';
import { AppLogger } from '../../util/app-logger';

/**
 * Servers Command
 */

 export default class extends Command<BanHammerClient> {
	 private logger: AppLogger = new AppLogger('ServersCommand');

	 public constructor() {
		 super({
			name: 'servers',
			desc: 'Get a list of servers that the bot is in.',
			usage: '<prefix>servers',
			group: 'Owner',
			ownerOnly: true
		 });
	 }

	 public async action(message: Message, args: string[]): Promise<Message | Message[]> {
		return message.author.send(`Currently in these servers:\n\`\`\`HTTP\n${this.client.guilds.map((g) => `${g.name}: ${g.memberCount} users`).join('\n')}\`\`\``);
	 }
 }