import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../redux/slices/authSlice';

const schema = yup.object({
  name: yup.string().min(2, 'Name too short').required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
  phone: yup.string().required('Phone number is required'),
  role: yup.string().oneOf(['customer', 'restaurant', 'delivery']).required(),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'customer' },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = async (values) => {
    const result = await dispatch(registerUser(values));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Registered successfully! Please verify your email.');
      navigate('/');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <div className="container-app py-16 flex justify-center">
      <div className="card max-w-md w-full p-8">
        <h1 className="font-display text-2xl font-bold mb-6 text-center">Create an Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register('name')} placeholder="Full Name" className="input-field" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input {...register('email')} placeholder="Email" className="input-field" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input {...register('phone')} placeholder="Phone Number" className="input-field" />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <input {...register('password')} type="password" placeholder="Password" className="input-field" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">I am registering as a:</label>
            <select {...register('role')} className="input-field">
              <option value="customer">Customer</option>
              <option value="restaurant">Restaurant Owner</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm mt-6">
          Already have an account? <Link to="/login" className="text-dogra-maroon dark:text-dogra-gold font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
