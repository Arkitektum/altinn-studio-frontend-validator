const systemResourceKeys = ["pdfPreviewText", "appOwner", "appName"];

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
        let hasPdfPreviewText = false;
        let pdfPreviewTextIsEmpty = false;
        let hasAppOwner = false;
        let appOwnerIsEmpty = false;
        let hasAppName = false;
        let appNameIsEmpty = false;
        file?.resources?.forEach((resource) => {
            const isSystemResource = systemResourceKeys.includes(resource.id);
            if (!isSystemResource) {
                if (resourceIsUnused(resource, uploadedFiles)) {
                    warnings.push(`Resource "${resource.id}" is unused`);
                }
            } else {
                if (resource.id === "pdfPreviewText") {
                    hasPdfPreviewText = true;
                    pdfPreviewTextIsEmpty = resource.value === "";
                } else if (resource.id === "appOwner") {
                    hasAppOwner = true;
                    appOwnerIsEmpty = resource.value === "";
                } else if (resource.id === "appName") {
                    hasAppName = true;
                    appNameIsEmpty = resource.value === "";
                }
            }
        });
        if (!hasPdfPreviewText) {
            errors.push(
                'Resource with id "pdfPreviewText" is missing and will be replaced with a default value'
            );
        } else if (pdfPreviewTextIsEmpty) {
            warnings.push(
                'Resource with id "pdfPreviewText" is empty and will maybe be replaced with a default value'
            );
        }
        if (!hasAppOwner) {
            errors.push(
                'Resource with id "appOwner" is missing and is required'
            );
        } else if (appOwnerIsEmpty) {
            warnings.push('Resource with id "appOwner" is empty');
        }
        if (!hasAppName) {
            errors.push(
                'Resource with id "appName" is missing and is required'
            );
        } else if (appNameIsEmpty) {
            warnings.push('Resource with id "appName" is empty');
        }
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
                                            `Resource binding for the key "${resourceBinding}" in "${layoutComponent.id}" is missing in file "${resourceFileName}"`
                                        );
                                    }
                                }
                            );
                        } else if (isEmpty) {
                            infos.push(
                                `Resource binding for key "${key}" in "${layoutComponent.id}" is empty`
                            );
                        } else {
                            warnings.push(
                                `Resource binding for key "${key}" in "${layoutComponent.id}" is not a valid resource ID or has a fixed value`
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
                        const resourceBindingKey =
                            layoutComponent.textResourceBindings[key];
                        if (resourceBindingKey === resource.id) {
                            isUnused = false;
                            return;
                        }
                    }
                );
        });
    });
    return isUnused;
}
