import React from "react";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import { reactionInterval } from "./constants";

export default function SemiInput(props) {
  const {
    initValue,
    setValue,
    offset,
    selectBasename,
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

  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (selectBasename && inputRef.current) {
      const val = inputRef.current.value;
      const dot = val.lastIndexOf(".");
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, dot === -1 ? val.length : dot);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Input
      {...inputProps}
      value={localValue}
      onChange={(event) => setLocalValue(event.target.value)}
      slotProps={{
        ...inputProps.slotProps,
        input: {
          ref: inputRef,
          ...inputProps.slotProps?.input,
        },
      }}
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
