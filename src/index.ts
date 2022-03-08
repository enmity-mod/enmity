import { prepareApi } from "./api";
import { applyPatches } from "./patches";
import { prepareWebsocket } from "./utils/websocket";
import { prepareCommands } from "./commands";
import "./utils/themes";

try {
  prepareApi();
  applyPatches();
  prepareWebsocket();
  prepareCommands();
} catch (error) {
  console.error(error);
}