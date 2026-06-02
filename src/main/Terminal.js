import React from "react";
import "@xterm/xterm/css/xterm.css";
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import RouteField from "../interface/RouteField";
import GlobalContext, { serverWebSocketURL } from "../interface/constants";

const LIGHT_THEME = {
  background: "#fafafa",
  foreground: "#383a42",
  cursor: "#526fff",
  cursorAccent: "#fafafa",
  selectionBackground: "#c8d3e6",
  black: "#383a42",
  red: "#e45649",
  green: "#50a14f",
  yellow: "#c18401",
  blue: "#4078f2",
  magenta: "#a626a4",
  cyan: "#0184bc",
  white: "#a0a1a7",
  brightBlack: "#4f525e",
  brightRed: "#e45649",
  brightGreen: "#50a14f",
  brightYellow: "#c18401",
  brightBlue: "#4078f2",
  brightMagenta: "#a626a4",
  brightCyan: "#0184bc",
  brightWhite: "#383a42",
};

const Terminal = () => {
  const context = React.useContext(GlobalContext);
  const containerRef = React.useRef(null);

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
      fitAddon.fit();

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
        // TODO: add reason
        xterm.write("\r\n\x1b[31m[Connection Closed]\x1b[0m\r\n");
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
      sx={{ overflow: "hidden" }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: LIGHT_THEME.background,
          padding: "8px 16px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "rgba(var(--joy-palette-neutral-mainChannel, 99 107 116) / 0.15)",
          borderRadius: "var(--joy-radius-sm)",
          boxSizing: "border-box"
        }}
      />
    </RouteField>
  );
};

export default Terminal;
