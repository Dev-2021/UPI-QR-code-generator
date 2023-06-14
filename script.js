"use strict";

const dom = {
  inputName: document.querySelector(".input-name"),
  inputVPA: document.querySelector(".input-vpa"),
  inputAmount: document.querySelector(".input-amount"),
  inputNote: document.querySelector(".input-note"),
  btnSubmit: document.querySelector(".btn-submit"),
  qrImg: document.querySelector(".qr-img"),
  merchantNameText: document.querySelector(".merchantName-text"),
  vpaText: document.querySelector(".vpa-text"),
  download: document.querySelector(".download"),
  error: document.querySelector(".error"),
};

const values = {
  size: 220,
};

function updateTextContent(input, textElement, defaultText) {
  input.addEventListener("keyup", function () {
    textElement.textContent = this.value || defaultText;
  });
}

updateTextContent(dom.inputName, dom.merchantNameText, "Merchant Name");
updateTextContent(dom.inputVPA, dom.vpaText, "payee@bank");

const UPI = function (v) {
  const googleQR = `https://chart.googleapis.com/chart?cht=qr&choe=UTF-8&chld=H`;
  const UPIData = `upi://pay?pn=${v.merchantName}&pa=${v.vpa}&am=${
    v.amount ? v.amount : ""
  }&tn=${v.note}`;
  return `${googleQR}&chs=${v.size}x${v.size}&chl=${encodeURIComponent(
    UPIData
  )}`;
};

function validateAndStyleInput(inputElement) {
  if (!inputElement.value) {
    inputElement.style.border = "2px solid red";
    dom.error.style.display = "block";
    dom.error.textContent = "Please fill the required fields";

    setTimeout(() => {
      dom.error.style.display = "none";
    }, 1000 * 10);
  } else {
    inputElement.style.border = "none";
  }
}

dom.btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  //validate and style form fields
  validateAndStyleInput(dom.inputName);
  validateAndStyleInput(dom.inputVPA);

  values.merchantName = dom.inputName.value;
  values.vpa = dom.inputVPA.value;
  values.amount = Number(dom.inputAmount.value);
  values.note = dom.inputNote.value;
  let QRImg = UPI(values);
  console.log(QRImg);
  dom.qrImg.setAttribute("src", QRImg);
  // Add a click event listener to the download button

  const downloadButton = document.querySelector(".download-button");
  downloadButton.classList.remove("hidden");
  downloadButton.addEventListener("click", downloadDivAsImage);
});

// Select the div element you want to capture
const divToCapture = document.querySelector(".card");

// Function to download the captured div as an image
function downloadDivAsImage() {
  // Use dom-to-image to render the div element as a data URL
  domtoimage
    .toPng(divToCapture, {
      bgcolor: "white", // Set the background color of the image
      quality: 1, // Set the image quality (0 to 1)
    })
    .then((dataURL) => {
      // Create a temporary anchor element to download the image
      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = `UPI-QR.png`;

      // Trigger the download by clicking the anchor element
      downloadLink.click();
    })
    .catch((error) => {
      console.error("Error capturing div as image:", error);
    });
}
