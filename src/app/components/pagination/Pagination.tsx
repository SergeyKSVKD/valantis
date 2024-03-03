import styles from './Pagination.module.scss';
import cn from 'classnames'
import { useMemo, memo, useEffect } from 'react'
import { changeActivePage, clearIDS, getIDS } from '@/app/store/AppSlice'
import { removeProducts } from '@/app/store/ProductSlice'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/store/store';

const Pagination = ({ pageCount = 1, siblingCount = 1, }) => {
    const productsList = useSelector((state: RootState) => state.productsList)
    const application = useSelector((state: RootState) => state.application)
    const activePage = useSelector((state: RootState) => state.application.activePage)
    const action = useSelector((state: RootState) => state.application.action)
    const params = useSelector((state: RootState) => state.application.params)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const getData = () => {
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

                dispatch(getIDS({
                    "action": action,
                    "params": {
                        limit: 50,
                        offset: application.params.offset,
                        ...query,
                    }
                }))
            }
            else {
                dispatch(getIDS({
                    action,
                    params: {
                        limit: 50,
                        offset: application.params.offset,
                    }
                }))
            }
        }
        if (application.ids.length === 0) {
            if (application.error.includes('нет товаров')) {
                const time = 3000
                setTimeout(() => {
                    console.log('error')
                }, time)
            }
            if (application.error.includes('Unexpected')) {
                const time = 2000
                setTimeout(() => {
                    getData()
                }, time)
            }
            getData()
        }
    }, [action, activePage, params.brand, params.price, params.product])

    let pag = []
    const PageBtn = ({ page }: { page: number }) => {
        return <div
            onClick={() => {
                if (productsList.products.length !== 0) {
                    dispatch(removeProducts())
                }
                if (application.ids.length !== 0) {
                    dispatch(clearIDS())
                }
                dispatch(changeActivePage(page))
            }
            }
            className={cn(styles.page, { [styles.active]: activePage === page })}
        >{page}</div>
    }

    const Dots = () => {
        return <div className={styles.dots}>...</div>
    }

    const pagination = useMemo(() => {
        const map = new Map()
        for (let i = 0; i < pageCount; i++) {
            map.set(`${i}`, <PageBtn key={i + 1} page={i + 1} />)
        }
        return map
    }, [pageCount, PageBtn])

    if (pageCount < 4) {
        for (let i = 0; i < pageCount; i++) {
            pag.push(pagination.get(`${i}`))
        }
    }
    else {
        const first = pagination.get("0")
        const last = pagination.get(`${pageCount - 1}`)
        let filtered: any = []
        pagination.forEach(item => {
            if (activePage === 1) {
                filtered = [pagination.get("1"), pagination.get("2")]
            }
            if (activePage === pageCount) {
                filtered = [pagination.get(`${pageCount - 3}`), pagination.get(`${pageCount - 2}`)]
            }
            if (item.props.page <= activePage + siblingCount
                && item.props.page > activePage - siblingCount - 1 && item.props.page !== 1
                && item.props.page !== pageCount) {
                filtered.push(item)
            }
        })

        pag = [
            first,
            filtered.length > 0 && filtered[0].props.page - 1 === 1 ? null : <Dots key='first' />,
            ...filtered,
            filtered.length > 0 && filtered[filtered.length - 1].props.page + 1 === pageCount ? null : <Dots key='last' />,
            last,
        ]
    }

    return <div className={styles.pagination}>
        {pageCount !== 1 ? pag : null}
    </div>
}

export default memo(Pagination)