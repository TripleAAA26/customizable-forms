import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Logo from '@/components/Logo'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import LanguageSwitcher from '@/components/providers/LanguageSwitcher'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col min-h-screen min-w-full bg-background max-h-screen'>
            <nav className='flex items-center justify-between border-b border-border h-[60px] px-4 p-2'>
                <Logo/>
                <div className='flex gap-4 items-center'>
                    <LanguageSwitcher />
                    <ThemeSwitcher/>
                    <SignedOut>
                        <SignInButton/>
                        <SignUpButton/>
                    </SignedOut>
                    <SignedIn>
                        <UserButton/>
                    </SignedIn>
                </div>
            </nav>
            <main
                className='flex w-full flex-grow justify-center px-4 sm:px-0'
            >
                {children}
            </main>
        </div>
    )
}

