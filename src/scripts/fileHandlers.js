export function onFileUploadChange(event, type, uoloadedFiles) {
    const files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
            uoloadedFiles[type][file.name] = JSON.parse(event.target.result);
        };
        reader.readAsText(file);
    }
}
