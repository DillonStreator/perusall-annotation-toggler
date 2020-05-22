// ==UserScript==
// @name PerusallAnnotationToggler
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Add button to toggle annotations
// @author Dillon Streator
// @license MIT
// @match https://app.perusall.com/courses
// @grant none
// ==/UserScript==

(() => {
    let hiding = false;
    let timeout = 5000;
    let timer = 0;
    let intervalTime = 10;
    const HIDDEN_TEXT = "Show annotations";
    const SHOWN_TEXT = "Hide annotations";
    const UUID = "94433d8f-1bfb-499c-aa8c-c4b87c0f954f";
    const ANNOTATION_CLASSES = ['existing-annotation', 'public-annotation', 'text-selection', 'needsclick']
    const ANNOTATION_SELECTOR = `span.${ANNOTATION_CLASSES.join(".")}`;

    const toggler = document.createElement("button");
    toggler.style.position = "absolute";
    toggler.style.bottom = "15px";
    toggler.style.right = "100px";

    document.body.appendChild(toggler);
    let elements = [];
    const extractElements = () => {
        const newElements = Array.from(document.querySelectorAll(ANNOTATION_SELECTOR)).filter(el => !el.classList.contains(UUID)).map(el => {
            el.classList.add(UUID);
            return el;
        });
        
        if (!newElements.length) return false;
        elements = [...elements, ...newElements];
        return true;
    }
    const toggleVisibility = () => {
        toggler.innerHTML = hiding ? HIDDEN_TEXT : SHOWN_TEXT;
        elements.forEach(e => {
            if (hiding) {
                e.classList.remove(...ANNOTATION_CLASSES);
            }
            else {
                e.classList.add(...ANNOTATION_CLASSES);
            }
        });
    }
    extractElements();
    toggleVisibility();
    document.querySelector('#viewer-container').addEventListener("scroll", () => {
        extractElements();
        toggleVisibility();
        timer = 0;
    });


    setInterval(() => {
        if (timer > timeout) return;
        timer += intervalTime;

        const didFindElements = extractElements();
        toggleVisibility();
        if (didFindElements) timer += timeout;
    }, intervalTime);

    toggler.addEventListener("click", () => {
        hiding = !hiding;
        toggleVisibility();
    });
      
})();