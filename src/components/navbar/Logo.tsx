import { Link } from 'react-router-dom';

function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-3 text-white no-underline hover:opacity-90 transition-opacity"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path
          d="M12 2L2 7v10l10 5 10-5V7l-10-5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 7l10 5 10-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22V12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-lg sm:text-xl font-bold">Tracks Cargo</span>
    </Link>
  );
}

export default Logo;