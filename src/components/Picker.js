import * as React from "react";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID
} from "@mui/material/styles";
import {
  extendTheme,
  CssVarsProvider,
  THEME_ID,
} from "@mui/joy/styles";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { unstable_useDateField as useDateField } from "@mui/x-date-pickers/DateField";
import { useClearableField } from "@mui/x-date-pickers/hooks";

const materialTheme = materialExtendTheme({
  transitions: {
    create: () => 'none',
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

const joyTheme = extendTheme();
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

const JoyDateTimePicker = React.forwardRef((props, ref) => {
  return (
    <DateTimePicker
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
        width: "100%",
        "& .MuiInput-startDecorator": {
          display: "none"
        }
      })}
      viewRenderers={{
        hours: null,
        minutes: null
      }}
    />
  );
});

export default function Picker(props) {
  const { timeFormat } = props;

  return (
    <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDateTimePicker
            slotProps={{ field: { clearable: true } }}
            format={timeFormat}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
