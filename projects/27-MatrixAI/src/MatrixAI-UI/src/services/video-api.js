import webconfig from "../webconfig";

function request(url, options = {}) {
  url = webconfig.videoApiUrl + url;
  if (!options.method) options.method = "get";
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export function getFileState(filehash) {
  return request("/file-state/" + filehash);
}
