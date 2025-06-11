import React, {
	createContext,
	useState,
	useContext,
	useMemo,
	useEffect,
	ReactNode,
} from 'react';
// УДАЛЯЕМ useNavigate, так как он здесь не должен использоваться
// import { useNavigate } from 'react-router-dom';

interface AuthContextType {
	isLoggedIn: boolean;
	login: (password: string) => boolean;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Пароль хранится здесь для простоты. В реальном приложении так делать нельзя.
const ADMIN_PASSWORD = 'supersecretpassword';
const AUTH_STORAGE_KEY = 'isAdminLoggedIn';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
		try {
			const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);
			return storedValue === 'true';
		} catch {
			return false;
		}
	});
	// УДАЛЯЕМ const navigate = useNavigate();

	useEffect(() => {
		try {
			localStorage.setItem(AUTH_STORAGE_KEY, String(isLoggedIn));
		} catch (error) {
			console.error('Could not access localStorage:', error);
		}
	}, [isLoggedIn]);

	const login = (password: string): boolean => {
		if (password === ADMIN_PASSWORD) {
			setIsLoggedIn(true);
			return true;
		}
		alert('Неверный пароль!');
		return false;
	};

	// ИЗМЕНЯЕМ logout: он больше не отвечает за навигацию
	const logout = () => {
		setIsLoggedIn(false);
		// navigate('/'); // УДАЛЯЕМ
	};

	const value = useMemo(
		() => ({
			isLoggedIn,
			login,
			logout,
		}),
		[isLoggedIn]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
