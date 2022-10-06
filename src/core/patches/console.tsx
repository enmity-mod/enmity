import { getByProps } from '@metro';

const Util = getByProps('inspect');

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const methods = ['error', 'info', 'log', 'warn', 'trace', 'debug'];

export default () => {
  for (const method of methods) {
    const orig = console[method];

    console[method] = (...args) => {
      const payload = [];

      for (let i = 0, len = args.length; len > i; i++) {
        payload.push(Util.inspect(args[i]));
      }

      let output = '';

      for (let i = 0, len = payload.length; len > i; i++) {
        output += `${payload[i]} `;
      }

      nativeLoggingHook(output, levels[method] ?? levels.info);
    };

    console[method].__ORIGINAL__ = orig;
  }
};