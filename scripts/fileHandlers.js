const files = {
    resourceFiles: {},
    layoutFiles: {}
};

function onFileUploadChange(event, type) {
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        var reader = new FileReader();
        reader.onload = (event) => onReaderLoad(event, type, file.name);
        reader.readAsText(file);
    }
}

function onReaderLoad(event, type, name) {
    files[type][name] = JSON.parse(event.target.result);
    console.log({ files });
}

window.onload = function () {
    document
        .getElementById("resourceFilesUpload")
        .addEventListener("change", (event) => onFileUploadChange(event, "resources"));
};
