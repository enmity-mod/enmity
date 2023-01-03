import { ApplicationCommandInputType, ApplicationCommandType, Command } from 'enmity/api/commands';
import { filters, bulk } from '@metro';
import { create } from '@patcher';

const Patcher = create('enmity-commands');

const [
  Commands,
  Assets,
  SearchStore
] = bulk(
  filters.byProps('getBuiltInCommands'),
  filters.byProps('getApplicationIconURL'),
  m => m.default?.getQueryCommands && m.useDiscoveryState
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

  for (const command in cmds) {
    const cmd = cmds[command];
    cmds[command] = {
      displayName: cmd.name,
      displayDescription: cmd.description,
      type: ApplicationCommandType.Chat,
      inputType: ApplicationCommandInputType.BuiltIn,
      id: `enmity-${cmd.name.replaceAll(' ', '-')}`,
      applicationId: section.id,
      ...cmd,
      // @ts-ignore
      __enmity: true,
      caller: caller
    };
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
  Commands.BUILT_IN_SECTIONS['enmity'] = section;

  try {
    Patcher.after(SearchStore.default, 'getQueryCommands', (_, [, , query], res) => {
      if (!query || query.startsWith('/')) return;
      res ??= [];

      for (const command of commands) {
        if (!~command.name?.indexOf(query) || res.some(e => e.__enmity && e.id === command.id)) {
          continue;
        }

        try {
          res.unshift(command);
        } catch {
          // Discord calls Object.preventExtensions on the result when switching channels
          // Therefore, re-making the result array is required.
          res = [...res, command];
        }
      }
    });
  } catch {
    console.error('Patching getQueryCommands failed.');
  }

  try {
    Patcher.instead(SearchStore.default, 'getApplicationSections', (_, args, orig) => {
      try {
        const res = orig.apply(self, args) ?? [];

        if (!res.find(r => r.id === section.id)) {
          res.push(section);
        };

        return res;
      } catch {
        return [];
      }
    });
  } catch {
    console.error('Patching getApplicationSections failed.');
  }

  try {
    Patcher.after(SearchStore, 'useDiscoveryState', (_, [, type], res) => {
      if (type !== 1) return;

      if (!res.sectionDescriptors?.find?.(s => s.id === section.id)) {
        res.sectionDescriptors ??= [];
        res.sectionDescriptors.push(section);
      }

      if ((!res.filteredSectionId || res.filteredSectionId === section.id) && !res.activeSections.find(s => s.id === section.id)) {
        res.activeSections.push(section);
      }

      if (commands.some(c => !res.commands?.find?.(r => r.id === c.id))) {
        res.commands ??= [];

        // De-duplicate commands
        const collection = [...res.commands, ...commands];
        res.commands = [...new Set(collection).values()];
      }

      if ((!res.filteredSectionId || res.filteredSectionId === section.id) && !res.commandsByActiveSection.find(r => r.section.id === section.id)) {
        res.commandsByActiveSection.push({
          section: section,
          data: commands
        });
      }

      const active = res.commandsByActiveSection.find(r => r.section.id === section.id);
      if ((!res.filteredSectionId || res.filteredSectionId === section.id) && active && active.data.length === 0 && commands.length !== 0) {
        active.data = commands;
      }

      /*
       * Filter out duplicate built-in sections due to a bug that causes
       * the getApplicationSections path to add another built-in commands
       * section to the section rail
       */

      const builtIn = res.sectionDescriptors.filter(s => s.id === '-1');
      if (builtIn.length > 1) {
        res.sectionDescriptors = res.sectionDescriptors.filter(s => s.id !== '-1');
        res.sectionDescriptors.push(builtIn.find(r => r.id === '-1'));
      }
    });
  } catch {
    console.error('Patching useDiscoveryState failed.');
  }

  try {
    Patcher.after(Assets, 'getApplicationIconURL', (_, [props], res) => {
      if (props.id === 'enmity') {
        return section.icon;
      }
    });
  } catch {
    console.error('Patching getApplicationIconURL failed.');
  }
}

export { registerCommands, unregisterCommands };
