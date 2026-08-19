import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className,
    alt = 'PT CNP',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    const baseClassName = ['object-contain', className]
        .filter(Boolean)
        .join(' ');

    return (
        <>
            <img
                {...props}
                src="/nusantara-logo-light.png"
                alt={alt}
                className={['dark:hidden', baseClassName].join(' ')}
            />
            <img
                {...props}
                src="/nusantara-logo.png"
                alt={alt}
                className={['hidden dark:block', baseClassName].join(' ')}
            />
        </>
    );
}
