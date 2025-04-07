import {
    IAppAccessors,
    ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { IConfigurationExtend } from '@rocket.chat/apps-engine/definition/accessors';
import { settings } from './settings/settings';
import { StockDataCommand } from './commands/StockDataCommand';

export class StockMarketBotApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }
    public async extendConfiguration(configuration: IConfigurationExtend) {
        await Promise.all([
            ...settings.map((settings) => 
                configuration.settings.provideSetting(settings)
            ),
            configuration.slashCommands.provideSlashCommand(new StockDataCommand()),
        ]);
    }
}
