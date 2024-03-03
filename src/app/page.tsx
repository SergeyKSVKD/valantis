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
  const params = useSelector((state: RootState) => state.application.params)

  useEffect(() => {
    if (action === 'filter') {
      const query: any = {}
      if (params.brand) {
        query["brand"] = params.brand
      }
      if (params.price) {
        query["price"] = params.price
      }
      if (params.product) {
        query["product"] = params.product
      }
      dispatch(removeProducts())
      dispatch(loadProducts({
        action,
        params: {
          limit: 50,
          offset: application.params.offset,
          ...query,
        }
      }))
    }
    else {
      dispatch(removeProducts())
      dispatch(loadProducts({
        action,
        params: {
          limit: 50,
          offset: application.params.offset,
        }
      }))
    }
  }, [application.activePage, params.brand, params.product, params.price])

  return (
    <main className={styles.main}>
      <p className={styles.title}>VALANTIS</p>
      <Filter />
      {productsList.loading === 'loading' ? <Preloader /> : null}
      {productsList.products.length === 0 && (params.product !== '' || params.price !== 0) && productsList.loading === 'idle' ?
        <p className={styles.notification}>К сожалению, в нашем каталоге нет товаров, подходящих под выбранные фильтры. Попробуйте поменять или очистить очистить фильтры, и товары обязательно найдутся.</p>
        : null}
      {productsList.loading === 'idle' && (productsList.error || application.error) ?
        <p className={styles.notification}>Внутренняя ошибка сервера! Попробуйте позже...</p>
        : null}
      <div className={styles.cards}>
        {productsList.products.length > 0 && (!productsList.error || !application.error) ?
          productsList.products?.map((item) => {
            return <ProductCard brand={item.brand} id={item.id} price={item.price} product={item.product} key={item.id} />
          }) : null}
      </div>
      <Pagination pageCount={pageCount} />
    </main>
  );
}
