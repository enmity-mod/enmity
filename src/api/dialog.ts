import { getModule } from "../utils/modules";

const dialogModule = getModule((m) => m.default?.show);

function showDialog(options) {
  dialogModule.default.show(options);
}

export {
  showDialog
}