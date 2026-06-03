import React from "react";
import "@xterm/xterm/css/xterm.css";
import Box from '@mui/joy/Box';
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import GlobalContext, { serverWebSocketURL, monospaceFonts } from "../interface/constants";
import RouteField from "../interface/RouteField";
import Caption from "../components/Caption";

const Terminal = () => {
  const context = React.useContext(GlobalContext);
  const containerRef = React.useRef(null);
  const xtermRef = React.useRef(null);
  const fitAddonRef = React.useRef(null);

  React.useEffect(() => {
    const id = "terminal-monospace";
    let link = document.getElementById(id);

    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = monospaceFonts
      .filter((item) => item.name === context.setting.terminal.font.family)
      ?.[0]
      ?.url;
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [context.setting.terminal.font.family]);

  React.useEffect(() => {
    if (xtermRef.current) {
      Object.assign(xtermRef.current.options, {
        fontSize: context.setting.terminal.font.size,
        fontFamily: `"${context.setting.terminal.font.family}", monospace`,
        fontWeight: context.setting.terminal.font.weight,
        fontWeightBold: context.setting.terminal.font.weightBold,
        letterSpacing: context.setting.terminal.text.space,
        lineHeight: context.setting.terminal.text.height,
      });
      fitAddonRef.current?.fit();
    }
  }, [
    context.setting.terminal.font.size,
    context.setting.terminal.font.family,
    context.setting.terminal.font.weight,
    context.setting.terminal.font.weightBold,
    context.setting.terminal.text.space,
    context.setting.terminal.text.height
  ]);

  React.useEffect(() => {
    if (xtermRef.current) {
      const { transparency, ...themeColors } = context.setting.terminal.theme;
      Object.assign(xtermRef.current.options, {
        cursorBlink: context.setting.terminal.cursor.blink,
        cursorStyle: context.setting.terminal.cursor.active,
        cursorInactiveStyle: context.setting.terminal.cursor.inactive,
        reflowCursorLine: context.setting.terminal.cursor.reflow,
        scrollback: context.setting.terminal.scroll.back,
        scrollSensitivity: context.setting.terminal.scroll.normal,
        fastScrollSensitivity: context.setting.terminal.scroll.fast,
        minimumContrastRatio: context.setting.terminal.text.contrast,
        wordSeparator: context.setting.terminal.text.separator,
        allowTransparency: context.setting.terminal.theme.transparency,
        theme: themeColors
      });
    }
  }, [
    context.setting.terminal.cursor,
    context.setting.terminal.scroll,
    context.setting.terminal.text.contrast,
    context.setting.terminal.text.separator,
    context.setting.terminal.theme,
  ]);

  // TODO: send Ctrl+C under xs
  // TODO: config control lists in settings
  // const sendCtrl = React.useCallback((letter) => {
  //   const code = letter.toUpperCase().charCodeAt(0) - 64;
  //   if (code >= 1 && code <= 26) {
  //     xtermRef.current?.paste(String.fromCharCode(code));
  //   }
  // }, []);

  // after second tick, the globalSwitch were set properly
  React.useEffect(() => {
    if (
      context.secondTick
        && context.isAuthority
        && containerRef.current
        && context.setting.terminal.enable
    ) {
      // TODO: ask for agreements
      const fitAddon = new FitAddon();
      const xterm = new XTerminal({
        windowsPty: context.platform === "win32"
          ? { backend: "conpty" }
          : undefined,
        altClickMovesCursor: true,
        convertEol: false,
        customGlyphs: true,
        disableStdin: false,
        ignoreBracketedPasteMode: false,
        scrollOnUserInput: true,
        smoothScrollDuration: 0,
        cursorBlink: context.setting.terminal.cursor.blink,
        reflowCursorLine: context.setting.terminal.cursor.reflow,
        cursorStyle: context.setting.terminal.cursor.active,
        cursorInactiveStyle: context.setting.terminal.cursor.inactive,
        fontSize: context.setting.terminal.font.size,
        fontFamily: `"${context.setting.terminal.font.family}", monospace`,
        fontWeight: context.setting.terminal.font.weight,
        fontWeightBold: context.setting.terminal.font.weightBold,
        scrollback: context.setting.terminal.scroll.back,
        scrollSensitivity: context.setting.terminal.scroll.normal,
        fastScrollSensitivity: context.setting.terminal.scroll.fast,
        letterSpacing: context.setting.terminal.text.space,
        lineHeight: context.setting.terminal.text.height,
        minimumContrastRatio: context.setting.terminal.text.contrast,
        wordSeparator: context.setting.terminal.text.separator,
        allowTransparency: context.setting.terminal.theme.transparency,
        theme: {
          background: context.setting.terminal.theme.background,
          foreground: context.setting.terminal.theme.foreground,
          cursor: context.setting.terminal.theme.cursor,
          cursorAccent: context.setting.terminal.theme.cursorAccent,
          black: context.setting.terminal.theme.black,
          blue: context.setting.terminal.theme.blue,
          cyan: context.setting.terminal.theme.cyan,
          green: context.setting.terminal.theme.green,
          magenta: context.setting.terminal.theme.magenta,
          red: context.setting.terminal.theme.red,
          white: context.setting.terminal.theme.white,
          yellow: context.setting.terminal.theme.yellow,
          brightBlack: context.setting.terminal.theme.brightBlack,
          brightBlue: context.setting.terminal.theme.brightBlue,
          brightCyan: context.setting.terminal.theme.brightCyan,
          brightGreen: context.setting.terminal.theme.brightGreen,
          brightMagenta: context.setting.terminal.theme.brightMagenta,
          brightRed: context.setting.terminal.theme.brightRed,
          brightWhite: context.setting.terminal.theme.brightWhite,
          brightYellow: context.setting.terminal.theme.brightYellow,
          selectionBackground: context.setting.terminal.theme.selectionBackground
        }
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
    // terminal is enabled
    context.setting.terminal.enable
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
      {context.setting.terminal.enable
      ? <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            backgroundColor: context.setting.terminal.theme.background,
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
      : <Caption
        title={context.languagePicker("universal.placeholder.disabled.title")}
        caption={context.languagePicker("universal.placeholder.disabled.caption")}
      />}
    </RouteField>
  );
};

export default Terminal;
