import Link from 'next/link'

export default function Logo() {
    return (
        <Link
            href='/'
            className='font-bold text-3xl bg-clip-text hover:cursor-pointer'
        >
            CustomizableForms
        </Link>
    )
}

