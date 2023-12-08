import { Toasts } from "@metro/common";
import { uuid } from "@utilities";
import { create } from "@patcher";

const Patcher = create('toasts-fix');

export default () => {
    Patcher.before(Toasts, 'open', (_, args) => {
        const [{ key, source }] = args;
        if (!key) args[0].key = uuid();

        if (source) {
            args[0].icon = source;
            delete args[0].source;
        }
    })
};