import Button from "../Button";

interface AppLinkProps {
  text: string;
  route: string;
  navigation: any;
}

export default function AppLink({ text, route, navigation }: AppLinkProps) {
  const changeRoute = () => {
    navigation.navigate(route);
  };

  return (
    <Button title={text} onPress={changeRoute} />
  );
}
