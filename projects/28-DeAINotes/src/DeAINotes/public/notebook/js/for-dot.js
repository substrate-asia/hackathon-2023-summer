const dot = {
    login,
    uploadFile,
};

async function login() {
  if (!window.top.uploadFile) {
    return console.log("!window.web3Enable");
  }
  let json = {
    txt: "发哥测试" + new Date().valueOf(),
  };
  let fileName = "a.json";
  let url = "https://d.cess.cloud/" + fileName;
  let result = await window.top.uploadFile(url, fileName, json);
  console.log(result);
}
function uploadFile(apiUrl, filename, json) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([JSON.stringify(json)], { type: "text/plain" });
    let textFile = new File([blob], filename, { type: "text/plain" });

    // Add the text file to FormData
    const formData = new FormData();
    formData.append("file", textFile);

    // Upload the file using AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve("File uploaded successfully");
      } else if (xhr.readyState === 4) {
        reject("File upload failed");
      }
    };
    xhr.send(formData);
  });
}
