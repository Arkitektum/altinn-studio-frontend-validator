import texts from "../resources/texts.js";

export function getResourceText(resourceKey) {
    return texts?.[resourceKey] || resourceKey;
}

export function getValueFromDataKey(data, dataKey) {
    if (!dataKey) {
        return data;
    }
    const path = dataKey?.split(/\.|\[|\]/).filter(Boolean);
    for (let i = 0; i < path.length; i++) {
        const consolidatedPath = path.slice(i).join(".");
        if (data[consolidatedPath] !== undefined) {
            data = data[consolidatedPath];
            break;
        } else {
            data = data[path[i]];
        }
    }
    return data;
}
