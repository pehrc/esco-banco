import { useState } from "react";
import { ActivityIndicator, Alert, Platform, Text } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useTheme } from "styled-components";

import AppleSvg from "../../assets/apple.svg";

import { useAuth } from "../../hooks/auth";

import { SignInSocialButton } from "../../components/SignInSocialButton";

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from "./styles";
import { Input } from "../../components/Form/Input";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithApple, signIn } = useAuth();

  const [name, setName] = useState("");

  const theme = useTheme();

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);

      return await signInWithApple();
    } catch (error) {
      Alert.alert("Não foi possível conectar a conta Apple");
    } finally {
      setIsLoading(false);
    }
  }

  function handleClick() {
    signIn(name);
  }

  return (
    <Container>
      <Header>
        <TitleWrapper>
          <Title>
            Controle suas {"\n"}
            finanças de forma {"\n"}
            muito simples
          </Title>
          <SignInTitle>Faça seu login</SignInTitle>
        </TitleWrapper>
      </Header>

      <Footer>
        <FooterWrapper>
          <Input
            value={name}
            placeholder="Nome"
            onChangeText={(value) => setName(value)}
          />
          <SignInSocialButton title="Entrar" onPress={handleClick} />
          {Platform.OS === "ios" && (
            <SignInSocialButton
              title="Entrar com Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && (
          <ActivityIndicator
            color={theme.colors.shape}
            style={{ marginTop: 18 }}
          />
        )}
      </Footer>
    </Container>
  );
}
