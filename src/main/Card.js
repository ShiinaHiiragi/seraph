import React from "react";
import { useParams } from "react-router";
import { useNavigate, useBlocker } from "react-router-dom";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import Input from "@mui/joy/Input";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import SearchIcon from "@mui/icons-material/Search";
import Table from "@mui/joy/Table";
import Link from "@mui/joy/Link";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
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

const isValidCard = (hare) => {
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

const CardRowMenu = ({ context, handleEdit, handleDelete, disabled }) => (
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
      <MenuItem onClick={handleEdit}>
        {context.languagePicker("main.card.rowMenu.edit")}
      </MenuItem>
      <Divider />
      <MenuItem color="danger" onClick={handleDelete}>
        {context.languagePicker("main.card.rowMenu.delete")}
      </MenuItem>
    </Menu>
  </Dropdown>
);

const Card = () => {
  const navigate = useNavigate();
  const context = React.useContext(GlobalContext);
  const { setGlobalModified } = context;

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
    : context.languagePicker("nav.utility.card");

  // § core states & initialization
  const [cardState, setCardState] = React.useState(0);
  const [cards, setCards] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [memorizing, setMemorizing] = React.useState(false);

  const cardsRef = React.useRef(cards);
  cardsRef.current = cards;

  const [operationLock, setOperationLock] = React.useState(false);
  const [syncLock, setSyncLock] = React.useState(false);
  const [syncError, setSyncError] = React.useState(false);

  const operationLockRef = React.useRef(false);
  const syncRef = React.useRef({
    count: 0,
    saved: 0,
    lastClick: 0,
    promise: null
  });
  const syncTimerRef = React.useRef(null);
  const syncable = React.useMemo(
    () => context.isAuthority && folderName.length,
    [context.isAuthority, folderName]
  );

  const loadedPathRef = React.useRef(null);
  const authorityRef = React.useRef(context.isAuthority);
  const display = React.useMemo(() => {
    return cardType !== "private" || context.isAuthority;
  }, [context.isAuthority, cardType]);
  const isSamePage = React.useCallback(
    () => loadedPathRef.current === folderName,
    [folderName]
  );

  React.useEffect(() => {
    const loggedIn = !authorityRef.current && context.isAuthority;
    authorityRef.current = context.isAuthority;

    setOperationLock(false);
    setSortLock(false);
    setSyncLock(false);
    setSyncError(false);
    operationLockRef.current = false;
    syncRef.current = {
      count: 0,
      saved: 0,
      lastClick: 0,
      promise: null
    };

    // same file or same temp page
    if (isSamePage()) {
      // logged in to the same file
      if (loggedIn && folderName.length && modified) {
        const session = syncRef.current;
        operationLockRef.current = true;
        setOperationLock(true);
        setSyncLock(true);
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
            operationLockRef.current = false;
            setOperationLock(false);
            setSyncLock(false);
          }
        });
        toast.promise(session.promise, {
          loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
          success: context.languagePicker("modal.toast.success.syncCard"),
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
    return () => {
      clearTimeout(syncTimerRef.current);
      syncRef.current = {
        count: 0,
        saved: 0,
        lastClick: 0,
        promise: null
      };
    };
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

  // § cards CRUD
  const [editingCard, setEditingCard] = React.useState(null);
  const [formQuery, setFormQuery] = React.useState("");
  const [formKey, setFormKey] = React.useState("");
  const [draggingFile, setDraggingFile] = React.useState(false);
  const queryRef = React.useRef(null);
  const keyRef = React.useRef(null);
  const uploadRef = React.useRef(null);

  const [modalCardOpen, setModalCardOpen] = React.useState(false);
  const [modalCardLoading, setModalCardLoading] = React.useState(false);
  const [modalTree, setModalTree] = React.useState({
    open: false,
    handleAction: () => { },
    handleCancel: () => { }
  });

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

    if (syncable) {
      setModalCardLoading(true);
      const handleFailure = () => {
        if (isSamePage()) {
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
          if (isSamePage()) {
            applyCard(item);
          }
          resolve();
        });
      }), {
        loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
        success: editingCard
          ? context.languagePicker("modal.toast.success.modCard")
          : context.languagePicker("modal.toast.success.new").format(query),
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
    context,
    syncable,
    cardType,
    cardPath,
    cardTitle,
    cards,
    folderName,
    editingCard,
    isSamePage
  ]);

  const handleDeleteCard = React.useCallback((item) => {
    context.setModalReconfirm({
      open: true,
      captionFirstHalf: context
        .languagePicker("modal.reconfirm.captionFirstHalf.deleteCard")
        .format(item.query),
      handleAction: () => {
        const removeCard = () => setCards(
          (cards) =>
            cards.filter((card) => card.id !== item.id)
        );

        if (syncable) {
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
              if (isSamePage()) {
                removeCard();
              }
              resolve();
            });
          }), {
            loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
            success: context
              .languagePicker("modal.toast.success.delete")
              .format(item.query),
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
  }, [
    syncable,
    context,
    folderName,
    cardType,
    cardPath,
    cardTitle,
    isSamePage
  ]);

  const handleCloseModalTree = React.useCallback(() => {
    setModalTree((modalTree) => ({ ...modalTree, open: false }));
  }, []);

  const handleToggleSave = React.useCallback(() => {
    if (!context.isAuthority || folderName.length) {
      return;
    }
    setModalTree({
      open: true,
      initValue: context.languagePicker("modal.tree.untitled"),
      endDecorator: ".hare",
      handleAction: ([folderPath, name]) => {
        const path = folderPath.split("/").filter(Boolean);
        const type = path[0];
        const folderName = path.slice(1).join("/");
        const filename = `${name}.hare`;

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
          loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
          success: context.languagePicker("modal.toast.success.saveCard"),
          error: (data) => data
        });
      },
      handleCancel: () => { }
    });
  }, [
    context,
    folderName,
    cards,
    handleCloseModalTree
  ]);

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

  const handleUpload = React.useCallback((file) => {
    if (!file) {
      return;
    }

    const upload = new Promise((resolve, reject) => {
      file
        .text()
        .then((text) => JSON.parse(text))
        .then((uploaded) => {
          if (!isSamePage()) {
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
              && isValidCard([{ id: "pending", ...item }])
          )) {
            reject(context.languagePicker("modal.toast.warning.illegalFormat"));
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

          if (syncable) {
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
              if (isSamePage()) {
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
        }, (error) => {
          reject(
            context.languagePicker("modal.toast.error.browserError")
              .format(error.name, error.message)
          );
        }).catch(reject);
    });
    if (syncable) {
      toast.promise(upload, {
        loading: context.languagePicker("modal.toast.plain.uploading"),
        success: context.languagePicker("modal.toast.success.itemsUpload"),
        error: (data) => data
      });
    } else {
      upload.catch((error) => toast.error(error));
    }
  }, [
    context,
    syncable,
    cards,
    cardType,
    cardPath,
    cardTitle,
    folderName,
    isSamePage
  ]);

  // § modification & blocker
  const [modified, setModified] = React.useState(false);
  const [sortLock, setSortLock] = React.useState(false);
  const [savedPath, setSavedPath] = React.useState(null);
  const unsaved = React.useMemo(() => modified || (
    !savedPath
      && !folderName.length
      && cards.length > 0
  ), [modified, savedPath, cards, folderName]);

  React.useLayoutEffect(() => {
    setGlobalModified(unsaved);
    return () => setGlobalModified(false);
  }, [unsaved, setGlobalModified]);

  const blocker = useBlocker(({ nextLocation, historyAction }) =>
    unsaved && !(
      historyAction !== 'POP'
        && nextLocation.state?.logout
    )
  );
  const blockerActiveRef = React.useRef(false);
  const blockerSyncRef = React.useRef(false);

  React.useEffect(() => {
    if (
      blockerActiveRef.current
        && !context.modalReconfirm?.open
        && blocker.state === "blocked"
    ) {
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
    if (session.count === session.saved || !syncable) {
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

    setSyncLock(true);
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
        setSyncLock(false);
      }
    });
    return session.promise;
  }, [
    syncable,
    cardType,
    cardPath,
    cardTitle
  ]);

  React.useEffect(() => {
    const session = syncRef.current;
    if (
      !syncable
        || !memorizing
        || operationLock
        || syncLock
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
          if (syncRef.current === session && !operationLockRef.current) {
            toast.error(error);
          }
        });
    }, delay);
    return () => clearTimeout(syncTimerRef.current);
  }, [
    syncable,
    cards,
    memorizing,
    operationLock,
    syncLock,
    syncError,
    handleSync
  ]);

  const handleStart = React.useCallback(() => {
    if (!cardsRef.current.length || operationLockRef.current) {
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
    if (syncable) {
      operationLockRef.current = true;
      setOperationLock(true);
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
            operationLockRef.current = false;
            setOperationLock(false);
          }
        });
    } else {
      start();
    }
  }, [
    syncable,
    context.isAuthority,
    folderName,
    cardType,
    cardPath,
    cardTitle
  ]);

  const handleContinue = React.useCallback(() => {
    if (unfinished && !operationLockRef.current) {
      setMemorizing(true);
    }
  }, [unfinished]);

  const handleEnd = React.useCallback(() => {
    if (operationLockRef.current) {
      return;
    }
    const message = cardsRef.current.some(
      (item) =>
        item.point[item.point.length - 1] === -1
    )
      ? context.languagePicker("modal.toast.success.pauseCard")
      : context
        .languagePicker("modal.toast.success.finishCard")
        .format((cardsRef.current.length
          ? cardsRef.current.filter(
            (item) =>
              item.point[item.point.length - 1] === 1
          ).length / cardsRef.current.length * 100
          : 0
        ).toFixed(2));
    clearTimeout(syncTimerRef.current);

    if (!syncable) {
      setMemorizing(false);
      return;
    }

    const session = syncRef.current;
    operationLockRef.current = true;
    setOperationLock(true);

    const ending = handleSync().then(() => {
      if (syncRef.current === session) {
        return handleSync();
      }
    }).then(() => {
      if (syncRef.current === session) {
        setMemorizing(false);
      }
    }).finally(() => {
      if (syncRef.current === session) {
        operationLockRef.current = false;
        setOperationLock(false);
      }
    });
    toast.promise(ending, {
      loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
      success: message,
      error: (error) => error
    });
    return ending;
  }, [context, syncable, handleSync]);

  React.useEffect(() => {
    if (blocker.state !== "blocked") {
      blockerActiveRef.current = false;
      return;
    }
    if (blockerSyncRef.current || blockerActiveRef.current) {
      return;
    }
    if (syncable && operationLock) {
      return;
    }
    if (!unsaved) {
      blocker.proceed();
      return;
    }
    const confirmDiscard = () => {
      blockerActiveRef.current = true;
      context.setModalReconfirm({
        open: true,
        caption: context.languagePicker("modal.reconfirm.caption.discardDraft"),
        handleAction: () => {
          setModified(false);
          blocker.proceed();
        }
      });
    };
    if (syncable && memorizing) {
      const session = syncRef.current;
      blockerSyncRef.current = true;
      handleEnd().then(() => {
        if (syncRef.current === session) {
          blocker.proceed();
        }
      }).catch(() => {
        if (syncRef.current === session) {
          confirmDiscard();
        }
      }).finally(() => {
        blockerSyncRef.current = false;
      });
      return;
    }
    confirmDiscard();
  }, [
    context,
    blocker,
    syncable,
    memorizing,
    operationLock,
    unsaved,
    handleEnd
  ]);

  const handleAnswer = React.useCallback((id) => {
    if (!memorizing || operationLockRef.current) {
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
    if (syncable) {
      syncRef.current.count += 1;
      syncRef.current.lastClick = Date.now();
      setSyncError(false);
    }
  }, [syncable, memorizing, folderName]);

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
          WebkitTapHighlightColor: "transparent",
          transition: "background-color 80ms ease-out",
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
          fontWeight={500}
          sx={{
            display: "block",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            visibility: hidden ? "hidden" : "visible"
          }}
        >
          {item.key.annotateEmphasis()}
        </Typography>
      </Box>
    );
  }, [memorizing, handleAnswer]);

  // § search & sort
  const [cardsSorting, setCardsSorting] = React.useState(null);
  const [dragTarget, setDragTarget] = React.useState(null);
  const dragCardRef = React.useRef(null);
  const dragScrollRef = React.useRef({ frame: null, speed: 0 });
  const tableContainerRef = React.useRef(null);

  const stopDragScroll = React.useCallback(() => {
    cancelAnimationFrame(dragScrollRef.current.frame);
    dragScrollRef.current = { frame: null, speed: 0 };
  }, []);

  const handleDragScroll = (event) => {
    if (!dragCardRef.current) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const container = tableContainerRef.current;
    const bounds = container.getBoundingClientRect();
    const top = Math.max(0, bounds.top);
    const bottom = Math.min(window.innerHeight, bounds.bottom);
    const edge = Math.min(64, (bottom - top) / 3);
    const y = event.clientY;
    const speed = y < top + edge
      ? -12 * Math.min(1, Math.max(0, (top + edge - y) / edge))
      : y > bottom - edge
      ? 12 * Math.min(1, Math.max(0, (y - bottom + edge) / edge))
      : 0;
    if (!speed) {
      stopDragScroll();
      return;
    }
    dragScrollRef.current.speed = speed;
    if (dragScrollRef.current.frame === null) {
      let previous;
      const scroll = (time) => {
        if (!dragCardRef.current || !tableContainerRef.current) {
          stopDragScroll();
          return;
        }
        const elapsed = previous === undefined
          ? 16.67
          : Math.min(time - previous, 32);
        previous = time;
        tableContainerRef.current.scrollTop += dragScrollRef.current.speed * elapsed / 16.67;
        dragScrollRef.current.frame = requestAnimationFrame(scroll);
      };
      dragScrollRef.current.frame = requestAnimationFrame(scroll);
    }
  };

  React.useEffect(() => {
    setCardsSorting(null);
    setDragTarget(null);
    dragCardRef.current = null;
    stopDragScroll();
    return stopDragScroll;
  }, [folderName, stopDragScroll]);

  const handleDropCard = (event, id) => {
    event.preventDefault();
    stopDragScroll();
    const dragged = dragCardRef.current;
    if (
      dragged
        && dragged !== id
        && !operationLockRef.current && !cardsSorting
    ) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const after = event.clientY >= bounds.top + bounds.height / 2;
      const order = cardsRef.current
        .map((item) => item.id)
        .filter((item) => item !== dragged);
      const index = order.indexOf(id);
      if (index !== -1 && cards.some((item) => item.id === dragged)) {
        const targetIndex = index + (after ? 1 : 0);
        const applySort = () => {
          const next = [...cardsRef.current];
          const sourceIndex = next.findIndex((item) => item.id === dragged);
          if (sourceIndex === -1) {
            return;
          }
          const [item] = next.splice(sourceIndex, 1);
          next.splice(targetIndex, 0, item);
          cardsRef.current = next;
          setCards(next);
        };
        if (syncable) {
          const session = syncRef.current;
          operationLockRef.current = true;
          setOperationLock(true);
          setSortLock(true);
          toast.promise(new Promise((resolve, reject) => {
            request(
              "POST/utility/hare/sort",
              {
                type: cardType,
                folderName: cardPath,
                filename: cardTitle,
                id: dragged,
                index: targetIndex
              },
              undefined,
              reject
            ).then(() => {
              if (syncRef.current === session) {
                applySort();
              }
              resolve();
            });
          }).finally(() => {
            if (syncRef.current === session) {
              operationLockRef.current = false;
              setOperationLock(false);
              setSortLock(false);
            }
          }), {
            loading: context.languagePicker("modal.toast.plain.generalReconfirm"),
            success: context.languagePicker("modal.toast.success.sort"),
            error: (error) => error
          });
        } else {
          applySort();
          if (folderName.length) {
            setModified(true);
          }
        }
      }
    }
    dragCardRef.current = null;
    setDragTarget(null);
  };

  const handleClickSort = (field) => {
    setCardsSorting((sorting) => sorting?.field !== field
      ? { field, descending: false }
      : sorting.descending
      ? null
      : { field, descending: true }
    );
  };

  const renderSortHeader = (field) => (
    <Link
      underline="none"
      color="primary"
      component="button"
      onClick={() => handleClickSort(field)}
      fontWeight="lg"
      endDecorator={cardsSorting?.field === field
        ? cardsSorting.descending
        ? <ArrowDropDownIcon />
        : <ArrowDropUpIcon />
        : null}
    >
      {context.languagePicker(`main.card.tableColumn.${field}`)}
    </Link>
  );

  const sortedCards = React.useMemo(() => {
    if (!cardsSorting) {
      return cards;
    }
    const { field, descending } = cardsSorting;
    return cards.map((item, index) => ({ item, index }))
      .sort((left, right) => {
        const comparison = field === "time"
          ? left.item.time - right.item.time
          : left.item[field].localeCompare(right.item[field]);
        return (descending ? -comparison : comparison)
          || left.index - right.index;
      })
      .map(({ item }) => item);
  }, [cards, cardsSorting]);

  const filteredCards = sortedCards.filter(
    (item) => `${item.query}\n${item.key}`
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <RouteField
      display={display}
      onDragOver={(event) => {
        if (!Array.from(event.dataTransfer.types).includes("Files")) {
          return;
        }
        event.preventDefault();
        const allowed = display && cardState === 1 && !memorizing && !operationLock;
        event.dataTransfer.dropEffect = allowed ? "copy" : "none";
        setDraggingFile(allowed);
      }}
      onDragLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setDraggingFile(false);
        }
      }}
      onDrop={(event) => {
        if (!Array.from(event.dataTransfer.types).includes("Files")) {
          return;
        }
        event.preventDefault();
        setDraggingFile(false);
        if (!display || cardState !== 1 || memorizing || operationLock) {
          return;
        }
        const files = Array.from(event.dataTransfer.files);
        if (files.length !== 1) {
          toast.error(context.languagePicker("modal.toast.warning.uploadMultiple"));
          return;
        }
        if (
          Array
            .from(event.dataTransfer.items)
            .some((item) => item.webkitGetAsEntry?.()?.isDirectory)
        ) {
          toast.error(context.languagePicker("modal.toast.warning.uploadFolder"));
          return;
        }
        if (!/\.(hare|json)$/i.test(files[0].name)) {
          toast.error(context.languagePicker("modal.toast.warning.illegalFormat"));
          return;
        }
        handleUpload(files[0]);
      }}
      path={
        folderName.length ? [
          cardType === "private"
            ? context.languagePicker("nav.private")
            : context.languagePicker("nav.public"),
          ...folderPart.slice(1)
        ] : [
          context.languagePicker("nav.utility.title"),
          context.languagePicker("nav.utility.card")
        ]
      }
      link={folderName.length ? `/${encodePath(folderName)}` : undefined}
      title={cardTitle}
      sxRaw={{ overflowY: "hidden" }}
      sx={{
        position: "relative",
        flexDirection: "column",
        minHeight: 0,
        overflowY: { xs: "auto", sm: "hidden" },
        overflowX: { xs: "auto", sm: "hidden" },
        height: { xs: "auto", sm: "100%" }
      }}
    >
      {cardState === 0 && <Loading pinned />}
      {cardState === -1 &&
        <Caption
          title={context.languagePicker("universal.placeholder.unexist.title")}
          caption={context.languagePicker("universal.placeholder.unexist.caption")}
        />}
      {cardState === -2 &&
        <Caption
          title={context.languagePicker("universal.placeholder.unparsable.title")}
          caption={context.languagePicker("universal.placeholder.unparsable.caption")}
        />}
      {cardState === 1 && <React.Fragment>
        <Box
          className="SearchAndFilters"
          sx={{ display: "flex", flexWrap: "nowrap", gap: 1.5, pb: 2, borderRadius: "sm" }}
        >
          <Input
            size="sm"
            placeholder={context.languagePicker("main.card.search")}
            autoComplete="off"
            startDecorator={<SearchIcon />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ flex: 1, minWidth: 0 }}
          />
          {memorizing ? <Button
            size="sm"
            startDecorator={<CloseOutlinedIcon />}
            loading={operationLock}
            onClick={handleEnd}
            sx={{
              flexShrink: 0,
              minWidth: context.languagePicker("main.card.rowMenu.width")
            }}
          >
            {context.languagePicker("main.card.rowMenu.end")}
          </Button> : <Dropdown>
            <MenuButton
              size="sm"
              variant="solid"
              color="primary"
              startDecorator={<DoneOutlinedIcon />}
              disabled={operationLock}
              sx={{
                flexShrink: 0,
                minWidth: context.languagePicker("main.card.rowMenu.width")
              }}
            >
              {context.languagePicker("main.card.rowMenu.action")}
            </MenuButton>
            <Menu size="sm" placement="bottom-end" sx={{ minWidth: 140 }}>
              {folderName.length === 0 && <React.Fragment>
                <MenuItem
                  disabled={!context.isAuthority}
                  onClick={handleToggleSave}
                >
                  {context.languagePicker("main.card.rowMenu.save")}
                </MenuItem>
                <Divider />
              </React.Fragment>}
              <MenuItem
                disabled={!cards.length}
                onClick={handleStart}
              >
                {context.languagePicker("main.card.rowMenu.start")}
              </MenuItem>
              <MenuItem
                disabled={!unfinished}
                onClick={handleContinue}
              >
                {context.languagePicker("main.card.rowMenu.resume")}
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleToggleCard()}>
                {context.languagePicker("main.card.rowMenu.add")}
              </MenuItem>
              <MenuItem onClick={() => uploadRef.current?.click()}>
                {context.languagePicker("main.card.rowMenu.import")}
              </MenuItem>
              <MenuItem onClick={handleDownload}>
                {context.languagePicker("main.card.rowMenu.export")}
              </MenuItem>
            </Menu>
          </Dropdown>}
        </Box>
        <Sheet
          className="OrderTableContainer"
          ref={tableContainerRef}
          onDragOver={handleDragScroll}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              stopDragScroll();
              setDragTarget(null);
            }
          }}
          onDrop={() => {
            stopDragScroll();
            dragCardRef.current = null;
            setDragTarget(null);
          }}
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
                <th style={{ width: 120, padding: "12px 6px" }}>
                  {renderSortHeader("query")}
                </th>
                <th style={{ width: 120, padding: "12px 6px" }}>
                  {renderSortHeader("key")}
                </th>
                <th style={{ width: 80, padding: "12px 6px" }}>
                  {renderSortHeader("time")}
                </th>
                <th style={{ width: 80, padding: "12px 6px" }}>
                  {context.languagePicker("main.card.tableColumn.operation")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.map((item) => (
                <tr
                  key={item.id}
                  onDragOver={(event) => {
                    if (!dragCardRef.current || dragCardRef.current === item.id) {
                      return;
                    }
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    const bounds = event.currentTarget.getBoundingClientRect();
                    setDragTarget({
                      id: item.id,
                      after: event.clientY >= bounds.top + bounds.height / 2
                    });
                  }}
                  onDrop={(event) => handleDropCard(event, item.id)}
                  style={dragTarget?.id === item.id ? {
                    boxShadow: `inset 0 ${dragTarget.after ? "-2px" : "2px"} 0 var(--joy-palette-primary-500)`
                  } : undefined}
                >
                  <td>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      draggable={!operationLock && !sortLock && !cardsSorting}
                      disabled={operationLock || sortLock || Boolean(cardsSorting)}
                      onDragStart={(event) => {
                        if (operationLockRef.current || cardsSorting) {
                          event.preventDefault();
                          return;
                        }
                        dragCardRef.current = item.id;
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", item.id);
                      }}
                      onDragEnd={() => {
                        stopDragScroll();
                        dragCardRef.current = null;
                        setDragTarget(null);
                      }}
                      sx={{
                        display: "flex",
                        mx: "auto",
                        cursor: "grab",
                        WebkitTapHighlightColor: "transparent",
                        "&:hover": { bgcolor: "transparent" },
                        "&:active": {
                          cursor: "grabbing",
                          bgcolor: "transparent",
                          boxShadow: "none"
                        }
                      }}
                    >
                      <MenuRoundedIcon />
                    </IconButton>
                  </td>
                  <td>
                    <Typography
                      level="body-xs"
                      sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                      {item.query.annotateEmphasis()}
                    </Typography>
                  </td>
                  <td><Box sx={{ ml: -1, mr: 1 }}>{renderAnswer(item)}</Box></td>
                  <td>
                    <Typography level="body-xs">
                      {item.time > 0 ? new Date(item.time).timeFormat(
                        context.languagePicker("universal.time.dateFormat")
                          + " "
                          + context.languagePicker("universal.time.timeFormat")
                      ) : context.languagePicker("main.card.unknown")}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <CardRowMenu
                        context={context}
                        disabled={memorizing || operationLock}
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
                    <Typography
                      level="body-sm"
                      fontWeight={500}
                      gutterBottom
                      sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                      {item.query.annotateEmphasis()}
                    </Typography>
                    <Box sx={{
                      mb: 1,
                      position: "relative",
                      "&::before": {
                        content: memorizing ? "none" : '""',
                        position: "absolute",
                        top: 4,
                        bottom: 4,
                        left: 0,
                        width: 3,
                        bgcolor: "divider",
                        borderRadius: 2
                      }
                    }}>
                      {renderAnswer(item)}
                    </Box>
                  </Box>
                </ListItemContent>
                <CardRowMenu
                  context={context}
                  disabled={memorizing || operationLock}
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
        title={
          editingCard
            ? context.languagePicker("modal.form.card.edit")
            : context.languagePicker("modal.form.card.new")
        }
        button={context.languagePicker("universal.button.submit")}
      >
        <FormControl>
          <FormLabel>{context.languagePicker("modal.form.card.query")}</FormLabel>
          <SemiTextarea
            ref={queryRef}
            initValue={formQuery}
            setValue={setFormQuery}
            minRows={3}
            maxRows={6}
            autoFocus
            disabled={modalCardLoading}
            placeholder={context.languagePicker("universal.placeholder.instruction.required")}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{context.languagePicker("modal.form.card.key")}</FormLabel>
          <SemiTextarea
            ref={keyRef}
            initValue={formKey}
            setValue={setFormKey}
            minRows={4}
            maxRows={8}
            disabled={modalCardLoading}
            placeholder={context.languagePicker("universal.placeholder.instruction.required")}
          />
        </FormControl>
      </ModalForm>}
      {draggingFile && <Box sx={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        border: "2px dashed",
        borderColor: "neutral.400",
        borderRadius: "sm",
        bgcolor: "neutral.softBg",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none"
      }}>
        <FileUploadOutlinedIcon sx={{ fontSize: 64, color: "neutral.400" }} />
      </Box>}
      <input ref={uploadRef} hidden type="file" accept=".hare,.json" onChange={(event) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        handleUpload(file);
      }} />
      {modalTree.open && <Tree
        modalTree={modalTree}
        handleCloseModalTree={handleCloseModalTree}
      />}
    </RouteField>
  )
}

export default Card;
