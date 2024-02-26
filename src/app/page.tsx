'use client'

import Image from "next/image";
import styles from "./page.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

export default function Home() {
  const count = useSelector((state: RootState) => state.counters)

  return (
    <main className={styles.main}>
      <h1>{count}</h1>
    </main>
  );
}
