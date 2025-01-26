import { renderValidationResults } from "./domHelpers.js";
import {
    handleFileDropzoneOnDragLeave,
    handleFileDropzoneOnDragOver,
    handleFileDropzoneOnDrop,
} from "./fileDropzoneHelpers.js";
import { validateFiles } from "./validations.js";

export function init(uploadedFiles) {
    const resourceFilesDropzoneElement = document.getElementById(
        "resourceFilesDropzone"
    );
    const layoutFilesDropzoneElement = document.getElementById(
        "layoutFilesDropzone"
    );
    const validateButtonElement = document.getElementById("validateButton");

    resourceFilesDropzoneElement.addEventListener("drop", (event) => {
        handleFileDropzoneOnDrop(event, uploadedFiles, "resourceFiles");
    });
    resourceFilesDropzoneElement.addEventListener("dragover", (event) => {
        handleFileDropzoneOnDragOver(event);
    });
    resourceFilesDropzoneElement.addEventListener("dragleave", (event) => {
        handleFileDropzoneOnDragLeave(event);
    });

    layoutFilesDropzoneElement.addEventListener("drop", (event) => {
        handleFileDropzoneOnDrop(event, uploadedFiles, "layoutFiles");
    });
    layoutFilesDropzoneElement.addEventListener("dragover", (event) => {
        handleFileDropzoneOnDragOver(event);
    });
    layoutFilesDropzoneElement.addEventListener("dragleave", (event) => {
        handleFileDropzoneOnDragLeave(event);
    });

    validateButtonElement.addEventListener("click", () => {
        const validationResults = validateFiles(uploadedFiles);
        renderValidationResults(validationResults);
    });
}
