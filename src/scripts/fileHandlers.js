export function onFileUploadChange(event, type, uploadedFiles) {
    const files = event.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedFiles[type][file.name] = JSON.parse(event.target.result);
        };
        reader.readAsText(file);
    }
}
