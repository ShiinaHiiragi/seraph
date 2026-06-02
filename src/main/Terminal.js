import React from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "react-xtermjs";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

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

  React.useEffect(() => {
    if (!context.isAuthority || !containerRef.current) return;

    const fitAddon = new FitAddon();
    const xterm = new XTerminal({
      theme: LIGHT_THEME,
      fontFamily: 'Ubuntu Mono, Menlo, Monaco, Consolas, "Courier New", monospace',
      fontSize: 16,
      cursorBlink: true,
      convertEol: true,
    });

    xterm.loadAddon(fitAddon);
    xterm.open(containerRef.current);
    xterm.focus();
    fitAddon.fit();

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(
      `${protocol}//localhost:8000/pty`
    );

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "resize", cols: xterm.cols, rows: xterm.rows }));
    };
    ws.onmessage = (e) => xterm.write(e.data);
    ws.onclose = () =>
      xterm.write("\r\n\x1b[31m[connection closed]\x1b[0m\r\n");

    const d1 = xterm.onData((data) => {
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "input", data }));
    });

    const d2 = xterm.onResize(({ cols, rows }) => {
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "resize", cols, rows }));
    });

    const observer = new ResizeObserver(() => fitAddon.fit());
    observer.observe(containerRef.current);

    return () => {
      ws.close();
      observer.disconnect();
      d1.dispose();
      d2.dispose();
      xterm.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.isAuthority]);

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
          padding: "8px",
          boxSizing: "border-box",
        }}
      />
    </RouteField>
  );
};

export default Terminal;
