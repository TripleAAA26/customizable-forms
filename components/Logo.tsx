import Link from 'next/link'

export default function Logo() {
    return (
        <Link
            href='/'
            className='font-bold text-3xl bg-gradient-to-r from-blue-400 to-green-400
            text-transparent bg-clip-text hover:cursor-pointer'
        >
            CustomizableForms
        </Link>
    )
}

