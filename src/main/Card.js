import React from "react";
import { useParams } from "react-router";
import { useNavigate, useBlocker } from "react-router-dom";
import isValidFilename from "valid-filename";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListDivider from "@mui/joy/ListDivider";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import IconButton from "@mui/joy/IconButton";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import RouteField from "../interface/RouteField";
import GlobalContext, {
  request,
  Status,
  encodePath,
  toast
} from "../interface/constants";
import Loading from "./Loading";
import Caption from "../components/Caption";
import Tree from "../modal/Tree";
import ModalForm from "../modal/Form";
import { SemiTextarea } from "../interface/SemiInput";

const isValid = (hare) => {
  if (!Array.isArray(hare)) {
    return false;
  }
  const ids = new Set();
  let pointLength;
  return hare.every((item) => {
    if (
      item === null
        || typeof item !== "object"
        || Array.isArray(item)
        || typeof item.id !== "string"
        || item.id.length === 0
        || ids.has(item.id)
        || typeof item.query !== "string"
        || typeof item.key !== "string"
        || !Number.isFinite(item.time)
        || !Array.isArray(item.point)
        || !item.point.every((point) => [-1, 0, 1].includes(point))
        || (pointLength !== undefined && item.point.length !== pointLength)
    ) {
      return false;
    }
    ids.add(item.id);
    pointLength = item.point.length;
    return true;
  });
};

const CardRowMenu = ({ handleEdit, handleDelete, disabled }) => (
  <Dropdown>
    <MenuButton
      disabled={disabled}
      slots={{ root: IconButton }}
      slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
    >
      <MoreHorizRoundedIcon sx={{ display: { xs: "none", sm: "inline-flex" } }} />
      <MoreVertRoundedIcon sx={{ display: { xs: "inline-flex", sm: "none" } }} />
    </MenuButton>
    <Menu size="sm" sx={{ minWidth: 140 }}>
      <MenuItem onClick={handleEdit}>编辑</MenuItem>
      <Divider />
      <MenuItem color="danger" onClick={handleDelete}>删除</MenuItem>
    </Menu>
  </Dropdown>
);

