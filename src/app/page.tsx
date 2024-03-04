'use client'

import styles from "./page.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { loadProducts, removeProducts } from "./store/ProductSlice";
import { useEffect } from "react";
import Preloader from '../app/components/preloader/Preloader'
import ProductCard from "./components/product-card/ProductCard";
import Pagination from "./components/pagination/Pagination";
import Filter from "./components/filter/Filter";


export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const productsList = useSelector((state: RootState) => state.productsList)
  const application = useSelector((state: RootState) => state.application)
  const pageCount = useSelector((state: RootState) => state.application.pageCount)
  const action = useSelector((state: RootState) => state.application.action)

  useEffect(() => {
    const getData = () => {
      const query: any = {}
      if (application.ids) {
        query["ids"] = application.ids
      }
      if (productsList.products.length !== 0) {
        dispatch(removeProducts())
      }
      if (application.ids.length > 0) {
        dispatch(loadProducts({
          action,
          params: {
            ...query,
          }
        }))
      }
    }
    getData()
    if (productsList.error) {
      getData()
    }
  }, [application.ids, productsList.error])

  return (
    <main className={styles.main}>
      <p className={styles.title}>VALANTIS</p>
      <Filter />
      {productsList.loading === 'loading' || application.loading === 'loading' ? <Preloader /> : null}
      {application.error.includes('нет товаров') ?
        <p className={styles.notification}>{application.error}</p>
        : null}
      {(productsList.loading === 'idle' || application.loading === 'idle') && (productsList.error || (application.error && !application.error.includes('нет товаров'))) ?
        <p className={styles.notification}>Внутренняя ошибка сервера! Попробуйте позже...</p>
        : null}
      <div className={styles.cards}>
        {productsList.products.length > 0 && (!productsList.error) ?
          productsList.products?.map((item) => {
            return <ProductCard brand={item.brand} id={item.id} price={item.price} product={item.product} key={item.id} />
          }) : null}
      </div>
      <Pagination pageCount={pageCount} />
    </main>
  );
}
