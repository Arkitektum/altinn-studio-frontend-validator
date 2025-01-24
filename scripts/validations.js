const validationResults = {
    resourceFiles: {},
    layoutFiles: {}
};
function validateFiles() {
    Object.keys(files).forEach((type) => {
        const filesOfType = files[type];
        Object.keys(filesOfType).forEach((name) => {
            const file = filesOfType[name];
            const validationResult = validateFile(file, type);
            validationResults[type][name] = validationResult;
        });
    });
    document.getElementById("validationResults").innerText = JSON.stringify(validationResults, null, 2);
}

function validateFile(file, type) {
    const errors = [];
    const warnings = [];
    const infos = [];
    if (type === "resourceFiles") {
        file?.resources?.forEach((resource) => {
            if (resourceIsUnused(resource)) {
                warnings.push(`Resource "${resource.id}" is unused`);
            }
        });
    } else if (type === "layoutFiles") {
        file?.data?.layout?.forEach((layoutComponent) => {
            layoutComponent?.textResourceBindings &&
                Object.keys(layoutComponent.textResourceBindings).forEach((key) => {
                    const resourceBinding = layoutComponent.textResourceBindings[key];
                    console.log(resourceBinding);
                    const isResourceId = resourceBinding.startsWith("resource.");
                    const isEmpty = resourceBinding === "";
                    if (isResourceId) {
                        const isMissingInFile = resourceIsMissing(resourceBinding);
                        Object.keys(isMissingInFile).forEach((resourceFileName) => {
                            if (isMissingInFile[resourceFileName]) {
                                errors.push(`Resource "${resourceBinding}" is missing in file "${resourceFileName}"`);
                            }
                        });
                    } else if (isEmpty) {
                        infos.push(`Resource binding for key "${key}" is empty`);
                    } else {
                        warnings.push(
                            `Resource binding for key "${key}" is not a valid resource ID or has a fixed value`
                        );
                    }
                });
        });
    }
    return { errors, warnings, infos };
}

function resourceIsMissing(resourceId) {
    let isMissingInFile = {};
    Object.keys(files.resourceFiles).forEach((resourceFileName) => {
        const resourceFile = files.resourceFiles[resourceFileName];
        let isMissing = true;
        resourceFile?.resources?.forEach((resource) => {
            if (resource.id === resourceId) {
                isMissing = false;
                return;
            }
        });
        isMissingInFile[resourceFileName] = isMissing;
    });
    return isMissingInFile;
}

function resourceIsUnused(resource) {
    let isUnused = true;
    Object.keys(files.layoutFiles).forEach((layoutFileName) => {
        const layoutFile = files.layoutFiles[layoutFileName];
        const layoutComponents = layoutFile?.data?.layout;
        layoutComponents.forEach((layoutComponent) => {
            layoutComponent?.textResourceBindings &&
                Object.keys(layoutComponent.textResourceBindings).forEach((key) => {
                    if (layoutComponent.textResourceBindings[key] === resource.id) {
                        isUnused = false;
                        return;
                    }
                });
        });
    });
    return isUnused;
}
