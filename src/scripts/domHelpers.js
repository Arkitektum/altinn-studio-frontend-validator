import { getResourceText } from "./resourceHelpers.js";

export function renderValidationResults(validationResults) {
    const validationResultsElement =
        document.getElementById("validationResults");
    validationResultsElement.innerHTML = "";
    const fileTypesElement = renderFileTypes(validationResults);
    validationResultsElement.appendChild(fileTypesElement);
}

function renderFileTypes(validationResults) {
    const fileTypes = Object.keys(validationResults);
    const fileTypesElement = document.createElement("div");
    fileTypesElement.classList.add("filetypes");
    fileTypes.forEach((fileTypeKey) => {
        const filetype = validationResults[fileTypeKey];
        const fileTypeElement = renderFileType(fileTypeKey, filetype);
        fileTypesElement.appendChild(fileTypeElement);
        const notLastFileType =
            fileTypes.indexOf(fileTypeKey) < fileTypes.length - 1;
        if (notLastFileType) {
            const separatorElement = document.createElement("hr");
            fileTypesElement.appendChild(separatorElement);
        }
    });
    return fileTypesElement;
}

function renderFileType(fileTypeKey, filetype) {
    const fileTypeElement = document.createElement("details");
    fileTypeElement.classList.add("filetype");
    fileTypeElement.open = true;

    const summaryElement = document.createElement("summary");
    summaryElement.textContent = `${getResourceText(fileTypeKey)} (${
        Object.keys(filetype).length
    })`;
    summaryElement.style.setProperty("--indent", 0);

    fileTypeElement.appendChild(summaryElement);

    fileTypeElement.appendChild(renderFiles(filetype));

    return fileTypeElement;
}

function renderFiles(fileType) {
    const files = Object.keys(fileType);
    const filesElement = document.createElement("div");
    filesElement.classList.add("files");
    files.forEach((fileKey) => {
        const file = fileType[fileKey];
        const fileElement = renderFile(fileKey, file);
        filesElement.appendChild(fileElement);
    });
    return filesElement;
}

function renderFile(fileKey, file) {
    const fileElement = document.createElement("details");
    fileElement.classList.add("file");
    fileElement.open = true;

    let hasValidationMessages = false;
    Object.keys(file).forEach((validationTypeKey) => {
        if (file[validationTypeKey].length) {
            hasValidationMessages = true;
        }
    });
    if (!hasValidationMessages) {
        fileElement.classList.add("noValidationMessages");
    } else {
        fileElement.classList.add("hasValidationMessages");
    }

    const summaryElement = document.createElement("summary");
    summaryElement.textContent = fileKey;
    summaryElement.style.setProperty("--indent", 1);

    fileElement.appendChild(summaryElement);

    fileElement.appendChild(renderValidationTypes(file));

    return fileElement;
}

function renderValidationTypes(file) {
    const validationTypes = Object.keys(file);
    const validationTypesElement = document.createElement("div");
    validationTypesElement.classList.add("validationTypes");
    validationTypes.forEach((validationTypeKey) => {
        const validationType = file[validationTypeKey];
        if (!!validationType.length) {
            const validationTypeElement = renderValidationType(
                validationTypeKey,
                validationType
            );
            validationTypesElement.appendChild(validationTypeElement);
        }
    });
    return validationTypesElement;
}

function renderValidationType(validationTypeKey, validationType) {
    const validationTypeElement = document.createElement("details");
    validationTypeElement.classList.add("validationType");
    validationTypeElement.classList.add(validationTypeKey);
    validationTypeElement.open = true;

    const summaryElement = document.createElement("summary");
    summaryElement.textContent = `${getResourceText(validationTypeKey)} (${
        validationType.length
    })`;
    summaryElement.style.setProperty("--indent", 2);

    validationTypeElement.appendChild(summaryElement);

    validationTypeElement.appendChild(renderValidationMessages(validationType));

    return validationTypeElement;
}

function renderValidationMessages(validationType) {
    const validationMessages = validationType;
    const validationMessagesElement = document.createElement("div");
    validationMessagesElement.classList.add("validationMessages");
    validationMessages.forEach((validationMessage) => {
        const validationMessageElement =
            renderValidationMessage(validationMessage);
        validationMessagesElement.appendChild(validationMessageElement);
    });
    return validationMessagesElement;
}

function renderValidationMessage(validationMessage) {
    const validationMessageElement = document.createElement("div");
    validationMessageElement.classList.add("validationMessage");
    validationMessageElement.textContent = validationMessage;
    validationMessageElement.style.setProperty("--indent", 3);

    return validationMessageElement;
}
