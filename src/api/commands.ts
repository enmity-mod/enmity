import { ApplicationCommandInputType, ApplicationCommandType, Command } from 'enmity/api/commands';
import { getByProps } from '@metro';
import { create } from '@patcher';

const Patcher = create('enmity-commands');
const Commands = getByProps('getBuiltInCommands');
const sectionId = 'enmity';

let commands: Command[] = [];

try {
    initialize();
} catch (e) {
    console.error('Failed to patch commands: ', e.message);
}

export function registerCommands(caller: string, cmds: Command[]): void {
    if (!caller || typeof caller !== 'string') {
        throw new TypeError('first argument caller must be of type string');
    } else if (!cmds || !Array.isArray(cmds)) {
        throw new TypeError('second argument cmds must be of type array');
    }

    for (const command in cmds) {
        let builtInCommands: Command[] = Commands.getBuiltInCommands([ApplicationCommandType.Chat], true, false);
        // Fall back to old non-array-wrapped behavior on < 243.0
        if (!builtInCommands.length) {
            builtInCommands = Commands.getBuiltInCommands(ApplicationCommandType.Chat, true, false);
        }
        builtInCommands.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        const lastCommand = builtInCommands[builtInCommands.length - 1];
        const cmd = cmds[command];

        cmds[command] = {
            displayName: cmd.name,
            displayDescription: cmd.description,
            type: ApplicationCommandType.Chat,
            inputType: ApplicationCommandInputType.BuiltIn,
            id: `${parseInt(lastCommand.id, 10) - 1}`,
            applicationId: sectionId,
            ...cmd,

            // @ts-ignore
            __enmity: true,
            caller
        };
    }

    commands.push(...cmds);
}

export function unregisterCommands(caller: string): void {
    if (!caller || typeof caller !== 'string') {
        throw new TypeError('first argument caller must be of type string');
    }

    // @ts-ignore
    commands = commands.filter(c => c.caller !== caller);
}

function initialize() {
    Patcher.after(Commands, 'getBuiltInCommands', (_, [type], res) => {
        if (type === ApplicationCommandType.Chat) return [...res, ...commands];
    });
}
