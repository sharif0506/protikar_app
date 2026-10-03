import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginResponse } from './src/services/authService';
import DiagnosticHomeScreen from './src/screens/diagnostic/DiagnosticHomeScreen';
import DoctorHomeScreen from './src/screens/doctor/DoctorHomeScreen';
import PatientHomeScreen from './src/screens/patient/PatientHomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import SplashScreen from './src/screens/auth/SplashScreen';

type Screen = 'splash' | 'login' | 'register' | 'home';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [authData, setAuthData] = useState<LoginResponse | null>(null);

  const handleLoginSuccess = (data: LoginResponse) => {
    setAuthData(data);
    setScreen('home');
  };

  const handleLogout = () => {
    setAuthData(null);
    setScreen('login');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />

      {screen === 'splash' && (
        <SplashScreen onFinish={() => setScreen('login')} />
      )}
      {screen === 'login' && (
        <LoginScreen
          onRegister={() => setScreen('register')}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {screen === 'register' && (
        <RegisterScreen onLogin={() => setScreen('login')} />
      )}
      {screen === 'home' && authData?.user.role === 'DIAGNOSTIC_CENTER_OWNER' && (
        <DiagnosticHomeScreen authData={authData} onLogout={handleLogout} />
      )}
      {screen === 'home' && authData?.user.role === 'PATIENT' && (
        <PatientHomeScreen authData={authData} onLogout={handleLogout} />
      )}
      {screen === 'home' && authData?.user.role === 'DOCTOR' && (
        <DoctorHomeScreen authData={authData} onLogout={handleLogout} />
      )}
    </SafeAreaProvider>
  );
}
