import { onFileUploadChange } from "./fileHandlers.js";
import { validateFiles } from "./validations.js";

export function init(uploadedFiles, validationResults) {
    document
        .getElementById("resourceFilesUpload")
        .addEventListener("change", (event) =>
            onFileUploadChange(event, "resourceFiles", uploadedFiles)
        );
    document
        .getElementById("layoutFilesUpload")
        .addEventListener("change", (event) =>
            onFileUploadChange(event, "layoutFiles", uploadedFiles)
        );
    document
        .getElementById("validateButton")
        .addEventListener("click", (event) =>
            validateFiles(event, uploadedFiles, validationResults)
        );
}
