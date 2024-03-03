import { memo, useEffect, useRef, useState } from 'react'
import styles from './Filter.module.scss'
import { useDebounce } from '@/app/helpers/useDebounce'
import { addFilter, changeAction, changeActivePage, clearFilters, getAllBrands } from '@/app/store/AppSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/store/store'
import Menu from '../../../../public/menu.svg'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { IoClose } from "react-icons/io5";
import { loadProducts, removeProducts } from '@/app/store/ProductSlice'

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>()
    const brands = useSelector((state: RootState) => state.application.brands)
    const action = useSelector((state: RootState) => state.application.action)
    const ActiveBrand = useSelector((state: RootState) => state.application.params.brand)
    const [search, setSearch] = useState({
        product: '',
        price: "",
    })
    const [visibleFilters, setVisibleFilters] = useState(false)
    const debounceSearchProduct = useDebounce(search.product, 3000)
    const debounceSearchPrice = useDebounce(search.price, 3000)
    const searchRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (search.product) {
            dispatch(removeProducts())
            dispatch(changeAction('filter'))
            dispatch(addFilter({
                "limit": 50,
                "offset": 0,
                "price": 0,
                "product": search.product,
                "brand": '',
            }))
            setVisibleFilters(false)
        }
        if (search.price) {
            dispatch(removeProducts())
            dispatch(changeAction('filter'))
            dispatch(addFilter({
                "limit": 50,
                "offset": 0,
                "price": Number(search.price),
                "product": '',
                "brand": '',
            }))
            setVisibleFilters(false)
        }
        else {
            dispatch(removeProducts())
            dispatch(loadProducts({
                action: 'get_ids',
                params: {
                    limit: 50,
                    offset: 0,
                }
            }))
        }

    }, [debounceSearchProduct, debounceSearchPrice])

    useEffect(() => {
        dispatch(getAllBrands())
    }, [])

    return (<div>
        <div className={styles.filters_btn} onClick={() => setVisibleFilters(!visibleFilters)}>
            <Menu style={{
                width: '28px',
                height: '28px',
                transition: '1s easy-in-out',
                transform: visibleFilters ? 'rotate(180deg)' : null
            }} />
            {!visibleFilters ? 'Все фильтры' : 'Скрыть фильтры'}
            {action === 'filter' ? <div className={styles.dots} /> : null}
        </div>

        {visibleFilters ? <div className={styles.overlay}
            onClick={(e) => {
                setVisibleFilters(false)
            }}
        >
            <motion.div className={styles.filters_container}
                onClick={(e) => {
                    e.stopPropagation()
                }}
                initial={{
                    scale: 0.7,
                    visibility: "hidden"
                }}
                animate={{
                    scale: 1,
                    visibility: "visible"
                }}
                transition={{ duration: 0.3, type: 'just', }}
            >
                <div className={styles.brands_container}>
                    <p className={styles.filter}>Бренд</p>
                    <div className={styles.brands}>
                        {brands && brands.map((item) => {

                            return <p key={item} className={
                                cn({ [styles.active]: ActiveBrand === item })
                            }
                                onClick={() => {
                                    dispatch(clearFilters())
                                    dispatch(changeAction('filter'))
                                    dispatch(addFilter({
                                        "limit": 50,
                                        "offset": 0,
                                        "price": 0,
                                        "product": '',
                                        "brand": `${item}`,
                                    }))
                                    setSearch({
                                        product: '',
                                        price: "0",
                                    })
                                    setVisibleFilters(false)
                                }}
                            >{item}</p>
                        })}
                    </div>
                </div>

                <div>
                    <p className={styles.filter}>Название продукта</p>
                    <input ref={searchRef}
                        className={styles.search}
                        placeholder="Название продукта"
                        value={search.product}
                        onChange={(e) => setSearch({
                            ...search,
                            product: e.target.value
                        })} />
                </div>

                <div>
                    <p className={styles.filter}>Цена</p>
                    <input ref={priceRef}
                        className={styles.search}
                        placeholder="Цена"
                        value={search.price}
                        onChange={(e) => setSearch({
                            ...search,
                            price: e.target.value
                        })} />
                </div>

                <div onClick={() => {
                    dispatch(clearFilters())
                    setVisibleFilters(false)
                    setSearch({
                        product: '',
                        price: "",
                    })
                    dispatch(changeActivePage(1))
                }}
                    className={styles.clear_btn}
                >
                    Очистить фильтры
                </div>
                <IoClose className={styles.close} onClick={() => setVisibleFilters(!visibleFilters)} />
            </motion.div></div> : null}
    </div>)
}

export default memo(Filter)