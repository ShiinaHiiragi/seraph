const ja = {
  header: {
    config: {
      title: "セッティング",
      general: {
        title: "ゼネラル",
        language: "言語",
        reset: "デフォルトにリセット",
        resetButton: "リセット",
        upload: "セッティングをインポート",
        uploadButton: "インポート",
        download: "セッティングをエクスポート",
        downloadButton: "エクスポート"
      },
      account: {
        title: "アカウント",
        token: "トークンの有効期間",
        tokenTip: "リクエストごとにトークンの有効期限がアップデートされます（ターミナルのウェブソケットのコネクションを除く）",
        tokenOption: {
          15: "15 分",
          60: "1 時間",
          720: "12 時間",
          1440: "1 日",
          2880: "2 日"
        },
        password: "ログインパスワードを変更"
      },
      welcome: {
        title: "ダッシュボード",
        enable: "ダッシュボードを有効",
        enableTip: "プラットフォームや機種の違いにより CPU テンペラチャーやディスク I/O データが利用できない場合があります。",
        enableTemp: "CPU テンペラチャーステータスを表示する",
        enableDisk: "ディスク I/O ステータスを表示する",
        interval: "リクエストの間隔",
        intervalTip: "クライアントがリアルタイムデータを同期する頻度です。間隔を長くするとサーバー負荷は軽減されますが、データの即時性は低下します",
        intervalOption: {
          1: "1 秒",
          2: "2 秒",
          3: "3 秒",
          4: "4 秒",
          5: "5 秒",
          10: "10 秒",
          15: "15 秒",
          30: "30 秒",
          45: "45 秒",
          60: "60 秒"
        },
        window: "ウィンドウサイズ",
        windowCpu: "CPU",
        windowTemp: "テンペラチャー",
        windowMemory: "メモリ",
        windowStorage: "ストレージ",
        windowDisk: "ディスク I/O",
        windowNet: "ネットワーク Rx/Tx",
        process: "プロセスリスト",
        processHint: "次のリクエストから",
        processSort: "並べ替え",
        processSortBy: {
          cpu: "CPU 順",
          mem: "メモリ順",
          priority: "優先度順"
        },
        processCount: "プロセス数"
      },
      file: {
        title: "ファイル",
        sort: "デフォルトの並べ替え",
        sortBy: {
          name: "ファイル名",
          size: "サイズ",
          type: "タイプ",
          time: "作成日時"
        },
        sortOrder: "シーケンス",
        sortOrderOption: {
          asc: "昇順",
          desc: "降順"
        },
        salt: "デクリプションソルト",
        saltTip: "デクリプションソルトはパスワードを変更しても変わりません。いったん失われると、それ以前にエンクリプトされたすべてのファイルはリカバーできなくなります。",
        saltUnexist: "(設定されていません)",
        cipher: "デクリプトパスワードを変更"
      },
      crepe: {
        title: "エディター",
        save: "オートセーブディレイ",
        saveOption: {
          1: "1 秒",
          2: "2 秒",
          3: "3 秒",
          4: "4 秒",
          5: "5 秒",
          0: "無効に"
        },
        show: "ゲストに表示",
        showTip: "非表示に設定しても、未ログインユーザーは URL からクレープにアクセスできます。",
        edit: "デフォルトエディットモード",
        editOption: {
          true: "常にエディット可能",
          false: "常にリードオンリー",
          auto: "コンテンツが空でない場合のみエディット可能"
        },
        feature: "フィーチャ",
        featureBlockEdit: "ブロックエディットを有効",
        featureToolbar: "ツールバーを有効",
        featureStat: "ワードカウントを有効",
        featureSpellCheck: "スペルチェックを有効",
        code: "コードミラー",
        codeLineNumber: "ライン番号を表示",
        codeLineGutter: "アクティブラインのガターをハイライト",
        shortcut: "ショートカット",
        shortcutNull: "（なし）",
        shortcutList: {
          save: "ファイルをセーブ",
          edit: "オンリー・エディット可能",
          download: "ファイルをダウンロード",
          blockText: "ブロックテキスト",
          blockH1: "へーディング 1",
          blockH2: "へーディング 2",
          blockH3: "へーディング 3",
          blockH4: "へーディング 4",
          blockH5: "へーディング 5",
          blockH6: "へーディング 6",
          blockQuote: "クオート",
          blockDivider: "ディバイダー",
          blockBullet: "アンオーダードリスト",
          blockOrdered: "オーダードリスト",
          blockTask: "タスクリスト",
          blockImage: "イメージブロック",
          blockCode: "コードブロック",
          blockTable: "テーブル",
          blockLatex: "公式ブロック",
          inlineBold: "ボールド体",
          inlineItalic: "イタリック体",
          inlineStrike: "ストライクスルー",
          inlineImage: "インラインイメージ",
          inlineCode: "インラインコード",
          inlineLatex: "インライン公式",
          inlineLink: "リンク"
        },
        upload: "CSS をインポート",
        uploadTip: "アップロードされた CSS は .milkdown { } ブロックで囲まれます。",
        uploadButton: "インポート",
        download: "CSS をエクスポート",
        downloadButton: "エクスポート"
      },
      terminal: {
        title: "ターミナル",
        enable: "ターミナルを有効",
        shell: "シェル",
        shellLinux: "Linux でのシェルパス",
        shellWin32: "Windows でのシェルパス",
        lifecycle: "ライフサイクル",
        lifecycleTimeout: "コネクションタイムアウト",
        lifecycleTimeoutOption: {
          15: "15 分",
          30: "30 分",
          60: "1 時間",
          120: "2 時間",
          240: "4 時間",
          360: "6 時間"
        },
        lifecyclePing: "ピングの間隔",
        lifecyclePingOption: {
          0: "なし",
          15: "15 秒",
          30: "30 秒",
          45: "45 秒",
          60: "1 分",
          120: "2 分",
          180: "3 分",
          240: "4 分",
          300: "5 分"
        },
        cursor: "カーソル",
        cursorBlink: "カーソルをブリンク",
        reflowCursorLine: "カーソルを含む行をリフロー",
        cursorStyle: "アクティブカーソルのスタイル",
        activeStyleOption: {
          block: "ブロック",
          bar: "バー",
          underline: "アンダーライン"
        },
        cursorInactiveStyle: "インアクティブカーソルのスタイル",
        inactiveStyleOption: {
          outline: "アウトライン",
          block: "ブロック",
          bar: "バー",
          underline: "アンダーライン",
          none: "なし"
        },
        font: "フォント",
        fontSize: "フォントサイズ",
        fontFamily: "ターミナルフォント",
        fontWeight: "ノーマルテキストのフォントウェイト",
        fontWeightBold: "ボールドテキストのフォントウェイト",
        text: "テキスト",
        letterSpacing: "レタースペーシング",
        lineHeight: "ラインハイト",
        contrastRatio: "最小コントラスト比",
        wordSeparator: "ワードセパレーター",
        scroll: "スクロール",
        scrollback: "スクロールバック量",
        scrollNormal: "ノーマルスクロール感度",
        scrollFast: "ファストスクロール感度",
        theme: "テーマ",
        themeTransparency: "トランスペアレントを有効にする",
        themeOption: {
          selectionBackground: "選択範囲のバックグラウンドカラー",
          background: "バックグラウンドカラー",
          foreground: "フォアグラウンドカラー",
          cursor: "カーソルカラー",
          cursorAccent: "カーソルアクセントカラー",
          black: "ブラック",
          blue: "ブルー",
          cyan: "シアン",
          green: "グリーン",
          magenta: "マゼンタ",
          red: "レッド",
          white: "ホワイト",
          yellow: "イエロー",
          brightBlack: "ブライトブラック",
          brightBlue: "ブライトブルー",
          brightCyan: "ブライトシアン",
          brightGreen: "ブライトグリーン",
          brightMagenta: "ブライトマゼンタ",
          brightRed: "ブライトレッド",
          brightWhite: "ブライトホワイト",
          brightYellow: "ブライトイエロー"
        },
        control: "制御コード"
      },
      todo: {
        title: "タスク",
        deleteTime: "デリートのディレイ",
        deleteTimeHint: "タスク遂行の後",
        deleteTimeOption: {
          0: "すぐ",
          60: "1 分",
          3600: "1 時間",
          86400: "1 日",
          never: "なし"
        }
      },
      extension: {
        title: "エクステンション",
        python: "Python",
        pythonLinux: "Linux で Python のパス",
        pythonWin32: "Windows で Python のパス",
        pandoc: "Pandoc",
        pandocLinux: "Linux で Pandoc のパス",
        pandocWin32: "Windows で Pandoc のパス"
      },
      epub: {
        title: "EPUB コンバーター",
        enable: "コンバーターを有効",
        page: "ページ",
        pageSplit: "チャプターごとにページをスプリットする",
        pageFront: "フロントページをインクルードする",
        nav: "ナビゲーション",
        navLink: "エンドにナビゲーションリンクを表示する",
        navPrev: "前ページのリンクテキスト",
        navNext: "次ページのリンクテキスト",
        fade: "フェード",
        fadeNull: "フェードを実行しない",
        fadeTrue: "かなを含むパラグラフをフェードする",
        fadeFalse: "かなを含まないパラグラフをフェードする",
        fadeOpaque: "フェードテキストのオパシティ",
        fadeSize: "フェードテキストのフォントサイズ",
        fadeTop: "フェードテキストのトップオフセット",
        image: "イメージ",
        imageSpec: "インラインイメージをヒューリスティックで識別する",
        imageShow: "ブロックレベルイメージを表示する",
        imageAltInline: "インラインイメージの代替テキストを表示する",
        imageAltBlock: "ブロックレベルイメージの代替テキストを表示する",
        imageWidth: "ブロックレベルイメージの幅（空欄でヌル）",
        text: "テキスト",
        textClearLine: "空行をクリアする",
        textShowRuby: "ルビが存在する場合は表示する",
        textBreakLine: "<br> を置換するテキスト（エスケープ対応）",
        out: "アウトプット",
        outTip: "アウトプットされる HTML のスタイルはフィクストされており、変更はできません。",
        outHTML: "Markdown を HTML にコンバートする",
        outVert: "HTML テキストをバーティカルにする",
        outKeep: "中間 Markdown ファイルをキープする"
      },
      placeholder: {
        password: "入力後にセーブ"
      },
      appendix: {
        reload: "（リロードが必要）"
      },
      fallback: {
        seconds: "{0} 秒",
        minutes: "{0} 分"
      },
      attrs: {
        width: 140
      }
    }
  },
  nav: {
    title: "セラフ",
    public: "パブリック",
    private: "プライベート",
    utility: {
      title: "ユーティリティ",
      subscription: "サブスクリプション",
      milkdown: "クレープ",
      terminal: "ターミナル",
      todo: "タスク"
    }
  },
  main: {
    welcome: {
      kpiCards: {
        cpu: "CPU",
        cores: "コア",
        memory: "メモリ",
        storage: "ストレージ",
        available: "空き",
        uptime: "アップタイム"
      },
      trend: {
        cpu: "CPU ステータス",
        temp: "テンペラチャー",
        memory: "メモリステータス",
        storage: "ストレージステータス",
        rxDisk: "読みステータス",
        wxDisk: "書きステータス",
        rxNet: "RX ステータス",
        txNet: "TX ステータス",
        min: "Min: ",
        max: "Max: ",
        avg: "Avg: "
      },
      info: {
        systemInfo: "システム情報",
        manufacturer: "メーカー",
        model: "デバイスモデル",
        serial: "シリアル",
        virtual: "バーチャルマシン",
        virtualNull: "N/A",
        biosVersion: "BIOS バージョン",
        platform: "オペレーティングシステム",
        kernel: "カーネルバージョン",
        cpuModel: "CPU モデル",
        cpuCache: "キャッシュ",
        mac: "MAC アドレス",
        network: "ネットワークインタフェース",
        process: "プロセスリスト",
        name: "プロセス名",
        pid: "PID",
        cpu: "CPU %",
        mem: "メモリ %",
        priority: "優先度"
      }
    },
    error: {
      title: "404",
      caption: "リクエストされたページが存在しません。"
    },
    folder: {
      tableColumn: {
        name: "ファイル名",
        size: "サイズ",
        type: "タイプ",
        time: "作成日時",
        operation: "オペレーション"
      },
      listHint: {
        createTime: "{0} に作成",
        modifiedTime: "{0} に最終更新"
      },
      items: "{0} 件",
      rowMenu: {
        open: "オープン",
        download: "ダウンロード",
        rename: "リネーム",
        relink: "URL をモディファイ",
        copy: "コピー",
        cut: "カット",
        encrypt: "エンクリプト",
        decrypt: "デクリプト",
        compress: "コンプレス",
        extract: "エクストラクト",
        epub: "コンバート",
        copyImage: "リンクをコピー",
        delete: "デリート"
      },
      viewRegulate: {
        all: "オール",
        unknown: "不明",
        link: "URL リンク",
        encrypt: "エンクリプテッドファイル",
        directory: "ディレクトリ",
        search: "ファイル名で検索",
        filter: "フィルター",
        add: "追加"
      },
      addMenu: {
        newFolder: "ニューディレクトリ",
        newLink: "ニュー URL リンク",
        newMarkdown: "ニューマークダウン",
        newFile: "ファイルのアップロード",
        paste: "ペースト"
      }
    },
    crepe: {
      placeholder: "ここにテキストを入力",
      sync: {
        saving: "セーブ中",
        saved: "セーブ済み"
      },
      image: {
        upload: "アップ",
        link: "またはリンクを入力",
        caption: "ここにキャプションを入力",
      },
      code: {
        search: "ランゲージをサーチ",
        noResult: "結果なし",
        copy: "コピー",
        hide: "隠す",
        edit: "エディット",
        preview: "プレビュー"
      },
      stat: {
        title: "ワードカウント",
        lines: "ライン",
        words: "ワード",
        chars: "キャラクター"
      },
      popup: {
        url: "URL",
        slash: {
          text: {
            title: "テキスト",
            text: "テキスト",
            h1: "へーディング 1",
            h2: "へーディング 2",
            h3: "へーディング 3",
            h4: "へーディング 4",
            h5: "へーディング 5",
            h6: "へーディング 6",
            quote: "クオート",
            divider: "ディバイダー"
          },
          list: {
            title: "リスト",
            bulletList: "アンオーダードリスト",
            orderedList: "オーダードリスト",
            taskList: "タスクリスト"
          },
          advanced: {
            title: "アドバンスド",
            image: "イメージ",
            codeBlock: "コード",
            table: "テーブル",
            math: "公式"
          }
        }
      }
    },
    terminal: {
      send: "制御コードを送信"
    },
    todo: {
      regulate: {
        createTime: "作成日時",
        name: "タスク名",
        description: "ディスクリプション",
        type: "タイプ",
        dueTime: "締め切り"
      },
      form: {
        sort: "ソート",
        filter: "タイプでフィルター",
        add: "追加",
        edit: "アップデート",
        delete: "デリート"
      },
      type: {
        all: "全種類",
        permanent: "常設",
        async: "非同期",
        sync: "同期"
      }
    }
  },
  modal: {
    toast: {
      plain: {
        login: "セラフへようこそ。",
        generalReconfirm: "オペレーション中です。しばらくお待ちください。",
        uploading: "アップロード中です。しばらくお待ちください。",
        updateSetting: "最新のセッティングがアップデートされました。"
      },
      success: {
        init: "ログインパスワードがセットされました。セラフをご利用いただき、ありがとうございます。",
        logout: "ログアウトしました。",
        setting: "セッティングがセーブされました。",
        salt: "ソルトがクリップボードにコピーされました。",
        code: "コードがクリップボードにコピーされました。",
        image: "イメージのマークダウンエレメントがクリップボードにコピーされました。",
        import: "セッティングがセーブされ、有効なエントリ {1} 件のうちに {0} 件がアップデイトされました。",
        new: "{0} が作成されました。",
        upload: "{0} が {1} にアップロードされました。",
        files: "すべてのファイル",
        paste: "{0} が {1} にペーストされました。",
        rename: "{0} が {1} にリネームされました。",
        relink: "リンクがモディファイされました。",
        copy: "{0} がクリップボードにコピーされました。",
        cut: "{0} がクリップボードにカットされました。",
        encrypt: "{0} がカレントディレクトリにエンクリプトされました。",
        decrypt: "{0} がカレントディレクトリにデクリプトされました。",
        compress: "{0} がカレントディレクトリにコンプレスされました。",
        extract: "{0} がカレントディレクトリにエクストラクトされました。",
        epub: "{0} がカレントディレクトリにコンバートされました。",
        delete: "{0} がデリートされました。",
        saveText: "ファイルがセーブされました。",
        modTask: "タスクがアップデートされました。",
        modTime: "タスクのデリートタイムがアップデートされました。",
        tick: "間もなくタスクは {0} 秒後にデリートされる予定ですが、カウントダウンが終了する前にチェックボックスをふたたびチェックすることでキャンセルできます。",
        tickSync: "タスクは締め切りが過ぎるとデリートされる予定です。",
        tickDel: "タスクはコンプリーテッドされると直ちにデリートされました。",
        tickOnly: "タスクはコンプリーテッドされました。",
        untick: "変更はロールバックされました。"
      },
      warning: {
        invalidToken: "トークンが無効または期限切れになり、数秒後にページはリフレッシュされます。",
        saltMissing: "サーバーがデクリプションソルトの変更またはデリートを検出しました。これにより、既存のエンクリプトされたファイルがリカバーできなくなる可能性があります。サーバーが保存したすべてのローカルソルトバックアップは、次のパスにあります：\n{0}",
        autoSaveFailed: "同期がフェイルしました。別のファイルに切り替えるか、エディタを再起動するまで、オートセーブは一時的に無効になります。",
        uploadFolder: "フォルダのアップロードはサポートされていません。",
        illegalRename: "ファイル名の事前チェックがフェイルしました。",
        invalidConfig: "バックアップファイルの事前チェックがフェイルしました。"
      },
      exception: {
        incorrectPassword: "パスワードが間違っています。",
        resourcesUnexist: "リクエストされたリソースは存在しません。",
        typeCheckFailed: "タイプチェックがフェイルしました。",
        identifierConflict: "ネーミング識別子競合なので先に {0} をリネームまたはデリートしてください。",
        fileUnderRoot: "ルートパスの下にはフォルダのみを作成またはペーストできます。",
        linkNotFound: "ファイルに URL リンクが検出されなかったため、変更は失敗しました。",
        fileModuleError: "ファイルオペレーションモジュールでエクセプションが発生しました。",
        passwordUnexist: "デクリプトパスワードがセットされていません。",
        invalidEncrypt: "無効な .srph ファイルです。",
        invalidDecrypt: "パスワードが無効か、ファイルが改ざんされているため、デクリプトは失敗しました。",
        environmentMissing: "下記の不足している依存関係によるエクステンションモジュールのエンヴァイロメントゥッの事前チェックにフェイルしました：\n{0}",
        extensionError: "内部エクステンションモジュールでエクセプションが発生しました。詳細はコンソールで確認してください。",
        duplicateRequest: "デュープリケイト・リクエスト: オペレーションのフリークエンシーを下げてください。"
      },
      error: {
        unparseableResponse: "アンパース可能なレスポンス：リクエストがフェイルしました。エラーコードは {0} です。",
        serverError: "サーバーエラー：リクエストがフェイルしました。ステータスコードは {0} です。",
        browserError: "ブラウザエラー：{0} を受信しました。\n{1}"
      }
    },
    init: {
      title: "イニシャライズ",
      caption: "初回利用時にログインパスワードをセットしてください。",
      password: {
        label: "ログインパスワード",
        placeholder: "制限なし"
      }
    },
    form: {
      login: {
        title: "ログイン",
        caption: "フルアクセスを取得するにはログインパスワードを入力してください。",
        placeholder: "ログインパスワード"
      },
      new:{
        title: "ニューディレクトリを作成する",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがあります。",
        placeholder: "ニューディレクトリ名"
      },
      newLink: {
        title: "ニュー URL リンクを作成する",
        caption: "ネーミング制限またはファイルフォーマットはサーバーが配置されているプラットフォームによって違いがあります。",
        filename: "ネーム",
        url: "URL"
      },
      newMarkdown: {
        title: "ニューマークダウンを作成する",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがあります。",
        placeholder: "ニューマークダウンのファイル名"
      },
      rename: {
        title: "リネームする",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがあります。また、拡張子はできる限り変更しないようにしてください。",
        placeholder: "ニューファイル名"
      },
      relink: {
        title: "URL をモディファイする",
        caption: "最初に検出された URL のみが変更されます。",
        placeholder: "ニュー URL"
      },
      decrypt: {
        title: "デクリプトする",
        caption: "このファイルをエンクリプトした際にセットしたデクリプトパスワードを入力してください。",
        placeholder: "デクリプトパスワード"
      },
      todo: {
        new: "ニュータスクを作成する",
        edit: "タスクをアップデートする",
        caption: "「常設」のタスクには締め切りが指定されていません。「非同期」または「同期」のタスクには締め切りが設定されており、前者は事前にチェックすることができて、後者はその予定時間そのものにコンプリートする必要があります。",
        helperFirstHalf: "締め切りはカレントタイムより早いです{0}。",
        helperSecondHalf: "が、タスクの作成やアップデートは可能です。"
      }
    },
    reconfirm: {
      title: "再確認",
      captionSecondHalf: "「進む」をクリックすると変更をアプライできます。",
      captionFirstHalf: {
        logout: "セラフからログアウトしようとしています。",
        deleteFile: "ファイル {0} をデリートしようとしています。",
        deleteTask: "タスク {0} をデリートしようとしています。",
        resetConfig: "コンフィグをリセットしています。"
      },
      caption: {
        discardDraft: "セーブせずにクレープを離れようとしています。「進む」をクリックすると変更は破棄されます。",
        overwrite: "ソースファイルが変更されました。「進む」をクリックするとテキストが強制的に上書きされます。",
        changeCipher: "ご注意ください。デクリプトパスワードを変更しても、それ以前にエンクリプトされたファイルのデクリプトには、変更前のパスワードが必要です。",
        enableTerminal: "「進む」をクリックすると、リモート PTY の利用に伴うリスクを理解したものとみなされ、それによって生じる一切の結果についてご自身で責任を負うことになります。"
      }
    },
    tree: {
      title: "セーブ先のディレクトリ",
      placeholder: "ファイル名",
      untitled: "アンタイトル"
    }
  },
  setting: {
    general: {
      language: "ランゲージ"
    }
  },
  universal: {
    time: {
      dateFormat: "yyyy 年 M 月 d 日",
      timeFormat: "hh:mm:ss",
      taskModalFormat: "YYYY 年 MM 月 DD 日 HH:mm",
      taskListFormat: "yyyy 年 M 月 d 日 hh:mm"
    },
    button: {
      submit: "送信する",
      continue: "進む",
      cancel: "キャンセル"
    },
    placeholder: {
      instruction: {
        required: "リクワイヤード",
        optional: "オプショナル"
      },
      deny: {
        title: "許可拒否",
        caption: "フルアクセスを取得するにはログインしてください。"
      },
      unexist: {
        title: "リソース不在",
        caption: "URL にタイプミスのある可能性がありますので、入力を再確認してリトライしてください。"
      },
      inDevelopment: {
        title: "イン・ディベロップメント",
        caption: "必要であればギットハブでニューイシューをサブミットしてください。"
      },
      disabled: {
        title: "フィーチャーが無効",
        caption: "このフィーチャーをアクセスするには、セッティングで有効にしてください。"
      }
    }
  }
}

export default ja;
