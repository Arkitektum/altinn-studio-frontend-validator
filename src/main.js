import { init } from "./scripts/init.js";

const uploadedFiles = {
    resourceFiles: {},
    layoutFiles: {},
};

window.onload = function () {
    init(uploadedFiles, validationResults);
};

function dragOverHandler(event) {
    event.preventDefault();
    const dropzone = document.querySelector(".dropzone");
    dropzone.classList.add("dragging_over");
}

function dragLeaveHandler(event) {
    event.preventDefault();
    const dropzone = document.querySelector(".dropzone");
    dropzone.classList.remove("dragging_over");
}
