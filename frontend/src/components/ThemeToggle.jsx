import { useDispatch, useSelector } from 'react-redux';
import { FiSun, FiMoon } from 'react-icons/fi';
import { toggleTheme } from '../redux/slices/themeSlice';

const ThemeToggle = () => {
  const mode = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      aria-label="Toggle theme"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-dogra-cream/60 dark:bg-slate-700 hover:scale-105 transition-transform"
    >
      {mode === 'dark' ? <FiSun className="text-dogra-gold" /> : <FiMoon className="text-dogra-maroon" />}
    </button>
  );
};

export default ThemeToggle;
