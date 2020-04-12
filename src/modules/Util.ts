const timeUnits = {
  y: { d: 365, h: 8760, m: 525600, s: 31536000, ms: 31536000.0e3 },
  d: { h: 24, m: 1440, s: 86400, ms: 86400.0e3 },
  h: { m: 60, s: 3600, ms: 3600.0e3 },
  m: { s: 60, ms: 60.0e3 },
  s: { ms: 1.0e3 }
};

/**
 * Returns a formatted string, specifying an amount of time delta from current date to provided date.
 * @param target
 * @param skipAffixes if true, the affixes 'in X hours' or 'X hours ago' will be omitted
 */
export function timeDelta(target: Date, skipAffixes = false): string {
  const now = new Date();
  if (now.valueOf() === target.valueOf()) {
    return 'right now!';
  }

  let string: string;
  const delta = Math.abs(now.valueOf() - target.valueOf());
  const [prefix, suffix] = target > now ? ['in ', ''] : ['', ' ago'];

  if (delta < timeUnits.s.ms) {
    string = delta + 'ms';
  } else if (delta < timeUnits.m.ms) {
    string = Math.round(delta / timeUnits.s.ms) + 's';
  } else if (delta < timeUnits.h.ms) {
    const minutes = Math.trunc(delta / timeUnits.m.ms);
    const seconds = Math.trunc((delta / timeUnits.s.ms) % timeUnits.m.s);
    string = minutes + 'm, ' + seconds + 's';
  } else if (delta < timeUnits.d.ms) {
    const hours = Math.trunc(delta / timeUnits.h.ms);
    const minutes = Math.trunc(delta / timeUnits.m.ms) % timeUnits.h.m;
    string = hours + 'h, ' + minutes + 'm';
  } else if (delta < timeUnits.y.ms) {
    const days = Math.trunc(delta / timeUnits.d.ms);
    const hours = Math.trunc(delta / timeUnits.h.ms) % timeUnits.d.h;
    string = days + 'd, ' + hours + 'h';
  } else {
    const years = Math.trunc(delta / timeUnits.y.ms);
    const days = Math.trunc(delta / timeUnits.d.ms) % timeUnits.y.d;
    string = years + 'y, ' + days + 'd';
  }

  return skipAffixes
    ? string
    : prefix + string + suffix;
}

export function randomArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
