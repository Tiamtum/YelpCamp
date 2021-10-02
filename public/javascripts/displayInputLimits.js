const aboutTextArea = document.querySelector("#about");
const characterCountMessage = document.querySelector("#aboutHelp");
let characterCount=aboutTextArea.value.length;
const ratio = document.createTextNode(`${characterCount}/500`);
aboutTextArea.addEventListener("input",()=>{
    if(characterCount<500){
        characterCount = aboutTextArea.value.length;
        ratio.data = `${characterCount}/500`;
    }
    else
    {
        ratio.data = "Character limit (500) reached! You'll need to make it more breif!"
        characterCount = aboutTextArea.value.length;
    }
})
const span = document.createElement("span");
span.appendChild(ratio);
characterCountMessage.appendChild(span);
