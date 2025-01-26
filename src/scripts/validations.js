export function validateFiles(uploadedFiles) {
    const validationResults = {};
    Object.keys(uploadedFiles).forEach((type) => {
        const filesOfType = uploadedFiles[type];
        if (!validationResults[type]) {
            validationResults[type] = {};
        }
        Object.keys(filesOfType).forEach((name) => {
            const file = filesOfType[name];
            const validationResult = validateFile(file, type, uploadedFiles);
            validationResults[type][name] = validationResult;
        });
    });
    return validationResults;
}

function validateFile(file, type, uploadedFiles) {
    const errors = [];
    const warnings = [];
    const infos = [];
    if (type === "resourceFiles") {
        file?.resources?.forEach((resource) => {
            if (resourceIsUnused(resource, uploadedFiles)) {
                warnings.push(`Resource "${resource.id}" is unused`);
            }
        });
    } else if (type === "layoutFiles") {
        file?.data?.layout?.forEach((layoutComponent) => {
            layoutComponent?.textResourceBindings &&
                Object.keys(layoutComponent.textResourceBindings).forEach(
                    (key) => {
                        const resourceBinding =
                            layoutComponent.textResourceBindings[key];
                        const isResourceId =
                            resourceBinding.startsWith("resource.");
                        const isEmpty = resourceBinding === "";
                        if (isResourceId) {
                            const isMissingInFile = resourceIsMissing(
                                resourceBinding,
                                uploadedFiles
                            );
                            Object.keys(isMissingInFile).forEach(
                                (resourceFileName) => {
                                    if (isMissingInFile[resourceFileName]) {
                                        errors.push(
                                            `Resource "${resourceBinding}" is missing in file "${resourceFileName}"`
                                        );
                                    }
                                }
                            );
                        } else if (isEmpty) {
                            infos.push(
                                `Resource binding for key "${key}" is empty`
                            );
                        } else {
                            warnings.push(
                                `Resource binding for key "${key}" is not a valid resource ID or has a fixed value`
                            );
                        }
                    }
                );
        });
    }
    return { errors, warnings, infos };
}

function resourceIsMissing(resourceId, uploadedFiles) {
    let isMissingInFile = {};
    Object.keys(uploadedFiles.resourceFiles).forEach((resourceFileName) => {
        const resourceFile = uploadedFiles.resourceFiles[resourceFileName];
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

function resourceIsUnused(resource, uploadedFiles) {
    let isUnused = true;
    Object.keys(uploadedFiles.layoutFiles).forEach((layoutFileName) => {
        const layoutFile = uploadedFiles.layoutFiles[layoutFileName];
        const layoutComponents = layoutFile?.data?.layout;
        layoutComponents.forEach((layoutComponent) => {
            layoutComponent?.textResourceBindings &&
                Object.keys(layoutComponent.textResourceBindings).forEach(
                    (key) => {
                        if (
                            layoutComponent.textResourceBindings[key] ===
                            resource.id
                        ) {
                            isUnused = false;
                            return;
                        }
                    }
                );
        });
    });
    return isUnused;
}
