import { styled } from "@mui/joy/styles";

const Root = styled('div')(({ theme }) => ({
  width: "100wh",
  height: "100vh",
  display: "flex",
  flexDirection: "column"
}));

const Panel = () => {
  return (
    <Root>
    </Root>
  );
}

export default Panel;
