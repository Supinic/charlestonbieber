/* eslint-disable no-bitwise */

import { Command, Levels } from '.';
import { User, Channel } from '../entities';

/** @see https://github.com/Robinlemon/twitch-bot/blob/master/src/Classes/PermissionMultiplexer.ts */
export class PermissionMultiplexer {
  static getUserPermissions(user: User, channel: Channel): Command.Permissions {
    let permissionLevel = Command.Permissions.EVERYONE;

    if (channel.broadcaster?.id === user.id) {
      permissionLevel |= Command.Permissions.BROADCASTER;
    }

    if (user.level === Levels.TRUSTED) {
      permissionLevel |= Command.Permissions.TRUSTED;
    }

    if (user.level === Levels.ADMIN) {
      permissionLevel |= Command.Permissions.ADMIN;
    }

    return permissionLevel;
  }
}
