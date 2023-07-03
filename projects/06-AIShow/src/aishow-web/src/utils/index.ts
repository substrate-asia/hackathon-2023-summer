// downloadFile(getImageUrl.link.replace('d.cess.cloud','/api'),info.file.name)
export const downloadFile = (url:string,name:string) => {
  const desiredFileName = name; // 你希望的文件名
  fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // 创建一个虚拟的链接元素
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob);
        downloadElement.href = href;
        downloadElement.download = desiredFileName;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
      })
      .catch((error) => {
        console.error('Download failed：', error);
      });
}

// 下载 str:下载的内容  name:下载文件的名称
export const downloadRequest = (str:any,name:string)=>{
  const url = window.URL.createObjectURL(str);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}`;
  a.click();
  a.remove();
}

