import { onFileUploadChange } from "./fileHandlers.js";

export async function handleFileDropzoneOnDrop(event, uploadedFiles, fileType) {
    event.preventDefault();
    const dropzoneElement = event.target;
    dropzoneElement.innerHTML = "";
    dropzoneElement.classList.remove("drag-over");
    uploadedFiles = await onFileUploadChange(event, fileType, uploadedFiles);
    dropzoneElement.appendChild(
        renderUploadedFilesList(uploadedFiles[fileType])
    );
}

export function handleFileDropzoneOnDragOver(event) {
    event.preventDefault();
    const dropzoneElement = event.target;
    dropzoneElement.classList.add("drag-over");
}

export function handleFileDropzoneOnDragLeave(event) {
    event.preventDefault();
    const dropzoneElement = event.target;
    dropzoneElement.classList.remove("drag-over");
}

function renderUploadedFilesList(files) {
    const uploadedFilesListElement = document.createElement("ul");
    uploadedFilesListElement.classList.add("file-list");
    Object.keys(files).forEach((fileName) => {
        const file = files[fileName];
        const fileElement = document.createElement("li");
        fileElement.classList.add("file");
        const fileNameElement = document.createElement("span");
        fileNameElement.textContent = fileName;
        fileElement.appendChild(fileNameElement);
        if (file.errors?.length) {
            fileElement.classList.add("has-errors");
            const errorListElement = renderUploadedFilesErrorList(file.errors);
            fileElement.appendChild(errorListElement);
        }
        uploadedFilesListElement.appendChild(fileElement);
    });
    return uploadedFilesListElement;
}

function renderUploadedFilesErrorList(errors) {
    const errorListElement = document.createElement("ul");
    errorListElement.classList.add("error-list");
    errors.forEach((error) => {
        const errorElement = document.createElement("li");
        errorElement.classList.add("error");
        const errorLabelElement = document.createElement("span");
        errorLabelElement.classList.add("error-label");
        errorLabelElement.textContent = `${error.label}: `;
        const errorMessageElement = document.createElement("span");
        errorMessageElement.classList.add("error-message");
        errorMessageElement.textContent = error.message;
        errorElement.appendChild(errorLabelElement);
        errorElement.appendChild(errorMessageElement);
        errorListElement.appendChild(errorElement);
    });
    return errorListElement;
}
