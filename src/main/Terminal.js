import React from "react";
import "@xterm/xterm/css/xterm.css";
import Box from '@mui/joy/Box';
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import RouteField from "../interface/RouteField";
import GlobalContext, { serverWebSocketURL } from "../interface/constants";

const LIGHT_THEME = {
  background: "#F8F8F8",
  foreground: "#383838",
  cursor: "#383838",
  cursorAccent: "#383838",
  black: "#383A42",
  blue: "#4078F2",
  cyan: "#0184BC",
  green: "#50A14F",
  magenta: "#A626A4",
  red: "#E45649",
  white: "#A0A1A7",
  yellow: "#C18401",
  brightBlack: "#4F525E",
  brightBlue: "#4078F2",
  brightCyan: "#0184BC",
  brightGreen: "#50A14F",
  brightMagenta: "#A626A4",
  brightRed: "#E45649",
  brightWhite: "#383A42",
  brightYellow: "#C18401",
  selectionBackground: "#C8D2E6"
};

const Terminal = () => {
  const context = React.useContext(GlobalContext);
  const containerRef = React.useRef(null);
  const xtermRef = React.useRef(null);
  const fitAddonRef = React.useRef(null);

  // const [fs, setFS] = React.useState(14)
  // window.setFS = setFS
  // React.useEffect(() => {
  //   if (xtermRef.current) {
  //     Object.assign(xtermRef.current.options, { cursorBlink: true, fontSize: fs });
  //     fitAddonRef.current?.fit();
  //   }
  // }, [fs])

  const sendCtrl = React.useCallback((letter) => {
    const code = letter.toUpperCase().charCodeAt(0) - 64;
    if (code >= 1 && code <= 26) {
      xtermRef.current?.paste(String.fromCharCode(code));
    }
  }, []);

  // after second tick, the globalSwitch were set properly
  React.useEffect(() => {
    if (context.secondTick && context.isAuthority && containerRef.current) {
      const fitAddon = new FitAddon();
      const xterm = new XTerminal({
        theme: LIGHT_THEME,
        fontFamily: 'Ubuntu Mono, Monaco, Consolas, Courier New, monospace',
        fontSize: 16,
        cursorBlink: false,
        convertEol: true
      });

      xterm.loadAddon(fitAddon);
      xterm.open(containerRef.current);
      xterm.focus();
      xtermRef.current = xterm;

      fitAddon.fit();
      fitAddonRef.current = fitAddon;

      const webSocket = new WebSocket(new URL("/pty", serverWebSocketURL).href);
      webSocket.onopen = () => {
        webSocket.send(JSON.stringify({
          type: "resize",
          cols: xterm.cols,
          rows: xterm.rows
        }));
      };

      webSocket.onmessage = (event) => {
        xterm.write(event.data);
      };

      webSocket.onclose = (event) => {
        const reason = event.reason ? `: ${event.reason}` : ""
        xterm.write(`\r\n\x1b[31m[Connection closed${reason}]\x1b[0m\r\n`);
      }

      const xtermOnData = xterm.onData((data) => {
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(JSON.stringify({
            type: "input",
            data: data
          }));
        }
      });

      const xtermOnResize = xterm.onResize(({ cols, rows }) => {
        if (webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(JSON.stringify({
            type: "resize",
            cols: cols,
            rows: rows
          }));
        }
      });

      xterm.attachCustomKeyEventHandler((event) => {
        if (event.type !== "keydown" || !event.ctrlKey) {
          return true;
        }

        if (event.shiftKey && event.key === "C") {
          event.preventDefault();
          const selection = xterm.getSelection();
          if (selection) {
            navigator.clipboard.writeText(selection)
          };
          return false;
        }

        if (event.shiftKey && event.key === "V") {
          event.preventDefault();
          navigator.clipboard
            .readText()
            .then((text) => xterm.paste(text));
          return false;
        }

        if (event.key === "Backspace") {
          xterm.paste("\x17");
          return false;
        }
        return true;
      });

      // resize listener of browser
      const observer = new ResizeObserver(() => fitAddon.fit());
      observer.observe(containerRef.current);

      return () => {
        xtermRef.current = null;
        webSocket.close();
        observer.disconnect();
        xtermOnData.dispose();
        xtermOnResize.dispose();
        xterm.dispose();
      };
    }
  // eslint-disable-next-line
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
  ]);

  return (
    <RouteField
      display={context.isAuthority}
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.terminal"),
      ]}
      title={context.languagePicker("nav.utility.terminal")}
      sx={{
        overflow: "hidden",
        '& div.xterm-scrollable-element > div.scrollbar': {
          width: "6px !important"
        },
        "& .slider": {
          width: "6px !important",
          right: "0px !important"
        }
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: LIGHT_THEME.background,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgba(var(--joy-palette-neutral-mainChannel, 99 107 116) / 0.15)",
          borderRadius: "var(--joy-radius-sm)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            position: "absolute",
            top: { xs: "6px", sm: "8px" },
            right: { xs: "0px", sm: "4px" },
            bottom: { xs: "0px", sm: "4px" },
            left: { xs: "12px", sm: "16px" }
          }}
        />
      </div>
    </RouteField>
  );
};

export default Terminal;
