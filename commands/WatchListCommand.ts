import {
	IHttp,
	IModify,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';

import {
	ISlashCommand,
	SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

import {
	RocketChatAssociationModel,
	RocketChatAssociationRecord,
} from '@rocket.chat/apps-engine/definition/metadata';

export class WatchlistCommand implements ISlashCommand {
	public command = 'watchlist';
	public i18nDescription = 'Add asset to watchlist with price threshold';
	public i18nParamsExample = 'add BTCUSDT 42000';
	public providesPreview = false;

	public async executor(
			context: SlashCommandContext,
			read: IRead,
			modify: IModify,
			http: IHttp,
			persistence: IPersistence,
	): Promise<void> {
			const [action, symbol, target] = context.getArguments();
			const user = context.getSender();

			if (!action || !symbol || !target || isNaN(parseFloat(target))) {
					await this.sendMessage(modify, context, '❌ Usage: `/watchlist add [SYMBOL] [TARGET_PRICE]`');
					return;
			}

			if (action.toLowerCase() !== 'add') {
					await this.sendMessage(modify, context, '❌ Only `add` is supported currently.');
					return;
			}

			const watchItem = {
					userId: user.id,
					symbol: symbol.toUpperCase(),
					targetPrice: parseFloat(target),
			};

			const assoc = new RocketChatAssociationRecord(RocketChatAssociationModel.USER, user.id);
			await persistence.createWithAssociation(watchItem, assoc);

			await this.sendMessage(modify, context, `✅ Watchlist alert set for *${symbol.toUpperCase()}* at *$${target}*`);
	}

	private async sendMessage(modify: IModify, context: SlashCommandContext, text: string): Promise<void> {
			const msg = modify.getCreator().startMessage();
			msg.setText(text);
			msg.setRoom(context.getRoom());
			msg.setSender(context.getSender());
			await modify.getCreator().finish(msg);
	}
}
