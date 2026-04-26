import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  hideOnMobile?: boolean;
  className?: string;
}

export const Logo = ({ showText = true, hideOnMobile = false, className = '' }: LogoProps) => {
  return (
    <Link href="/" className={`flex items-center gap-2 ${hideOnMobile ? 'hidden md:flex' : 'flex'} ${className}`}>
      <Image
        src="/discosagramellogo.jpg"
        alt="Discos a Granel"
        width={40}
        height={40}
        className="h-10 w-10 rounded-full object-cover"
      />
      {showText && (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Discos a</span>
          <span className="text-sm font-bold text-gray-900 dark:text-white">Granel</span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
