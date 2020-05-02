import { getManager } from 'typeorm';
import { Command } from '../modules';
import { Suggestion } from '../entities';

export class Suggest extends Command {
  name = 'suggest';
  aliases = [];
  syntax = ['suggestion'];
  description = 'Suggest something about the bot';
  cooldown = 10000;
  data = null;
  permission = Command.Permissions.EVERYONE;

  async execute(msg: Command.Input, ...args: string[]): Promise<Command.Output> {
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

    await getManager().save(suggestionObject);

    return { reply: `Suggestion saved and eShrug ID: ${suggestionObject.id}` };
  }
}
