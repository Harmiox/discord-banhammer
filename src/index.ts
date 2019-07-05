import { BanHammerClient } from './client/banhammer-client';
import { ConfigService } from './config/config.service';
import { AppLogger} from './util/app-logger';

const logger: AppLogger = new AppLogger('Main');
const config: ConfigService = new ConfigService();

async function bootstrap(): Promise<void> {
	logger.info('Initiating BanHammer...');
	logger.info(`${Date.now()}`);

	const client: BanHammerClient = new BanHammerClient(config);
  client.start();
}

bootstrap();