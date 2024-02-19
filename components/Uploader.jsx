import styles from "../src/styles/uploader.module.css";
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Uploader() {
  const [files, setFiles] = useState([]);
  const [showFiles, setShowFiles] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let endPoint =
        "http://localhost:8080/net.fabio.uploader/api/files/getAll";
      try {
        const response = await axios.get(endPoint);
        setFiles(response.data);
        setShowFiles(true);
      } catch (error) {
        console.error("Erro ao obter arquivos:", error);
      }
    };
    fetchData();
  }, []);

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
      const response = await axios.get(
        `http://localhost:8080/api/files/download/${files.id}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = files.name;
      link.click();
    } catch (error) {
      console.error("Erro ao realizar o download:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowFiles(true);

    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`file${index + 1}`, file.file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/files/upload",
        formData
      );
      console.log("Arquivo(s) enviado(s) com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao enviar arquivo(s):", error);
    }
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
        <form onSubmit={(e) => e.preventDefault()}>
          <div className={styles.containerInp}>
            <input
              className={styles.inp}
              type="file"
              accept=".xml"
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
                    <div className={styles.divTableCell}>{index + 1}</div>
                    <div className={styles.divTableCell}>{file.cUF}</div>
                    <div className={styles.divTableCell}>{file.desxNome}</div>
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
                  onClick={() => handleDownload(file.id, file.name)}
                >
                  <Image
                    src="/cloud-arrow-down-fill.svg"
                    width={18}
                    height={18}
                    alt="download icon"
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
