import styles from "../src/styles/uploader.module.css";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function Uploader() {
  const [files, setFiles] = useState([]);

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

  const handleDownload = async () => {
    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index + 1}`, file.file);
      });

      const response = await axios.post(
        "{Formeezy-Endpoint}/download",
        formData,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "files.zip";
      link.click();
    } catch (error) {
      console.error("Erro ao realizar o download:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Cliquei");

    const formData = new FormData();

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

        {files.map((file, index) => (
          <div className={styles.containerList}>
            <ul>
              <li className={styles.files} key={index}>
                {file.name}

                <button
                  className={styles.btn}
                  onClick={() => handleRemove(index)}
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
