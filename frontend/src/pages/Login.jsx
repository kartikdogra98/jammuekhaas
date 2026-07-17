import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../redux/slices/authSlice';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    const result = await dispatch(loginUser(values));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Welcome back!");
    
      const user = result.payload.user;
    
      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname);
        return;
      }
    
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
    
        case "restaurant":
          navigate("/restaurant-dashboard");
          break;
    
        case "delivery":
          navigate("/delivery-dashboard");
          break;
    
        default:
          navigate("/");
      }
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="container-app py-16 flex justify-center">
      <div className="card max-w-md w-full p-8">
        <h1 className="font-display text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register('email')} placeholder="Email" className="input-field" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input {...register('password')} type="password" placeholder="Password" className="input-field" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-dogra-maroon dark:text-dogra-gold">Forgot password?</Link>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          Don't have an account? <Link to="/register" className="text-dogra-maroon dark:text-dogra-gold font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
