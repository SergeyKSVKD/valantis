'use client'

import { useRouter } from 'next/navigation'

type Props = {
    params: {
        id: string
    }
}

export default function CasePage({ params: { id } }: Props) {
    const router = useRouter()

    return <div>
        <p>{id}</p>
    </div>
}