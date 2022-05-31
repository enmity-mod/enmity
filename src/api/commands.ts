import type { Command } from 'enmity/api/commands';
import { filters, bulk } from '@metro';
import { create } from '@patcher';

const Patcher = create('enmity-commands');

const [
  Commands,
  Discovery,
  Assets
] = bulk(
  filters.byProps('getBuiltInCommands'),
  filters.byProps('useApplicationCommandsDiscoveryState'),
  filters.byProps('getApplicationIconURL')
);

let commands: Command[] = [];

export const section = {
  id: 'enmity',
  type: 1,
  name: 'Enmity',
  icon: 'https://files.enmity.app/icon.png'
};

try {
  initialize();
} catch (e) {
  console.error('Failed to patch commands: ', e.message);
}

function registerCommands(caller: string, cmds: Command[]): void {
  if (!caller || typeof caller !== 'string') {
    throw new TypeError('first argument caller must be of type string');
  } else if (!cmds || !Array.isArray(cmds)) {
    throw new TypeError('second argument cmds must be of type array');
  }

  for (const command of cmds) {
    // @ts-ignore
    command.__enmity = true;
    // @ts-ignore
    command.caller = caller;
  }

  commands.push(...cmds);
}

function unregisterCommands(caller: string): void {
  if (!caller || typeof caller !== 'string') {
    throw new TypeError('first argument caller must be of type string');
  }

  // @ts-ignore
  commands = commands.filter(c => c.caller !== caller);
}

function initialize() {
  Patcher.after(Commands, 'getBuiltInCommands', (_, __, res) => ([...res, ...commands.values()]));

  Patcher.after(Discovery, 'useApplicationCommandsDiscoveryState', (_, [, , , isChat], res) => {
    if (isChat !== false) return res;

    if (!res.discoverySections.find(d => d.key === section.id) && commands.length) {
      const cmds = [...commands.values()];

      res.discoveryCommands.push(...cmds);
      res.commands.push(...cmds.filter(cmd => !res.commands.some(e => e.name === cmd.name)));

      res.discoverySections.push({
        data: cmds,
        key: section.id,
        section,
      });

      res.sectionsOffset.push(commands.length);
    }

    if (!res.applicationCommandSections.find(s => s.id === section.id) && commands.length) {
      res.applicationCommandSections.push(section);
    }

    const index = res.discoverySections.findIndex(e => e.key === '-2');
    if (res.discoverySections[index]?.data) {
      const section = res.discoverySections[index];
      section.data = section.data.filter(c => !c.__enmity);

      if (section.data.length === 0) res.discoverySections.splice(index, 1);
    }
  });

  Patcher.after(Assets, 'getApplicationIconURL', (_, [props], res) => {
    if (props.id === 'enmity') {
      return section.icon;
    }
  });
}

export { registerCommands, unregisterCommands };
