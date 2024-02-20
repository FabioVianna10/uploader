import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../src/styles/uploader.module.css";

export default function Uploader() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let endPoint =
        "http://localhost:8080/net.fabio.uploader/api/files/getAll";
      try {
        const response = await axios.get(endPoint);
        setFiles(response.data);
      } catch (error) {
        console.error("Erro ao obter arquivos:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setSelectedFiles(() => [...selectedFiles]);
    }
  };
  //const handleRemove = (id) => {
  //setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));};
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
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file); // Use 'file' como o nome do campo para enviar o arquivo
    });
    try {
      const response = await axios.post(
        "http://localhost:8080/net.fabio.uploader/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Arquivo(s) enviado(s) com sucesso:", response.data);
      setFiles(response.data);
      window.location.reload();
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.containerInp}>
            <input
              className={styles.inp}
              type="file"
              accept=".xml"
              multiple={true}
              onChange={handleChange}
            />
            <button className={styles.inp2} type="submit">
              Upload
            </button>
          </div>
        </form>
        {files.map((file, index) => (
          <div className={styles.containerList} key={index}>
            <div className={styles.divTable}>
              <div className={styles.listDiv}>
                <div className={styles.divTableCell}>{file.id}</div>
                <div className={styles.divTableCell}>{file.fileId}</div>
                <div className={styles.divTableCell}>{file.nNF}</div>
                <div className={styles.divTableCell}>{file.dhEmi}</div>
                <div className={styles.divTableCell}>{file.cUF}</div>
                <div className={styles.divTableCell}>{file.xFant}</div>
                <div className={styles.divTableCell}>{file.desCNPJ}</div>
                <div className={styles.divTableCell}>{file.desxNome}</div>
                <div className={styles.divTableCell}>{file.vTotTrib}</div>
                <div className={styles.divTableCell}>{file.vNF}</div>
                <div className={styles.divTableCell}>{file.cnpj}</div>
              </div>
            </div>
            {/* <button
                  className={styles.btn}
                  onClick={() => handleRemove(file.id)}
                >
                  <Image
                    src="/trash3.svg"
                    width={20}
                    height={17}
                    alt="trash icon"
                  />
                </button> */}
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
      </div>
    </div>
  );
}
