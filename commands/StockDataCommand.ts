import {
	IHttp,
	IModify,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
	ISlashCommand,
	SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class StockDataCommand implements ISlashCommand {
	public command = 'asset-data'; 
	public i18nParamsExample = '[STOCK_SYMBOL]';
	public i18nDescription = 'Gives basic data on stocks using symbols';
	public providesPreview = false;

	public async executor(
		context: SlashCommandContext,
		read: IRead,
		modify: IModify,
		http: IHttp
	): Promise<void> {
		const args = context.getArguments();
		if (!args || args.length === 0) {
			await this.sendMessage(context, modify, "Usage: /asset-data [STOCK_SYMBOL]");
			return;
		}

		const symbol = args[0].toUpperCase();
		// Use your Finnhub API key (ideally, retrieve this from environment settings)
		const apiKey = 'cvgrippr01qi76d4rhl0cvgrippr01qi76d4rhlg'; 
		const finnHubUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;

		try {
			const res = await http.get(finnHubUrl);
			const quoteResponse = JSON.parse(res.content || '{}');

			if (!quoteResponse || !quoteResponse.c) {
				await this.sendMessage(context, modify, `No data found for symbol: ${symbol}`);
				return;
			}

			// Extract relevant fields (current, high, low, open, previous close)
			const currentPrice = quoteResponse.c;
			const high = quoteResponse.h;
			const low = quoteResponse.l;
			const open = quoteResponse.o;
			const previousClose = quoteResponse.pc;

			const responseText = `
			**${symbol} Market Data:**\n
			- Current Price: ${currentPrice}
			- High: ${high}
			- Low: ${low}
			- Open: ${open}
			- Previous Close: ${previousClose}`;
			await this.sendMessage(context, modify, responseText);
		} catch (error) {
			await this.sendMessage(context, modify, `Error fetching data for symbol: ${symbol}`);
		}
	}

	private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
		const messageStructure = modify.getCreator().startMessage();
		const sender = context.getSender();
		const room = context.getRoom();

		messageStructure
			.setSender(sender)
			.setRoom(room)
			.setText(message);

		await modify.getCreator().finish(messageStructure);
	}
}
