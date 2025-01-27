export async function onFileUploadChange(event, type, uploadedFiles) {
    const files = event.target.files || event.dataTransfer.files;
    const promises = [];
    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const promise = new Promise((resolve, reject) => {
            reader.onload = (event) => {
                try {
                    uploadedFiles[type][file.name] = JSON.parse(
                        event.target.result
                    );
                    resolve();
                } catch (error) {
                    if (!uploadedFiles[type][file.name]) {
                        uploadedFiles[type][file.name] = {
                            errors: [],
                        };
                    }
                    if (!uploadedFiles[type][file.name].errors) {
                        uploadedFiles[type][file.name].errors = [];
                    }
                    uploadedFiles[type][file.name].errors.push({
                        label: "Error parsing file",
                        message: error,
                    });
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
        promises.push(promise);
    }

    return await Promise.all(promises)
        .then(() => {
            return uploadedFiles;
        })
        .catch((error) => {
            return uploadedFiles;
        });
}
