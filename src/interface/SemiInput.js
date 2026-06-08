import * as React from "react";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import { reactionInterval } from "./constants";

export default function SemiInput(props) {
  const {
    initValue,
    setValue,
    offset,
    ...inputProps
  } = props;

  const [localValue, setLocalValue] = React.useState(initValue);
  React.useEffect(() => {
    const timeoutId = setTimeout(
      () => setValue(localValue),
      offset ?? reactionInterval.rapid
    );
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

function SemiTextarea(props) {
  const {
    initValue,
    setValue,
    offset,
    ...inputProps
  } = props;

  const [localValue, setLocalValue] = React.useState(initValue);
  React.useEffect(() => {
    const timeoutId = setTimeout(
      () => setValue(localValue),
      offset ?? reactionInterval.rapid
    );
    return () => clearTimeout(timeoutId);
  }, [localValue, offset, setValue]);

  return (
    <Textarea
      {...inputProps}
      value={localValue}
      onChange={(event) => setLocalValue(event.target.value)}
    />
  );
};

export { SemiTextarea };
