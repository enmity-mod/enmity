import { getModuleByProps } from "../utils/modules";
import { create } from '../utils/patcher';

const Patcher = create("enmity-commands");

const Commands = getModuleByProps("getBuiltInCommands");
const Discovery = getModuleByProps("useApplicationCommandsDiscoveryState");
const Assets = getModuleByProps("getGuildTemplateIconURL");

let commands = [];

export const section = {
  id: "enmity",
  type: 1,
  name: "Enmity",
  icon: "https://files.enmity.app/icon.png"
};

Patcher.after(Commands, "getBuiltInCommands", (_, args, res) => {
  return [...res, ...commands.values()];
});

Patcher.after(Assets.default, "getApplicationIconURL", (_, [props], res) => {
  if (props.id === "enmity") {
    return section.icon;
  }
});


Patcher.after(Discovery, "useApplicationCommandsDiscoveryState", (_, [,,, isChat], res) => {
  if (isChat !== false) return res;

  if (!res.discoverySections.find(d => d.key == section.id) && commands.length) {
    const cmds = [...commands.values()];

    res.discoveryCommands.push(...cmds);
    res.commands.push(...cmds.filter(cmd => !res.commands.some(e => e.name === cmd.name)));

    res.discoverySections.push({
      data: cmds,
      key: section.id,
      section
    });

    res.sectionsOffset.push(commands.length);
  }

  if (!res.applicationCommandSections.find(s => s.id == section.id) && commands.length) {
    res.applicationCommandSections.push(section);
  }

  const index = res.discoverySections.findIndex(e => e.key === "-2");
  if (res.discoverySections[index]?.data) {
    const section = res.discoverySections[index];
    section.data = section.data.filter(c => !c.__enmity);

    if (section.data.length == 0) res.discoverySections.splice(index, 1);
  }
});

function registerCommands(caller, cmds) {
  cmds.map(c => {
    c.__enmity = true;
    c.caller = caller;
  });

  commands.push(...cmds);
}

function unregisterCommands(caller) {
  commands = commands.filter(c => c.caller != caller);
}

export {
  registerCommands,
  unregisterCommands
};