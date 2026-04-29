import { useNavigate } from "react-router-dom"; //для использования роутов

export function useNavigation() {
  const navigate = useNavigate();
  return {
    openBoard: (address) => navigate(`/board/${address}`),
    openRegister: () => navigate('/register'),
    openMain: () => navigate('/')
  };
}

