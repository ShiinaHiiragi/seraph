import * as React from "react";
import { Experimental_CssVarsProvider as MaterialCssVarsProvider } from "@mui/material/styles";
import {
  extendTheme as extendJoyTheme,
  CssVarsProvider,
  THEME_ID,
} from "@mui/joy/styles";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimeField } from "@mui/x-date-pickers/DateTimeField";
import { unstable_useDateField as useDateField } from "@mui/x-date-pickers/DateField";
import { useClearableField } from "@mui/x-date-pickers/hooks";

const joyTheme = extendJoyTheme();
const JoyField = React.forwardRef((props, ref) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    formControlSx,
    endDecorator,
    startDecorator,
    slotProps,
    ...other
  } = props;

  return (
    <FormControl
      disabled={disabled}
      id={id}
      sx={[
        {
          flexGrow: 1,
        },
        ...(Array.isArray(formControlSx) ? formControlSx : [formControlSx]),
      ]}
      ref={ref}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        ref={ref}
        disabled={disabled}
        startDecorator={
          <React.Fragment>
            {startAdornment}
            {startDecorator}
          </React.Fragment>
        }
        endDecorator={
          <React.Fragment>
            {endAdornment}
            {endDecorator}
          </React.Fragment>
        }
        slotProps={{
          ...slotProps,
          root: { ...slotProps?.root, ref: containerRef },
        }}
        {...other}
      />
    </FormControl>
  );
});

const JoyDateField = React.forwardRef((props, ref) => {
  const { inputRef: externalInputRef, slots, slotProps, ...textFieldProps } = props;

  const {
    onClear,
    clearable,
    ref: inputRef,
    ...fieldProps
  } = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  /* If you don"t need a clear button, you can skip the use of this hook */
  const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
    useClearableField({
      onClear,
      clearable,
      fieldProps,
      InputProps: fieldProps.InputProps,
      slots,
      slotProps,
    });

  return (
    <JoyField
      ref={ref}
      slotProps={{
        input: {
          ref: inputRef,
        },
      }}
      {...processedFieldProps}
      InputProps={ProcessedInputProps}
    />
  );
});

const JoyDatePicker = React.forwardRef((props, ref) => {
  return (
    <DateTimeField
      className="PickerRoot"
      ref={ref}
      {...props}
      slots={{ field: JoyDateField, ...props.slots }}
      slotProps={{
        ...props.slotProps,
        field: {
          ...props.slotProps?.field,
          formControlSx: {
            flexDirection: "row",
          },
        }
      }}
      sx={(theme) => ({
        "input": {
          padding: theme.spacing(1, 1.5)
        },
        "& .MuiInputBase-root:hover": {
          borderColor: "white !important"
        }
      })}
      format="YYYY 年 MM-DD HH:mm:ss"
    />
  );
});

export default function Picker() {
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDatePicker slotProps={{ field: { clearable: true } }} />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
