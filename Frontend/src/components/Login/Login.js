import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/main');
  };

  return (
    <div>
      <h1>Página Principal</h1>
      <button onClick={handleRedirect}>Login</button>
    </div>
  );
}

export default Login;
