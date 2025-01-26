import texts from "../resources/texts.js";

export function getResourceText(resourceKey) {
    return texts?.[resourceKey] || resourceKey;
}
