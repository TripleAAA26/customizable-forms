import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen'>
            <nav className='flex items-center justify-between border-b border-border h-[60px] px-4 p-2'>
                <Logo/>
                <div className='flex gap-4 items-center'>
                    <ThemeSwitcher/>
                </div>
            </nav>
            <main
                className='flex w-full h-full flex-grow justify-center items-center'
            >
                {children}
            </main>
        </div>
    )
}

