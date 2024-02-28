'use client'

import styles from "./page.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store/store";
import { loadProducts } from "./store/ProductSlice";
import { useEffect } from "react";
import Preloader from '../app/components/preloader/Preloader'
import ProductCard from "./components/product-card/ProductCard";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const productsList = useSelector((state: RootState) => state.productsList)
  useEffect(() => {
    dispatch(loadProducts({
      action: 'get_items',
      params: {
        limit: 50,
        offset: 0,
      }
    }))
  }, [])

  console.log(productsList.products);

  return (
    <main className={styles.main}>
      <p className={styles.title}>VALANTIS</p>
      {productsList.products.length > 0 ? null : <Preloader />}
      <div className={styles.cards}>
        {productsList.products.length > 0 ?
          productsList.products?.map((item) => {
            return <ProductCard brand={item.brand} id={item.id} price={item.price} product={item.product} key={item.id}/>
          }) : null}
      </div>
    </main>
  );
}
