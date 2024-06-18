const DownloadButton = ({ url, className }) => {
  const getFileName = (url) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  const handleDownload = (e) => {
    e.preventDefault();
    const fileName = getFileName(url);

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl); // Clean up URL.createObjectURL reference
      })
      .catch((error) => console.error("Download error:", error));
  };

  return (
    <button
      onClick={handleDownload}
      className={className ? className : `btn btn-outline-primary`}
    >
      Download
    </button>
  );
};

export default DownloadButton;
