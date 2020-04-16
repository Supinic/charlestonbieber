import { getConnection } from 'typeorm';
import { Command, Input, Output } from '../modules';
import { Suggestion } from '../entities';

export class Suggest extends Command {
  name = 'suggest';
  aliases = [];
  cooldown = 10000;
  data = null;

  async execute(msg: Input, ...args: string[]): Promise<Output> {
    const suggestion = args.join(' ');

    if (!suggestion) {
      return {
        reply: 'Please provide a suggestion??? FeelsDankMan',
        success: false,
        cooldown: 5000,
      };
    }

    const suggestionObject = new Suggestion();
    suggestionObject.date = msg.timestamp;
    suggestionObject.user = msg.user;
    suggestionObject.suggestion = suggestion;

    await getConnection().manager.save(suggestionObject);

    return { reply: `Suggestion saved and eShrug ID: ${suggestionObject.id}` };
  }
}
