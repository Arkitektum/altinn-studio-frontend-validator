import { init } from "./scripts/init.js";

const uploadedFiles = {
    resourceFiles: {},
    layoutFiles: {},
};

const validationResults = {
    resourceFiles: {},
    layoutFiles: {},
};

window.onload = function () {
    init(uploadedFiles, validationResults);
};
