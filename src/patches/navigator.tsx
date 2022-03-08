import { showDialog } from '../api/dialog';
import { reloadDiscord } from '../api/native';
import { getModule, getModules } from '../utils/modules';
import { create } from '../utils/patcher';

console.log("cum");

function patchNavigator() {
  const Patcher = create('NaviagtorPatch');
  const Navigator = getModule(m => m.LeftButtonWithChevron);

  console.log("no bitches?");

  Patcher.after(Navigator, "default", (_, args, res) => {
    console.log(args);
    console.log(res);
  });

  Patcher.before(Navigator.Navigator.childContextTypes, "pushScene", (_, args, res) => {
    console.log(args);
    console.log(res);
  });

  /*Patcher.after(Navigator.Navigator.childContextTypes, "hasScene", (_, args, res) => {
    console.log(args);
    console.log(res);
  });

  Patcher.after(Navigator.Navigator.childContextTypes, "getScene", (_, args, res) => {
    console.log(args);
    console.log(res);
  });

  Patcher.after(Navigator.Navigator.childContextTypes, "checkScene", (_, args, res) => {
    console.log(args);
    console.log(res);
  });*/
}

export {
  patchNavigator
}