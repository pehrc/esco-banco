import { NavigationContainer } from "@react-navigation/native";

import { AuthRoutes } from "./atuh.routes";
import { AppRoutes } from "./app.routes";

import { useAuth } from "../hooks/auth";

export function Routes() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user.id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
