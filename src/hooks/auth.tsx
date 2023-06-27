import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import uuid from "react-native-uuid";

import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_COLLECTION } from "../storage/storageConfig";

interface AuthProviderProps {
  children: ReactNode;
}

interface UserProps {
  id: string;
  name: string;
}

interface AuthContextData {
  user: UserProps;
  userStorageIsLoading: boolean;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  signIn(name: string): Promise<void>;
}

const AuthContext = createContext({} as AuthContextData);

WebBrowser.maybeCompleteAuthSession();

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [userStorageIsLoading, setUserStorageIsLoading] = useState(true);

  async function signIn(name: string) {
    const userLogged = {
      id: String(uuid.v4()),
      name: name,
    };

    setUser(userLogged);

    await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userLogged));
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential) {
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1&bold=true&background=ffffff`;
        const userLogged = {
          id: String(credential.user),
          name,
        };

        setUser(userLogged);

        await AsyncStorage.setItem(USER_COLLECTION, JSON.stringify(userLogged));
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async function signOut() {
    setUser({} as UserProps);
    await AsyncStorage.removeItem(USER_COLLECTION);
    // await AsyncStorage.clear();
  }

  useEffect(() => {
    async function loadUserStorageData() {
      const userStorage = await AsyncStorage.getItem(USER_COLLECTION);

      if (userStorage) {
        const userLogged = JSON.parse(userStorage) as UserProps;
        setUser(userLogged);
      }
      setUserStorageIsLoading(false);
    }

    loadUserStorageData().then();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithApple,
        signOut,
        signIn,
        userStorageIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
