import { user } from "./global";

function Navigation({ activePage }) {
    let links = [
        { name: 'Home', href: 'index.html', id: 'home', icon: 'house' },
        { name: 'Playground', href: 'playground.html', id: 'playground', icon: 'gamepad-2' },
        { name: 'Assembly', href: 'assembly.html', id: 'assembly', icon: 'camera' },
        { name: 'Datasheets', href: 'datasheets.html', id: 'datasheets', icon: 'file-text' },
    ];

    if(user === null)
    {
        let links = [
            { name: 'Home', href: 'index.html', id: 'home', icon: 'house' },
            { name: 'Playground', href: 'unlogged.html', id: 'playground', icon: 'gamepad-2' },
            { name: 'Assembly', href: 'unlogged.html', id: 'assembly', icon: 'camera' },
            { name: 'Datasheets', href: 'unlogged.html', id: 'datasheets', icon: 'file-text' },
        ];
    }
    else
    {
        let links = [
            { name: 'Home', href: 'index.html', id: 'home', icon: 'house' },
            { name: 'Playground', href: 'playground.html', id: 'playground', icon: 'gamepad-2' },
            { name: 'Assembly', href: 'assembly.html', id: 'assembly', icon: 'camera' },
            { name: 'Datasheets', href: 'datasheets.html', id: 'datasheets', icon: 'file-text' },
        ];
    }

    return (
        <>
            <nav className="border-b border-slate-800 bg-[var(--bg-dark)]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <a href="index.html" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500 transition-colors">
                            <div className="icon-cpu text-cyan-400"></div>
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            Open <span className="text-cyan-400">Circuit</span>
                        </span>
                    </a>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-8 ml-12">
                        {links.map(link => (
                            <a 
                                key={link.id} 
                                href={link.href}
                                className={`nav-link flex items-center gap-2 ${activePage === link.id ? 'active' : ''}`}
                            >
                                <div className={`icon-${link.icon} w-4 h-4`}></div>
                                {link.name}
                            </a>
                        ))}
                    </div>
                    {/* Buttons */}
                    <div className="flex items-center gap-4 ml-auto">
                        {user===null && <a href="login.html" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log In</a>}
                       
                        {user===null && <a href = "signup.html" className="bubbles bubbles-small ml-auto">
                            <span className="text">Sign up</span>
                        </a>}
                        
                        {user && <p>{user}</p>}
                    </div>
                </div>
            </nav>
            <style>{`
                .bubbles {
                --c1: #212121;
                --c2: #06b6d4;
                --size-letter: 32px;
                padding: 0.5em 1em;
                font-size: var(--size-letter);

                background-color: transparent;
                border: calc(var(--size-letter) / 6) solid var(--c2);
                border-radius: 0.2em;
                cursor: pointer;

                overflow: hidden;
                position: relative;
                transition: 300ms cubic-bezier(0.83, 0, 0.17, 1);
                }

                .bubbles > .text {
                font-weight: 700;
                color: var(--c2);
                position: relative;
                z-index: 1;
                transition: color 700ms cubic-bezier(0.83, 0, 0.17, 1);
                }

                .bubbles::before {
                top: 0;
                left: 0;
                }

                .bubbles::after {
                top: 100%;
                left: 100%;
                }

                .bubbles::before,
                .bubbles::after {
                content: "";
                width: 150%;
                aspect-ratio: 1/1;
                scale: 0;
                transition: 1000ms cubic-bezier(0.76, 0, 0.24, 1);

                background-color: var(--c2);
                border-radius: 50%;

                position: absolute;
                translate: -50% -50%;
                }

                .bubbles:hover {
                & > span {
                    color: var(--c1);
                }
                &::before,
                &::after {
                    scale: 1;
                }
                }

                .bubbles:active {
                scale: 0.98;
                filter: brightness(0.9);
                }

                .bubbles-small {
                    --size-letter: 16px;
                    padding: 0.25em 0.75em;
                    
                }

            `}</style>
        </>
    );
}
