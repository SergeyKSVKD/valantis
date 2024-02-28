import { memo } from 'react'
import styles from './ProductCard.module.scss'
import { Product } from '../../store/ProductSlice'
import Seregki from '../../../../public/seregki.webp'
import Braslet from '../../../../public/braslet.webp'
import Kole from '../../../../public/kole.webp'
import Kolco from '../../../../public/kolco.webp'
import Komplekt from '../../../../public/komplekt.webp'
import Image from 'next/image'
import Link from "next/link"

function numberFormat(value: any, locale = 'ru-RU', options = {}) {
    return new Intl.NumberFormat(locale, options).format(value);
}

const ProductCard: React.FC<Product> = ({ id, brand, price, product }) => {

    return <Link href={`/catalog/${id}`}><div className={styles.card}>
        <div className={styles.img}>
            <p>Артикул: {id}</p>
            {product.toLowerCase().includes("серьги") ? <Image src={Seregki} alt='seregki' style={{
                width: '150px',
                height: '150px',
                padding: '10px',
            }} /> : null}
            {product.toLowerCase().includes("кольцо") ? <Image src={Kolco} alt='seregki' style={{
                width: '150px',
                height: '150px',
                padding: '10px',
            }} /> : null}
            {product.toLowerCase().includes("колье") ||
                product.toLowerCase().includes('кулон') ||
                product.toLowerCase().includes('брошь')
                ? <Image src={Kole} alt='seregki' style={{
                    width: '150px',
                    height: '150px',
                    padding: '10px',
                }} /> : null}
            {product.toLowerCase().includes("браслет") ? <Image src={Braslet} alt='seregki' style={{
                width: '150px',
                height: '150px',
                padding: '10px',
            }} /> : null}
            {product.toLowerCase().includes("комплект") ||
                product.toLowerCase().includes('антикварная')
                ? <Image src={Komplekt} alt='seregki' style={{
                    width: '150px',
                    height: '150px',
                    padding: '10px',
                }} /> : null}
        </div>
        <p className={styles.name}>{product} {brand && `(${brand})`}</p>
        <p className={styles.price}>{numberFormat(price)} ₽</p>
    </div></Link>
}

export default memo(ProductCard)