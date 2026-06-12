import React from "react";
import Box from "@mui/joy/Box";
import { styled } from "@mui/joy/styles";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { Crepe, CrepeFeature } from "@milkdown/crepe";
import { editorViewOptionsCtx } from "@milkdown/kit/core";
import { getMarkdown, replaceAll } from "@milkdown/kit/utils";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import { editorViewCtx } from "@milkdown/kit/core";
import { linkTooltipAPI } from "@milkdown/kit/component/link-tooltip";
import { keymap } from "@milkdown/kit/prose/keymap";
import { $prose } from "@milkdown/kit/utils";
// import { emoji } from "@milkdown/plugin-emoji";
import Loading from "./Loading";
import RouteField from "../interface/RouteField";
import GlobalContext from "../interface/constants";

import "@milkdown/crepe/theme/common/style.css";
import "../interface/milk.css";

const MaildownField = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  "& [data-milkdown-root]": {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0
  },
  "& .milkdown": {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 2.5)
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(0, 3)
    }
  },
  "& .milkdown .ProseMirror": {
    wordBreak: "normal",
    overflowWrap: "anywhere",
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(0, 1, 8)
    },
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(0, 5, 8)
    }
  }
}));

const CrepeEditorInner = (props) => {
  const { fileContent } = props;
  const context = React.useContext(GlobalContext);

  useEditor((root) => {
    const isReloading = context.crepeRef.isLoaded();
    const crepe = new Crepe({
      root,
      defaultValue: isReloading
        ? context.crepeRef.snapshot.current
        : fileContent,
      features: {
        [CrepeFeature.Toolbar]: true,
      },
      featureConfigs: {
        [CrepeFeature.Cursor]: {
          width: 2,
        },
        [Crepe.Feature.LinkTooltip]: {
          inputPlaceholder: "Enter URL...",
          onCopyLink: () => console.log("Link copied"),
        }
      },
    });

    crepe.editor
      .config((ctx) => {
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          attributes: {
            spellcheck: "false"
          },
          scrollThreshold: {
            top: 0,
            right: 0,
            bottom: 64,
            left: 0
          },
          scrollMargin: {
            top: 0,
            right: 0,
            bottom: 64,
            left: 0
          }
        }));
        ctx.get(listenerCtx).markdownUpdated(() => {
          context.crepeRef.modify.current = true;
        });
      })
      .use($prose((ctx) => keymap({
        "Mod-k": () => {
          const { selection } = ctx.get(editorViewCtx).state;
          if (selection.empty) {
            return false;
          }
          ctx.get(linkTooltipAPI.key)
            .addLink(selection.from, selection.to);
          return true;
        }
      })))
      .use(listener);

    context.crepeRef.load(crepe.editor, { getMarkdown, replaceAll });
    return crepe;
  }, [
    context.setting.meta.language
    // TODO: add config in context.setting
    // spell check
    // enable tool bar
  ]);

  React.useEffect(() => {
    return () => {
      context.crepeRef.unload();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Milkdown />;
};

const CrepeEditor = (props) => {
  const context = React.useContext(GlobalContext);

  const [crepeState, setCrepeState] = React.useState(0);
  const [fileContent, setFileContent] = React.useState(null);

  React.useEffect(() => {
    setCrepeState(0);
    setTimeout(() => {
      // TODO: get filename by url path
      // TODO: get text from server via filename
      setCrepeState(1);
      setFileContent("# Theme Tester\n\n[TOC]\n\nH2 Header\n-------------\n\n### Characters\n\n~~Strikethrough~~\n\n<s>Strikethrough (when enable html tag decode.)</s>\n\n*Italic* _Italic_\n\n**Emphasis**  __Emphasis__\n\n***Emphasis Italic*** ___Emphasis Italic___\n\nSuperscript: X<sub>2</sub>\uff0cSubscript: O<sup>2</sup>\n\n**Abbreviation(link HTML abbr tag)**\n\n==High Light==\n\n`Inline Code`\n\n### Blockquotes\n\n> \"Blockquotes `Blockquotes`\", [Link](http://localhost/)\u3002\n>\n> > another blockquote\n\n### Links\n\n[Links](http://localhost/)\n\n### footnote\n\nHere\u2019s a simple footnote, [^1] and here\u2019s a longer one. [^bignote]\n\n[^1]: This is the first footnote.\n\n[^bignote]: Here's one with multiple paragraphs and code.\n\n### Code Blocks\n\n#### Inline code\n\n`$ npm install marked`\n\n#### JavaScript\u3000\n\n```javascript\nfunction test(){\n\tconsole.log(\"Hello world!\");\n}\n\n(function(){\n    var box = function(){\n        return box.fn.init();\n    };\n\n    box.prototype = box.fn = {\n        init : function(){\n            console.log('box.init()');\n\n\t\t\treturn this;\n        },\n\n\t\tadd : function(str){\n\t\t\talert(\"add\", str);\n\n\t\t\treturn this;\n\t\t},\n\n\t\tremove : function(str){\n\t\t\talert(\"remove\", str);\n\n\t\t\treturn this;\n\t\t}\n    };\n    \n    box.fn.init.prototype = box.fn;\n    \n    window.box =box;\n})();\n\nvar testBox = box();\ntestBox.add(\"jQuery\").remove(\"jQuery\");\n```\n\n#### HTML code\n\n```html\n<!DOCTYPE html>\n<html>\n    <head>\n        <mate charest=\"utf-8\" />\n        <title>Hello world!</title>\n    </head>\n    <body>\n        <h1>Hello world!</h1>\n    </body>\n</html>\n```\n\n### Lists\n\n#### Unordered list\n\n+ Item A\n+ Item B\n    + Item B 1\n    + Item B 2\n    + Item B 3\n\n#### Ordered list\n\n1. Item A\n2. Item B\n3. Item C\n\n#### GFM task list\n\n- [x] GFM task list 1\n- [x] GFM task list 2\n- [ ] GFM task list 3\n  - [ ] GFM task list 3-1\n  - [ ] GFM task list 3-2\n  - [ ] GFM task list 3-3\n\n### Tables\n\nFirst Header  | Second Header\n------------- | -------------\nContent Cell  | Content Cell\nContent Cell  | Content Cell \n\n| Function name | Description                    |\n| ------------- | ------------------------------ |\n| `help()`      | Display the help window.       |\n| `destroy()`   | **Destroy your computer!**     |\n\n| Item      | Value |\n| --------- | -----:|\n| Computer  | $1600 |\n| Phone     |   $12 |\n| Pipe      |    $1 |\n\n| Left-Aligned  | Center Aligned  | Right Aligned |\n| :------------ |:---------------:| -----:|\n| col 3 is      | some wordy text | $1600 |\n| col 2 is      | centered        |   $12 |\n| zebra stripes | are neat        |    $1 |\n\n----\n\n#### HTML entities\n\n&copy; &  &uml; &trade; &iexcl; &pound;\n\n&amp; &lt; &gt; &yen; &euro; &reg; &plusmn; &para; &sect; &brvbar; &macr; &laquo; &middot; \n\nX&sup2; Y&sup3; &frac34; &frac14;  &times;  &divide;   &raquo;\n\n18&ordm;C  &quot;  &apos;\n\n### $\\LaTeX$\n\n$$E=mc^2$$\n\nInline $$E=mc^2$$ Inline\uff0cInline $$E=mc^2$$ Inline\u3002\n\n$$(\\sqrt{3x-1}+(1+x)^2)$$\n\n$$\\sin(\\alpha)^{\\theta}=\\sum_{i=0}^{n}(x^i + \\cos(f))$$\n\n### Flow Chart\n\n```flow\nst=>start: Login\nop=>operation: Login operation\ncond=>condition: Successful Yes or No?\ne=>end: To admin\n\nst->op->cond\ncond(yes)->e\ncond(no)->op\n```\n\n### Sequence Diagram\n\n```sequence\nAndrew->China: Says Hello \nNote right of China: China thinks\nabout it \nChina-->Andrew: How are you? \nAndrew->>China: I am good thanks!\n```\n\n### End\n");
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // check if
    // load with auth naturally
    context.secondTick
  ]);

  return (
    <RouteField
      display
      path={[
        context.languagePicker("nav.utility.title"),
        context.languagePicker("nav.utility.milkdown")
      ]}
      title={context.languagePicker("nav.utility.milkdown")}
      sx={{
        px: 0,
        pb: 0,
        flexGrow: 1,
        minHeight: 0,
        height: "auto"
      }}
    >
      {(crepeState === 0 || fileContent === null) && <Loading pinned />}
      {(crepeState === 1 && fileContent !== null) &&
        <MaildownField>
          <MilkdownProvider>
            <CrepeEditorInner
              fileContent={fileContent}
            />
          </MilkdownProvider>
        </MaildownField>}
    </RouteField>
  );
}

export default CrepeEditor;
