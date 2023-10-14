import { getByProps } from '@metro';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const methods = ['error', 'info', 'log', 'warn', 'trace', 'debug'];

export default () => {
  const Util = getByProps('inspect');

  for (const method of methods) {
    console[method].__ORIGINAL__ = console[method];

    console[method] = (...args) => {
      const payload = [];

      for (let i = 0, len = args.length; len > i; i++) {
        payload.push(typeof args[i] === 'string' ? args[i] : Util.inspect(args[i]));
      }

      let output = '';

      for (let i = 0, len = payload.length; len > i; i++) {
        output += `${payload[i]} `;
      }

      nativeLoggingHook(output, levels[method] ?? levels.info);
    };
  }
};