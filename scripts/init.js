window.onload = function () {
    document
        .getElementById("resourceFilesUpload")
        .addEventListener("change", (event) => onFileUploadChange(event, "resourceFiles"));
    document
        .getElementById("layoutFilesUpload")
        .addEventListener("change", (event) => onFileUploadChange(event, "layoutFiles"));
    document.getElementById("validateButton").addEventListener("click", (event) => validateFiles(event));
};
