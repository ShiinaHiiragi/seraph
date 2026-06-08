import * as React from "react";
import Input from "@mui/joy/Input";

export default function SemiInput(props) {
  const {
    initValue,
    setValue,
    offset,
    ...inputProps
  } = props;

  const [localValue, setLocalValue] = React.useState(initValue);
  React.useEffect(() => {
    const timeoutId = setTimeout(() => setValue(localValue), offset);
    return () => clearTimeout(timeoutId);
  }, [localValue, offset, setValue]);

  return (
    <Input
      {...inputProps}
      value={localValue}
      onChange={(event) => setLocalValue(event.target.value)}
    />
  );
};
