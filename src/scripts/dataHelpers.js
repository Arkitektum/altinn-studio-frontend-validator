export function removeFileExtension(fileName) {
    return fileName.replace(/\.[^/.]+$/, "");
}

export function generateObjectWithKeys(keys, value) {
    return keys.reduce((acc, key) => {
        acc[key] = value;
        return acc;
    }, {});
}

export function batchProcess(items, processFunction) {
    return items.map((item) => processFunction(item));
}
