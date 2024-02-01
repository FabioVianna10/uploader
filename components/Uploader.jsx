import styles from "../src/styles/uploader.module.css";
import Image from "next/image";

export default function Uploader() {
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <Image
          src="/cloud-arrow-up-fill.svg"
          width={100}
          height={100}
          alt="cloud_icon"
        />
        <h1 className={styles.title}>upload your files here! </h1>

        <form>
          <div className={styles.containerInp}>
            <input className={styles.inp} type="file" accept=".xml" multiple />
            <input className={styles.inp2} type="submit" value="Upload" />
          </div>
        </form>
      </div>
    </div>
  );
}
