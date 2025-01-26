import { init } from "./scripts/init.js";

const uploadedFiles = {
    resourceFiles: {},
    layoutFiles: {},
};

window.onload = function () {
    init(uploadedFiles, validationResults);
};
