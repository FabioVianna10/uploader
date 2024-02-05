import styles from "../src/styles/uploader.module.css";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Uploader() {
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);

      setFiles((prevFiles) => [
        ...prevFiles,
        ...selectedFiles.map((file) => ({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type: file.type,
          date: new Date().toLocaleDateString(),
          file: file,
        })),
      ]);
    }
  };

  const handleRemove = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleDownload = async (id) => {
    try {
      const fileToDownload = files.find((file) => file.id === id);

      if (!fileToDownload) {
        console.error("Arquivo não encontrado para download");
        return;
      }

      const formData = new FormData();
      formData.append("file", fileToDownload.file);

      try {
        const response = await axios.post(
          "{Formeezy-Endpoint}/download",
          formData,
          {
            responseType: "arraybuffer",
          }
        );

        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileToDownload.name;
        link.click();
      } catch (error) {
        console.error("Erro ao realizar o download:", error);
      }
    } catch (error) {
      console.error("Erro ao processar o arquivo para download:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowFiles(true);

    /*const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file.file);
    });

    try {
      const response = await axios.post("{Formeezy-Endpoint}", formData);
      const { data } = response;
      const { redirect } = data;
      window.location.href = redirect;
    } catch (error) {
      window.location.href = error.response.data.redirect;
    }*/
  };

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <Image
          src="/cloud-arrow-up-fill.svg"
          width={100}
          height={100}
          alt="cloud_icon"
        />
        <h1 className={styles.title}>Upload your files here!</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.containerInp}>
            <input
              className={styles.inp}
              type="file"
              accept=".xml"
              onChange={handleChange}
              multiple={true}
            />
            <button className={styles.inp2} type="submit">
              Upload
            </button>
          </div>
        </form>

        {showFiles && (
          <>
            {files.map((file, index) => (
              <div className={styles.containerList} key={index}>
                <div className={styles.listDiv}>
                  <div>
                    <div>
                      <div className={styles.divTableCell}>{file.index}</div>
                      <div className={styles.divTableCell}>{file.date}</div>
                      <div className={styles.divTableCell}>{file.name}</div>
                    </div>
                  </div>
                </div>
                <button
                  className={styles.btn}
                  onClick={() => handleRemove(file.id)}
                >
                  <Image
                    src="/trash3.svg"
                    width={20}
                    height={17}
                    alt="trash icon"
                  />
                </button>
                <button
                  className={styles.btn2}
                  onClick={() => handleDownload(file.id)}
                >
                  <Image
                    src="/cloud-arrow-down-fill.svg"
                    width={18}
                    height={18}
                    alt="trash icon"
                  />
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
