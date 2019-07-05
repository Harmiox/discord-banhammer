import { Client, Message } from '@yamdbf/core';
import { ConfigService } from '../config/config.service';
import { AppLogger } from '../util/app-logger';
import { checkChannelPermissions } from '../middlewares/authorized-channel';

/**
 * BanHammer Client
 */

export class BanHammerClient extends Client {
	private logger: AppLogger = new AppLogger('BanHammerClient');
	private disconnects: number = 0;

	constructor(config: ConfigService) {
		super({
			token: config.discord.token,
			readyText: 'BanHammer Client Ready',
			unknownCommandError: false,
			commandsDir: './dist/commands',
      pause: true,
			owner: ['228781414986809344'] // Harmiox,
		});

		// Attach middleware
    this.use((message: Message, args: any[]) => checkChannelPermissions(message, args, config.discord.authorizedChannelId, this.owner));

		// Bind events to local client methods
		this.on('ready', this.onReady);
		this.on('warn', this.onWarn);
		this.on('pause', this.onPause);
		this.on('error', this.onError);
		this.on('disconnect', this.onDisconnect);
		this.on('reconnecting', this.onReconnecting);
	}

	public start() {
		this.logger.info(`${this.logger.context} has been started.`);

		return super.start();
	}

	private onReady() {
		const shardId: number = this.shard == null ? 0 : this.shard.id;
    this.logger.info(`${this.logger.context} with shardId #${shardId} is ready (${this.guilds.size} guilds)`);
	}

	private onWarn(info: {}): void {
    this.logger.warn('Discord warning: ', info);
  }

	private async onPause(): Promise<void> {
    await this.setDefaultSetting('prefix', '!g');
    this.continue();
	}
	
	private onError(error: Error): void {
		this.logger.error('Client Error', error);
	}

	private onDisconnect(event: CloseEvent): void {
		this.logger.warn(`${this.logger.context} has been disconnected.`);
		this.disconnects += 1;
    this.logger.warn(`[DICONNECT:${event.code}] ${event.reason}`);
    if (event.code === 1000) {
			this.logger.warn('Disconnect with event code 1000. Exiting process...');
			process.exit();
    }
    if (this.disconnects >= 10) {
      this.logger.warn(`${this.disconnects} failed attempts on reconnecting. Exiting process...`);
    }
    this.logger.warn(`[ATTEMPT:${this.disconnects}] Attempting to login again...`);
    this.login(this.token).catch(err => {
			this.logger.info(`[ERROR] Error when attempting to login after disconnect.\n${err}`);
      process.exit();
    });
  }

  private onReconnecting(): void {
    this.logger.warn(`${this.logger.context} is reconnecting.`);
  }

}