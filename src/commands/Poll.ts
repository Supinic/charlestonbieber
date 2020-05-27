import { Command, getOption } from '../modules';
import { Strawpoll, strawpoll } from '../modules/GotInstances';

export class Poll extends Command {
  name = 'poll';
  aliases = ['strawpoll'];
  description = 'Creates a poll on Strawpoll or fetches the results of one.';
  permission = Command.Permissions.BROADCASTER;
  cooldown = null;
  data = null;
  syntax = {
    new: [
      'title',
      'options',
      'multi=true|false?',
      'captcha=true|false?',
      'dupcheck=permissive|disabled|normal?',
    ],
    results: ['id'],
  };

  async execute(msg: Command.Input, type: 'new' | 'results', ...args: string[]): Promise<Command.Output> {
    switch (type) {
      case 'new': {
        const multi = getOption('multi', args, true) === 'true';
        const captcha = getOption('captcha', args, true) === 'true';
        const dupcheck = (
          getOption('dupcheck', args, true) as 'normal' | 'permissive' | 'disabled'
        ) ?? 'normal';

        const [title, ...options] = args
          .join(' ')
          .split('|')
          .map((i) => i.trim());

        if (!title) {
          return {
            reply: 'A title must be provided',
            success: false,
            cooldown: 5000,
          };
        }

        if (options.length === 0) {
          return {
            reply: 'No option provided',
            success: false,
            cooldown: 5000,
          };
        }

        if (!['normal', 'permissive', 'disabled'].includes(dupcheck)) {
          return {
            reply: 'dupcheck must be normal (default), permissive, or disabled.',
            success: false,
            cooldown: 5000,
          };
        }

        const json: Strawpoll.Poll = {
          title,
          options,
          multi,
          captcha,
          dupcheck,
        };

        const poll = await strawpoll.post('polls', { json }).json<Strawpoll.Poll>();

        return {
          reply: `${msg.user.name} created a poll: https://strawpoll.me/${poll.id}`,
          cooldown: 25000,
          noUsername: true,
        };
      }

      case 'results': {
        const [id] = args;

        if (!id) {
          return {
            reply: 'ID of the poll must be provided',
            success: false,
            cooldown: 5000,
          };
        }

        if (Number.isNaN(Number(id))) {
          return {
            reply: 'The ID must be a number. The ID can be found in the link: https://strawpoll.me/<id>',
            success: false,
            cooldown: 5000,
          };
        }

        const { statusCode, body } = await strawpoll(`polls/${id}`, { throwHttpErrors: false });

        if (statusCode === 404) {
          return {
            reply: 'Could not find a poll with that ID',
            success: false,
            cooldown: 10000,
          };
        }

        const poll: Strawpoll.Poll = JSON.parse(body);
        const sum = poll.votes.reduce((acc, cur) => acc + cur);
        const reply = poll.options.map((option, i) => {
          const votes = poll.votes[i];

          return `${option}: ${((votes / sum) * 100).toFixed()}% (${votes.toLocaleString()})`;
        }).join(' | ');

        return {
          reply: `(${poll.title}) ${reply}`,
          cooldown: 15000,
        };
      }

      default:
        return {
          reply: 'Could not find that type. You can use types "new" and "results"',
          success: false,
          cooldown: 2500,
        };
    }
  }
}
