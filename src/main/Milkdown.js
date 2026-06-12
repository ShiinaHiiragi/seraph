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
      setFileContent(`Aliqua reprehenderit minim ut amet ullamco magna deserunt do consectetur. Occaecat irure veniam duis laborum cupidatat ut ipsum aute. Labore deserunt laborum non et excepteur labore quis sint. Consectetur reprehenderit voluptate consequat ea non commodo proident quis voluptate fugiat non irure cillum.\n\nAute quis voluptate consequat tempor aliqua. Ipsum occaecat aliquip duis consequat elit quis consectetur duis minim eiusmod duis labore voluptate laborum. Elit in sint qui cillum ipsum Lorem dolor qui. Do id do culpa reprehenderit qui. In exercitation amet sunt ad ex sit commodo tempor. Culpa veniam eu id culpa labore qui cupidatat mollit deserunt.\n\nIncididunt sint voluptate officia magna laboris anim exercitation occaecat et nisi id. Eiusmod Lorem nostrud sint cupidatat aliquip. Do aute aliqua exercitation dolor culpa excepteur ut. Exercitation duis veniam officia id culpa irure tempor. Dolor fugiat mollit anim ex mollit irure. Veniam do amet et ex incididunt eiusmod incididunt qui eiusmod officia sunt voluptate ipsum cupidatat.\n\nAd aliqua eiusmod duis eu elit. Officia exercitation reprehenderit reprehenderit Lorem laboris id reprehenderit ex anim veniam dolore aute anim. Laborum eu do aute ea.\n\nVelit sunt consectetur velit aliquip Lorem. Laborum exercitation adipisicing in cupidatat. Nostrud culpa et pariatur fugiat commodo ad. Irure aliquip ut ullamco ad minim nisi.\n\nReprehenderit pariatur esse dolore pariatur ex fugiat nisi esse nulla deserunt dolor. Commodo incididunt consequat velit enim. Velit elit magna et consequat magna cillum cupidatat. Cupidatat deserunt pariatur nostrud ipsum consectetur incididunt deserunt nisi pariatur. Irure veniam Lorem eiusmod et excepteur ad dolore dolore. Incididunt elit cupidatat quis est exercitation minim.\n\nCupidatat cillum ea in enim occaecat et laborum officia nostrud duis ut deserunt culpa et. Quis ea amet et id ipsum veniam reprehenderit consectetur id duis esse. Esse laborum laboris sit Lorem sit voluptate in in laborum ipsum Lorem. Eiusmod commodo nulla eu cillum laboris laboris mollit voluptate nulla. Enim voluptate aliquip sit excepteur est. Elit nulla aliqua mollit anim exercitation labore cupidatat officia fugiat elit laborum do.\n\nMinim velit reprehenderit occaecat anim proident sunt in esse. Anim deserunt labore aliquip in amet labore ea sunt deserunt occaecat. Et dolore consequat tempor occaecat eiusmod cupidatat voluptate.\n\nCommodo cillum officia duis cillum mollit sunt excepteur velit laboris reprehenderit id Lorem veniam consectetur. Laboris eiusmod aliquip dolore ex voluptate minim occaecat dolor est ut mollit dolore. Qui eiusmod anim duis cupidatat nostrud minim nostrud tempor amet est velit culpa non.\n\nLaborum deserunt sit laborum Lorem sit in dolore velit aliquip. Non ex pariatur excepteur nisi ipsum reprehenderit amet laborum incididunt ad. Adipisicing tempor eiusmod enim fugiat sit velit ad quis ex reprehenderit deserunt.`.repeat(10));
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
