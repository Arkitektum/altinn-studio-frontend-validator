import {
    batchProcess,
    generateObjectWithKeys,
    removeFileExtension,
} from "./dataHelpers.js";
import { getValueFromDataKey } from "./resourceHelpers.js";

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

function validateLayoutResourceBinding(
    uploadedFiles,
    validationMessages,
    layoutComponent,
    key
) {
    const resourceBinding = getValueFromDataKey(layoutComponent, key);
    const isResourceId = resourceBinding.startsWith("resource.");
    const isEmpty = resourceBinding === "";
    if (isResourceId) {
        const isMissingInFile = resourceIsMissing(
            resourceBinding,
            uploadedFiles
        );
        Object.keys(isMissingInFile).forEach((resourceFileName) => {
            if (isMissingInFile[resourceFileName]) {
                validationMessages.errors.push(
                    `Resource binding "${resourceBinding}" for key "${key}" in "${layoutComponent.id}" is missing in file "${resourceFileName}"`
                );
            }
        });
    } else if (isEmpty) {
        validationMessages.infos.push(
            `Resource binding for key "${key}" in "${layoutComponent.id}" is empty`
        );
    } else {
        validationMessages.warnings.push(
            `Resource binding "${resourceBinding}" for key "${key}" in "${layoutComponent.id}" is not a valid resource ID or has a fixed value`
        );
    }
}

function validateFile(file, type, uploadedFiles) {
    const validationMessages = {
        errors: [],
        warnings: [],
        infos: [],
    };
    if (type === "resourceFiles") {
        let hasPdfPreviewText = false;
        let pdfPreviewTextIsEmpty = false;
        let hasAppOwner = false;
        let appOwnerIsEmpty = false;
        let hasAppName = false;
        let appNameIsEmpty = false;
        const pageTitleResourceKeys = batchProcess(
            Object.keys(uploadedFiles?.layoutFiles),
            removeFileExtension
        );
        const hasPageTitles = generateObjectWithKeys(
            pageTitleResourceKeys,
            false
        );
        file?.resources?.forEach((resource) => {
            const isSystemResource = systemResourceKeys.includes(resource.id);
            const isPageTitleResource = pageTitleResourceKeys.includes(
                resource.id
            );
            if (!isSystemResource && !isPageTitleResource) {
                if (resourceIsUnused(resource, uploadedFiles)) {
                    validationMessages.warnings.push(
                        `Resource "${resource.id}" is unused`
                    );
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
                } else if (isPageTitleResource) {
                    hasPageTitles[resource.id] = true;
                }
            }
        });
        if (!hasPdfPreviewText) {
            validationMessages.errors.push(
                'Resource with id "pdfPreviewText" is missing and will be replaced with a default value'
            );
        } else if (pdfPreviewTextIsEmpty) {
            validationMessages.warnings.push(
                'Resource with id "pdfPreviewText" is empty and will maybe be replaced with a default value'
            );
        }
        if (!hasAppOwner) {
            validationMessages.errors.push(
                'Resource with id "appOwner" is missing and is required'
            );
        } else if (appOwnerIsEmpty) {
            validationMessages.warnings.push(
                'Resource with id "appOwner" is empty'
            );
        }
        if (!hasAppName) {
            validationMessages.errors.push(
                'Resource with id "appName" is missing and is required'
            );
        } else if (appNameIsEmpty) {
            validationMessages.warnings.push(
                'Resource with id "appName" is empty'
            );
        } else if (Object.values(hasPageTitles).includes(false)) {
            Object.keys(hasPageTitles).forEach((pageTitleResourceKey) => {
                if (!hasPageTitles[pageTitleResourceKey]) {
                    validationMessages.warnings.push(
                        `Page title resource with id "${pageTitleResourceKey}" is missing`
                    );
                }
            });
        }
    } else if (type === "layoutFiles") {
        file?.data?.layout?.forEach((layoutComponent) => {
            layoutComponent?.textResourceBindings &&
                Object.keys(layoutComponent.textResourceBindings).forEach(
                    (key) => {
                        validateLayoutResourceBinding(
                            uploadedFiles,
                            validationMessages,
                            layoutComponent,
                            `textResourceBindings.${key}`
                        );
                    }
                );
            layoutComponent?.options &&
                layoutComponent.options.forEach((option, optionIndex) => {
                    if (option.label) {
                        validateLayoutResourceBinding(
                            uploadedFiles,
                            validationMessages,
                            layoutComponent,
                            `options[${optionIndex}].label`
                        );
                    }
                });
        });
    }
    return validationMessages;
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
    let isUnused = {
        textResourceBindings: true,
        options: true,
    };
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
            layoutComponent?.options &&
                layoutComponent.options.forEach((option) => {
                    const resourceBindingKey = option.label;
                    if (resourceBindingKey === resource.id) {
                        isUnused = false;
                        return;
                    }
                });
        });
    });
    return isUnused.textResourceBindings && isUnused.options;
}