const Card = () => {
  const navigate = useNavigate();
  const context = React.useContext(GlobalContext);

  // § url path analysis
  const { "*": rawFolderName } = useParams();
  const folderName = React.useMemo(
    () => rawFolderName
      .replace(/\/+/g, "/")
      .replace(/^\//, "")
      .replace(/\/$/, ""),
    [rawFolderName]
  );

  const folderPart = React.useMemo(
    () => folderName.split("/"),
    [folderName]
  );
  const cardType = folderPart[0];
  const cardPath = folderPart.slice(1, -1).join("/");
  const cardTitle = folderName.length
    ? folderPart.slice(-1)[0]
    : "卡片";

  // § general states
  const [cardState, setCardState] = React.useState(0);
  const [cards, setCards] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [memorizing, setMemorizing] = React.useState(false);

  const [uploadLoading, setUploadLoading] = React.useState(false);
  const [memoryLoading, setMemoryLoading] = React.useState(false);
  const [syncLoading, setSyncLoading] = React.useState(false);
  const [syncError, setSyncError] = React.useState(false);

  const loadedPathRef = React.useRef(null);
  const authorityRef = React.useRef(context.isAuthority);
  const queryRef = React.useRef(null);
  const keyRef = React.useRef(null);
  const uploadRef = React.useRef(null);

  const cardsRef = React.useRef(cards);
  const memoryLockRef = React.useRef(false);
  const syncRef = React.useRef({ count: 0, saved: 0, lastClick: 0, promise: null });
  const syncTimerRef = React.useRef(null);
  cardsRef.current = cards;

  React.useEffect(() => {
    syncRef.current = { count: 0, saved: 0, lastClick: 0, promise: null };
    memoryLockRef.current = false;
    setSyncLoading(false);
    setSyncError(false);
    setMemoryLoading(false);
    return () => {
      clearTimeout(syncTimerRef.current);
      syncRef.current = { count: 0, saved: 0, lastClick: 0, promise: null };
    };
  }, [context.isAuthority, folderName]);

  // § import & export
  const handleDownload = React.useCallback(() => {
    const blob = new Blob(
      [JSON.stringify(cards, null, 2)],
      { type: "application/json;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = cardTitle.endsWith(".hare") ? cardTitle : `${cardTitle}.hare`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [cards, cardTitle]);

  const handleUpload = React.useCallback((event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || uploadLoading) {
      return;
    }

    setUploadLoading(true);
    toast.promise(new Promise((resolve, reject) => {
      file
        .text()
        .then((text) => JSON.parse(text))
        .then((uploaded) => {
          if (loadedPathRef.current !== folderName) {
            return;
          }
          if (Array.isArray(uploaded)) {
            uploaded = uploaded.map((item) =>
              item !== null && typeof item === "object" && !Array.isArray(item)
                ? { time: 0, point: [], ...item }
                : item
            );
          }
          if (!Array.isArray(uploaded) || !uploaded.every((item) =>
            item !== null
              && typeof item === "object"
              && !Array.isArray(item)
              && isValid([{ id: "pending", ...item }])
          )) {
            reject("上传的 hare 格式无效，请检查字段和历史记录");
            return;
          }

          const ids = new Set(cards.map((item) => item.id));
          const reservedIds = new Set([
            ...ids,
            ...uploaded.map((item) => item.id)
          ]);
          const imported = uploaded.map((item) => {
            let id = item.id;
            if (id === undefined || ids.has(id)) {
              do {
                id = Array.from(crypto.getRandomValues(new Uint8Array(16)),
                  (value) => value.toString(16).padStart(2, "0")
                ).join("");
              } while (reservedIds.has(id));
              reservedIds.add(id);
            }
            ids.add(id);
            return { ...item, id };
          });
          const merged = [...cards, ...imported];
          const pointLength = merged.reduce(
            (length, item) => Math.max(length, item.point.length),
            0
          );
          const hare = merged.map((item) => ({...item, point: [
            ...Array(pointLength - item.point.length).fill(-1),
            ...item.point
          ]}));

          if (folderName.length && context.isAuthority) {
            request(
              "POST/utility/hare/save",
              {
                type: cardType,
                folderName: cardPath,
                filename: cardTitle,
                create: false,
                hare: hare
              },
              undefined,
              reject
            ).then(() => {
              if (loadedPathRef.current === folderName) {
                setCards(hare);
              }
              resolve();
            });
          } else {
            setCards(hare);
            if (folderName.length && uploaded.length) {
              setModified(true);
            }
            resolve();
          }
        }, () => {
          reject("无法读取文件或 JSON 解析失败");
        }).catch(reject);
    }).finally(() => setUploadLoading(false)), {
      loading: "正在上传…",
      success: "已上传",
      error: (data) => data
    });
  }, [
    context.isAuthority,
    cards,
    cardType,
    cardPath,
    cardTitle,
    folderName,
    uploadLoading
  ]);

  // § cards' CRUD
  const [modalCardOpen, setModalCardOpen] = React.useState(false);
  const [modalCardLoading, setModalCardLoading] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState(null);
  const [formQuery, setFormQuery] = React.useState("");
  const [formKey, setFormKey] = React.useState("");

  const handleToggleCard = React.useCallback((item = null) => {
    setEditingCard(item);
    setFormQuery(item?.query ?? "");
    setFormKey(item?.key ?? "");
    setModalCardOpen(true);
  }, []);

  const handleCloseCard = React.useCallback(() => {
    if (!modalCardLoading) {
      setModalCardOpen(false);
    }
  }, [modalCardLoading]);

  const handleSubmitCard = React.useCallback(() => {
    const query = queryRef.current.value;
    const key = keyRef.current.value;
    if (
      (editingCard && query === editingCard.query && key === editingCard.key)
        || !query.trim()
        || !key.trim()
    ) {
      return;
    }

    const applyCard = (item) => {
      setCards((cards) => editingCard
        ? cards.map((card) => card.id === editingCard.id
          ? { ...card, query, key }
          : card
        )
        : [...cards, item]
      );
      setModalCardOpen(false);
      setModalCardLoading(false);
    };

    if (folderName.length && context.isAuthority) {
      setModalCardLoading(true);
      const handleFailure = () => {
        if (loadedPathRef.current === folderName) {
          setModalCardLoading(false);
        }
      };
      toast.promise(new Promise((resolve, reject) => {
        request(
          editingCard ? "POST/utility/hare/edit" : "POST/utility/hare/add",
          {
            type: cardType,
            folderName: cardPath,
            filename: cardTitle,
            ...(editingCard ? { id: editingCard.id } : {}),
            query,
            key
          },
          { "": handleFailure },
          reject
        ).then(({ statusCode, errorCode, ...item }) => {
          if (loadedPathRef.current === folderName) {
            applyCard(item);
          }
          resolve();
        });
      }), {
        loading: editingCard ? "正在修改…" : "正在添加…",
        success: editingCard ? "修改成功" : "添加成功",
        error: (data) => data
      });
    } else {
      let id, item;
      if (!editingCard) {
        const ids = new Set(cards.map((card) => card.id));
        do {
          id = Array.from(crypto.getRandomValues(new Uint8Array(16)),
            (value) => value.toString(16).padStart(2, "0")
          ).join("");
        } while (ids.has(id));
        item = {
          id,
          query,
          key,
          time: Date.now(),
          point: Array(cards.length ? cards[0].point.length : 0).fill(-1)
        };
      }
      applyCard(item);
      if (folderName.length) {
        setModified(true);
      }
    }
  }, [
    context.isAuthority,
    cardType,
    cardPath,
    cardTitle,
    cards,
    folderName,
    editingCard
  ]);

  const handleDeleteCard = React.useCallback((item) => {
    context.setModalReconfirm({
      open: true,
      captionFirstHalf: `正在删除「${item.query}」。`,
      handleAction: () => {
        const removeCard = () => setCards(
          (cards) =>
            cards.filter((card) => card.id !== item.id)
        );

        if (context.isAuthority && folderName.length) {
          toast.promise(new Promise((resolve, reject) => {
            request(
              "POST/utility/hare/delete",
              {
                type: cardType,
                folderName: cardPath,
                filename: cardTitle,
                id: item.id
              },
              undefined,
              reject
            ).then(() => {
              if (loadedPathRef.current === folderName) {
                removeCard();
              }
              resolve();
            });
          }), {
            loading: "正在删除…",
            success: "删除成功",
            error: (data) => data
          });
        } else {
          removeCard();
          if (folderName.length) {
            setModified(true);
          }
        }
      }
    });
  }, [context, folderName, cardType, cardPath, cardTitle]);

  // § cards' saving
  const [modalTree, setModalTree] = React.useState({
    open: false,
    handleAction: () => { },
    handleCancel: () => { }
  });

  const handleCloseModalTree = React.useCallback(() => {
    setModalTree((modalTree) => ({ ...modalTree, open: false }));
  }, []);

  const handleToggleSave = React.useCallback(() => {
    if (!context.isAuthority || folderName.length) {
      return;
    }
    setModalTree({
      open: true,
      initValue: "未命名",
      endDecorator: ".hare",
      handleAction: ([folderPath, name]) => {
        const path = folderPath.split("/").filter(Boolean);
        const type = path[0];
        const folderName = path.slice(1).join("/");
        const filename = `${name}.hare`;
        if (!name.trim() || !isValidFilename(name)) {
          toast.error("文件名无效");
          handleCloseModalTree();
          return;
        }

        toast.promise(new Promise((resolve, reject) => {
          request(
            "POST/utility/hare/save",
            { type, folderName, filename, create: true, hare: cards },
            { "": handleCloseModalTree },
            reject
          ).then(() => {
            handleCloseModalTree();
            setModified(false);
            setSavedPath(`/card/${type}/${encodePath(folderName)}/${encodeURIComponent(filename)}`);
            resolve();
          });
        }), {
          loading: "正在保存…",
          success: "保存成功",
          error: (data) => data
        });
      },
      handleCancel: () => { }
    });
  }, [
    context.isAuthority,
    folderName,
    cards,
    handleCloseModalTree
  ]);

  // § initialization
  const display = React.useMemo(() => {
    return cardType !== "private" || context.isAuthority;
  }, [cardType, context.isAuthority]);

  React.useEffect(() => {
    const loggedIn = !authorityRef.current && context.isAuthority;
    authorityRef.current = context.isAuthority;

    // same file or same temp page
    if (loadedPathRef.current === folderName) {
      // logged in to the same file
      if (loggedIn && folderName.length && modified) {
        const session = syncRef.current;
        memoryLockRef.current = true;
        setMemoryLoading(true);
        setSyncLoading(true);
        session.promise = new Promise((resolve, reject) => {
          request(
            "POST/utility/hare/save",
            {
              type: cardType,
              folderName: cardPath,
              filename: cardTitle,
              create: false,
              hare: cards
            },
            undefined,
            reject
          ).then(() => {
            if (syncRef.current === session) {
              setModified(false);
            }
            resolve();
          });
        }).catch((error) => {
          if (syncRef.current === session) {
            setSyncError(true);
          }
          throw error;
        }).finally(() => {
          session.promise = null;
          if (syncRef.current === session) {
            memoryLockRef.current = false;
            setMemoryLoading(false);
            setSyncLoading(false);
          }
        });
        toast.promise(session.promise, {
          loading: "正在保存…",
          success: "保存成功",
          error: (data) => data
        });
      }
    // different file
    } else {
      loadedPathRef.current = null;
      setCardState(0);
      setCards([]);
      setSearch("");
      setMemorizing(false);
      setModified(false);
      setModalCardOpen(false);
      setModalCardLoading(false);

      // after second tick, the globalSwitch were set properly
      if (context.secondTick && display) {
        if (folderName.length) {
          request(
            "GET/utility/hare/list",
            {
              type: cardType,
              folderName: cardPath,
              filename: cardTitle
            },
            {
              [Status.execErrCode.ResourcesUnexist]: () => setCardState(-1),
              [Status.execErrCode.FileModuleError]: () => setCardState(-2),
              [Status.execErrCode.TypeCheckFailed]: () => setCardState(-2)
            }
          ).then(({ hare }) => {
            loadedPathRef.current = folderName;
            setCards(hare);
            setCardState(1);
          });
        } else {
          loadedPathRef.current = folderName;
          setCardState(1);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // check if
    // load with auth naturally
    context.secondTick,
    // login in same page
    context.isAuthority,
    // url is changed directly
    rawFolderName
  ]);

  // § modification & blocker
  const [modified, setModified] = React.useState(false);
  const [savedPath, setSavedPath] = React.useState(null);
  const unsaved = modified || (
    !savedPath
      && !folderName.length
      && cards.length > 0
  );

  const blocker = useBlocker(({ nextLocation, historyAction }) =>
    unsaved
      && !(historyAction !== 'POP' && nextLocation.state?.logout)
  );
  const blockerActiveRef = React.useRef(false);

  React.useEffect(() => {
    if (blocker.state === "blocked") {
      blockerActiveRef.current = true;
      context.setModalReconfirm({
        open: true,
        caption: "修改尚未保存，是否放弃并离开？",
        handleAction: () => {
          blockerActiveRef.current = false;
          setModified(false);
          blocker.proceed();
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);

  React.useEffect(() => {
    if (blockerActiveRef.current && !context.modalReconfirm?.open) {
      blockerActiveRef.current = false;
      blocker.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.modalReconfirm?.open]);

  React.useEffect(() => {
    if (unsaved) {
      const handler = (event) => {
        event.preventDefault();
        event.returnValue = "";
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [unsaved]);

  React.useEffect(() => {
    if (!modified && savedPath) {
      setSavedPath(null);
      navigate(savedPath);
    }
  }, [modified, savedPath, navigate]);

  // § start & continue
  const unfinished = cards.some(
    (item) =>
      item.point[item.point.length - 1] === -1
  );

  const handleSync = React.useCallback(() => {
    const session = syncRef.current;
    if (session.promise) {
      return session.promise;
    }
    if (
      session.count === session.saved
      || !context.isAuthority
      || !folderName.length
    ) {
      return Promise.resolve();
    }

    clearTimeout(syncTimerRef.current);
    const snapshot = cardsRef.current;
    const count = session.count;
    if (!snapshot.length) {
      session.saved = count;
      setModified(false);
      return Promise.resolve();
    }
    const index = snapshot[0]?.point.length - 1;
    const update = Object.fromEntries(snapshot.map(
      (item) =>
        [item.id, item.point[index]]
    ));

    setSyncLoading(true);
    setSyncError(false);
    session.promise = new Promise((resolve, reject) => {
      request(
        "POST/utility/hare/sync",
        {
          type: cardType,
          folderName: cardPath,
          filename: cardTitle,
          start: false,
          index: index,
          update: update
        },
        undefined,
        reject
      ).then(resolve);
    }).then(() => {
      if (syncRef.current === session) {
        session.saved = count;
        setModified(session.count !== session.saved);
      }
    }).catch((error) => {
      if (syncRef.current === session) {
        setSyncError(true);
      }
      throw error;
    }).finally(() => {
      session.promise = null;
      if (syncRef.current === session) {
        setSyncLoading(false);
      }
    });
    return session.promise;
  }, [
    context.isAuthority,
    folderName,
    cardType,
    cardPath,
    cardTitle
  ]);

  React.useEffect(() => {
    const session = syncRef.current;
    if (
      !context.isAuthority
        || !folderName.length
        || !memorizing
        || memoryLoading
        || syncLoading
        || syncError
        || session.count === session.saved
    ) {
      return;
    }

    const remains = session.lastClick + 2000 - Date.now();
    const delay = session.count - session.saved >= 10 ? 0 : Math.max(0, remains);
    syncTimerRef.current = setTimeout(() => {
      handleSync()
        .catch((error) => {
          if (syncRef.current === session && !memoryLockRef.current) {
            toast.error(error);
          }
        });
    }, delay);
    return () => clearTimeout(syncTimerRef.current);
  }, [
    context.isAuthority,
    cards,
    memorizing,
    memoryLoading,
    syncLoading,
    syncError,
    folderName,
    handleSync
  ]);

  const handleStart = React.useCallback(() => {
    if (!cardsRef.current.length || memoryLockRef.current) {
      return;
    }
    const session = syncRef.current;
    const start = () => {
      if (syncRef.current !== session) {
        return;
      }
      const next = cardsRef.current.map((item) => ({ ...item, point: [...item.point, -1] }));
      cardsRef.current = next;
      setCards(next);
      session.count = 0;
      session.saved = 0;
      setSyncError(false);
      setMemorizing(true);
      if (folderName.length && !context.isAuthority) {
        setModified(true);
      }
    };
    if (context.isAuthority && folderName.length) {
      memoryLockRef.current = true;
      setMemoryLoading(true);
      Promise.resolve().then(() => {
        if (syncRef.current !== session) {
          return Promise.reject();
        }
        return new Promise((resolve, reject) => {
          request(
            "POST/utility/hare/sync",
            {
              type: cardType,
              folderName: cardPath,
              filename: cardTitle,
              start: true
            },
            undefined,
            reject
          ).then(resolve);
        });
      })
        .then(start)
        .catch((error) => {
          if (syncRef.current === session) {
            toast.error(error);
          }
        })
        .finally(() => {
          if (syncRef.current === session) {
            memoryLockRef.current = false;
            setMemoryLoading(false);
          }
        });
    } else {
      start();
    }
  }, [
    context.isAuthority,
    folderName,
    cardType,
    cardPath,
    cardTitle,
    handleSync
  ]);

  const handleContinue = React.useCallback(() => {
    if (unfinished && !memoryLockRef.current) {
      setMemorizing(true);
    }
  }, [unfinished]);

  const handleEnd = React.useCallback(() => {
    if (memoryLockRef.current) {
      return;
    }
    const message = cardsRef.current.some(
      (item) =>
        item.point[item.point.length - 1] === -1
    ) ? "已中止" : "已结束";
    clearTimeout(syncTimerRef.current);

    if (!folderName.length || !context.isAuthority) {
      setMemorizing(false);
      toast.success(message);
      return;
    }

    const session = syncRef.current;
    memoryLockRef.current = true;
    setMemoryLoading(true);

    toast.promise(handleSync().then(() => {
      if (syncRef.current === session) {
        return handleSync();
      }
    }).then(() => {
      if (syncRef.current === session) {
        setMemorizing(false);
      }
    }).finally(() => {
      if (syncRef.current === session) {
        memoryLockRef.current = false;
        setMemoryLoading(false);
      }
    }), {
      loading: "正在保存记忆结果…",
      success: message,
      error: (error) => error
    });
  }, [folderName, context.isAuthority, handleSync]);

  const handleAnswer = React.useCallback((id) => {
    if (!memorizing || memoryLockRef.current) {
      return;
    }
    const next = cardsRef.current.map((item) => item.id === id
      ? {
        ...item,
        point: [
          ...item.point.slice(0, -1),
          item.point[item.point.length - 1] === 1 ? 0 : 1
        ]
      }
      : item
    );
    cardsRef.current = next;
    setCards(next);
    if (folderName.length) {
      setModified(true);
    }
    if (folderName.length && context.isAuthority) {
      syncRef.current.count += 1;
      syncRef.current.lastClick = Date.now();
      setSyncError(false);
    }
  }, [memorizing, folderName, context.isAuthority]);

  const renderAnswer = React.useCallback((item) => {
    const point = item.point[item.point.length - 1];
    const hidden = memorizing && point === -1;

    return (
      <Box
        component={memorizing ? "button" : "div"}
        type={memorizing ? "button" : undefined}
        onClick={memorizing ? () => handleAnswer(item.id) : undefined}
        sx={{
          display: "block",
          width: "100%",
          boxSizing: "border-box",
          border: 0,
          borderRadius: "sm",
          px: 1,
          py: 0.75,
          textAlign: "left",
          cursor: memorizing ? "pointer" : "default",
          bgcolor: !memorizing
            ? "transparent"
            : hidden
            ? "neutral.300"
            : point === 1
            ? "success.softBg"
            : "danger.softBg",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.500",
            outlineOffset: 2
          }
        }}
      >
        <Typography
          component="span"
          level="body-xs"
          sx={{
            display: "block",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            visibility: hidden ? "hidden" : "visible"
          }}
        >
          {item.key}
        </Typography>
      </Box>
    );
  }, [memorizing, handleAnswer]);

  // § search & sort
  const filteredCards = cards.filter(
    (item) => `${item.query}\n${item.key}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <RouteField
      display={display}
      path={
        folderName.length
          ? [cardType === "private" ? "私有文件" : "公共文件", ...folderPart.slice(1)]
          : ["实用", "卡片"]
      }
      link={folderName.length ? `/${encodePath(folderName)}` : undefined}
      title={cardTitle}
      sxRaw={{ overflowY: "hidden" }}
      sx={{
        flexDirection: "column",
        minHeight: 0,
        overflowY: { xs: "auto", sm: "hidden" },
        overflowX: { xs: "auto", sm: "hidden" },
        height: { xs: "auto", sm: "100%" }
      }}
    >
      {cardState === 0 && <Loading pinned />}
      {cardState === -1 && <Caption title="资源不存在" />}
      {cardState === -2 && <Caption title="无效的 hare 格式" />}
      {cardState === 1 && <React.Fragment>
        <Box
          className="SearchAndFilters"
          sx={{ display: "flex", flexWrap: "nowrap", gap: 1.5, pb: 2, borderRadius: "sm" }}
        >
          <Input
            size="sm"
            placeholder="搜索"
            autoComplete="off"
            startDecorator={<SearchIcon />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ flex: 1, minWidth: 0 }}
          />
          {memorizing ? <Button
            size="sm"
            startDecorator={<CloseOutlinedIcon />}
            loading={memoryLoading}
            onClick={handleEnd}
            sx={{ flexShrink: 0 }}
          >
            结束
          </Button> : <Dropdown>
            <MenuButton
              size="sm"
              variant="solid"
              color="primary"
              startDecorator={<DoneOutlinedIcon />}
              disabled={memoryLoading || uploadLoading}
              sx={{ flexShrink: 0 }}
            >
              操作
            </MenuButton>
            <Menu size="sm" placement="bottom-end" sx={{ minWidth: 140 }}>
              {folderName.length === 0 && <React.Fragment>
                <MenuItem
                  disabled={!context.isAuthority}
                  onClick={handleToggleSave}
                >
                  保存
                </MenuItem>
                <Divider />
              </React.Fragment>}
              <MenuItem
                disabled={!cards.length}
                onClick={handleStart}
              >
                开始
              </MenuItem>
              <MenuItem
                disabled={!unfinished}
                onClick={handleContinue}
              >
                继续
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleToggleCard()}>
                添加
              </MenuItem>
              <MenuItem disabled={uploadLoading} onClick={() => uploadRef.current?.click()}>
                上传
              </MenuItem>
              <MenuItem onClick={handleDownload}>
                下载
              </MenuItem>
            </Menu>
          </Dropdown>}
        </Box>
        <Sheet
          className="OrderTableContainer"
          variant="outlined"
          sx={{
            display: { xs: "none", sm: "initial" },
            width: "100%",
            height: "100%",
            borderRadius: "sm",
            flexShrink: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "auto"
          }}
        >
          <Table
            stickyHeader
            hoverRow
            sx={{
              "--TableCell-headBackground": "var(--joy-palette-background-level1)",
              "--Table-headerUnderlineThickness": "1px",
              "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
              "--TableCell-paddingY": "4px",
              "--TableCell-paddingX": "8px"
            }}
          >
            <thead>
              <tr>
                <th style={{ width: 24 }}></th>
                <th style={{ width: 100, padding: "12px 6px" }}>问题</th>
                <th style={{ width: 200, padding: "12px 6px" }}>答案</th>
                <th style={{ width: 100, padding: "12px 6px" }}>创建时间</th>
                <th style={{ width: 100, padding: "12px 6px" }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((item) => (
                <tr key={item.id}>
                  <td></td>
                  <td><Typography level="body-xs">{item.query}</Typography></td>
                  <td><Box sx={{ ml: -1, mr: 1 }}>{renderAnswer(item)}</Box></td>
                  <td>
                    <Typography level="body-xs">
                      {new Date(item.time).toLocaleString("zh-CN", { hour12: false })}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <CardRowMenu
                        disabled={memorizing || memoryLoading}
                        handleEdit={() => handleToggleCard(item)}
                        handleDelete={() => handleDeleteCard(item)}
                      />
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
        <Box sx={{ display: { xs: "block", sm: "none" }, overflowY: "visible" }}>
          {filteredCards.map((item, index, self) => (
            <List key={item.id} size="sm" sx={{ "--ListItem-paddingX": 0 }}>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start"
                }}
              >
                <ListItemContent sx={{ display: "flex", gap: 2, alignItems: "start" }}>
                  <Box sx={{ width: "100%", minWidth: 0 }}>
                    <Typography fontWeight={600} gutterBottom>{item.query}</Typography>
                    <Typography level="body-xs" gutterBottom>
                      创建于 {new Date(item.time).toLocaleString("zh-CN", { hour12: false })}
                    </Typography>
                    <Box sx={{ mx: -1, mb: 1 }}>{renderAnswer(item)}</Box>
                  </Box>
                </ListItemContent>
                <CardRowMenu
                  disabled={memorizing || memoryLoading}
                  handleEdit={() => handleToggleCard(item)}
                  handleDelete={() => handleDeleteCard(item)}
                />
              </ListItem>
              {index !== self.length - 1 && <ListDivider />}
            </List>
          ))}
        </Box>
      </React.Fragment>}
      {modalCardOpen && <ModalForm
        open={modalCardOpen}
        loading={modalCardLoading}
        disabled={
          !formQuery.trim() || !formKey.trim()
            || (editingCard && formQuery === editingCard.query && formKey === editingCard.key)
        }
        handleClose={handleCloseCard}
        handleClick={handleSubmitCard}
        title={editingCard ? "编辑条目" : "添加条目"}
        button="提交"
      >
        <FormControl>
          <FormLabel>问题</FormLabel>
          <SemiTextarea
            ref={queryRef}
            initValue={formQuery}
            setValue={setFormQuery}
            minRows={3}
            maxRows={6}
            autoFocus
            disabled={modalCardLoading}
          />
        </FormControl>
        <FormControl>
          <FormLabel>答案</FormLabel>
          <SemiTextarea
            ref={keyRef}
            initValue={formKey}
            setValue={setFormKey}
            minRows={4}
            maxRows={8}
            disabled={modalCardLoading}
          />
        </FormControl>
      </ModalForm>}
      <input ref={uploadRef} hidden type="file" accept=".hare" onChange={handleUpload} />
      {modalTree.open && <Tree
        modalTree={modalTree}
        handleCloseModalTree={handleCloseModalTree}
      />}
    </RouteField>
  )
}

export default Card;
