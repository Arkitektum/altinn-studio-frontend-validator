import { onFileUploadChange } from "./fileHandlers.js";

export function handleFileDropzoneOnDrop(event, uploadedFiles, fileType) {
    event.preventDefault();
    const dropzoneElement = event.target;
    dropzoneElement.innerHTML = "";
    dropzoneElement.classList.remove("drag-over");
    onFileUploadChange(event, fileType, uploadedFiles);
    dropzoneElement.appendChild(
        renderUploadedFilesList(event.dataTransfer.files)
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
    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const fileElement = document.createElement("li");
        fileElement.classList.add("file");
        fileElement.textContent = file.name;
        uploadedFilesListElement.appendChild(fileElement);
    }
    return uploadedFilesListElement;
}
