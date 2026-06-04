const ja = {
  header: {
    config: {
      title: "セッティング",
      general: {
        title: "ゼネラル",
        language: "言語",
        token: "トークンの有効期間",
        tokenHint: "最終アクセスから",
        tokenOption: {
          15: "15 分",
          60: "1 時間",
          720: "12 時間",
          1440: "1 日",
          2880: "2 日"
        },
        password: "パスワードを変更",
        passwordPlaceholder: "入力後にセーブ",
        reset: "デフォルトにリセット",
        resetButton: "リセット"
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
        "cursor": "カーソル",
        "cursorBlink": "カーソルをブリンク",
        "reflowCursorLine": "カーソルを含む行をリフロー",
        "cursorStyle": "アクティブカーソルのスタイル",
        "activeStyleOption": {
          "block": "ブロック",
          "bar": "バー",
          "underline": "アンダーライン"
        },
        "cursorInactiveStyle": "インアクティブカーソルのスタイル",
        "inactiveStyleOption": {
          "outline": "アウトライン",
          "block": "ブロック",
          "bar": "バー",
          "underline": "アンダーライン",
          "none": "なし"
        },
        "font": "フォント",
        "fontSize": "フォントサイズ",
        "fontFamily": "ターミナルフォント",
        "fontWeight": "ノーマルテキストのフォントウェイト",
        "fontWeightBold": "ボールドテキストのフォントウェイト",
        "text": "テキスト",
        "letterSpacing": "レタースペーシング",
        "lineHeight": "ラインハイト",
        "contrastRatio": "最小コントラスト比",
        "wordSeparator": "ワードセパレーター",
        "scroll": "スクロール",
        "scrollback": "スクロールバック量",
        "scrollNormal": "ノーマルスクロール感度",
        "scrollFast": "ファストスクロール感度",
        "theme": "テーマ",
        "themeTransparency": "トランスペアレントを有効にする",
        "themeOption": {
          "selectionBackground": "選択範囲のバックグラウンドカラー",
          "background": "バックグラウンドカラー",
          "foreground": "フォアグラウンドカラー",
          "cursor": "カーソルカラー",
          "cursorAccent": "カーソルアクセントカラー",
          "black": "ブラック",
          "blue": "ブルー",
          "cyan": "シアン",
          "green": "グリーン",
          "magenta": "マゼンタ",
          "red": "レッド",
          "white": "ホワイト",
          "yellow": "イエロー",
          "brightBlack": "ブライトブラック",
          "brightBlue": "ブライトブルー",
          "brightCyan": "ブライトシアン",
          "brightGreen": "ブライトグリーン",
          "brightMagenta": "ブライトマゼンタ",
          "brightRed": "ブライトレッド",
          "brightWhite": "ブライトホワイト",
          "brightYellow": "ブライトイエロー"
        },
        control: "制御コード"
      },
      todo: {
        title: "トゥードゥー",
        deleteTime: "デリートのディレイ",
        deleteTimeHint: "タスク遂行の後",
        deleteTimeOption: {
          0: "すぐ",
          60: "1 分",
          3600: "1 時間",
          86400: "1 日"
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
        outHTML: "Markdown を HTML にコンバートする",
        outVert: "HTML テキストをバーティカルにする",
        outKeep: "中間 Markdown ファイルをキープする"
      },
      appendix: {
        reload: "（リロードが必要）"
      }
    }
  },
  nav: {
    title: "セラフ",
    public: "パブリック",
    private: "プライベート",
    utility: {
      title: "ユーティリティ",
      links: "リンク",
      subscription: "サブスクリプション",
      milkdown: "ミルクダウン",
      terminal: "ターミナル",
      todo: "トゥードゥー"
    }
  },
  main: {
    welcome: {
      osInfo: {
        userAtHostname: "ユーザー@ホストネーム",
        platform: "カーネルとプラットフォーム",
        kernelVersion: "オーエスのバージョン",
        memoryAvailable: "フリーメモリ",
        storageAvailable: "フリーストレージ",
        uptime: "アップタイム"
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
        rename: "リネーム",
        copy: "コピー",
        cut: "カット",
        compress: "コンプレス",
        extract: "エクストラクト",
        epub: "コンバート",
        delete: "デリート"
      },
      viewRegulate: {
        all: "オール",
        unknown: "不明",
        directory: "ディレクトリ",
        search: "ファイル名で検索",
        filter: "フィルター",
        add: "追加"
      },
      addMenu: {
        newFolder: "ニューディレクトリ",
        newFile: "ファイルのアップロード",
        paste: "ペースト"
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
        uploading: "アップロード中です。しばらくお待ちください。"
      },
      success: {
        init: "パスワードがセットされました。セラフをご利用いただき、ありがとうございます。",
        logout: "ログアウトしました。",
        setting: "セッティングがセーブされました。",
        new: "{0} が作成されました。",
        upload: "{0} が {1} にアップロードされました。",
        files: "すべてのファイル",
        paste: "{0} が {1} にペーストされました。",
        rename: "{0} が {1} にリネームされました。",
        copy: "{0} がクリップボードにコピーされました。",
        cut: "{0} がクリップボードにカットされました。",
        compress: "{0} がカレントディレクトリにコンプレスされました。",
        extract: "{0} がカレントディレクトリにエクストラクトされました。",
        epub: "{0} がカレントディレクトリにコンバートされました。",
        delete: "{0} がデリートされました。",
        modTask: "タスクがアップデートされました。",
        modTime: "タスクのデリートタイムがアップデートされました。",
        tick: "間もなくタスクは {0} 秒後にデリートされる予定ですが、カウントダウンが終了する前にチェックボックスをふたたびチェックすることでキャンセルできます。",
        tickSync: "タスクは締め切りが過ぎるとデリートされる予定です。",
        tickDel: "タスクはコンプリーテッドされると直ちにデリートされました。",
        untick: "変更はロールバックされました。"
      },
      warning: {
        invalidToken: "トークンが無効または期限切れになり、数秒後にページはリフレッシュされます。",
        illegalRename: "ファイル名の事前チェックがフェイルしました。"
      },
      exception: {
        incorrectPassword: "パスワードが間違っています。",
        resourcesUnexist: "リクエストされたリソースは存在しません。",
        identifierConflict: "ネーミング識別子競合。",
        fileModuleError: "ファイルオペレーションモジュールでエクセプションが発生しました。",
        environmentMissing: "エクステンションモジュールのエンヴァイロメントゥッの事前チェックにがフェイルしました。詳細はコンソールで確認してください。",
        extensionError: "内部エクステンションモジュールでエクセプションが発生しました。詳細はコンソールで確認してください。",
        duplicateRequest: "デュープリケイト・リクエスト: オペレーションのフリークエンシーを下げてください。"
      },
      error: {
        unparseableResponse: "アンパース可能なレスポンス：リクエストがフェイルしました。エラーコードは {0} です。",
        serverError: "サーバーエラー：リクエストがフェイルしました。ステータスコードは {0} です。",
        browserError: "ブラウザエラー：{0}（{1}）を受信しました。"
      }
    },
    init: {
      title: "イニシャライズ",
      caption: "初回利用時にパスワードをセットしてください。",
      password: {
        label: "パスワード",
        placeholder: "制限なし"
      }
    },
    form: {
      login: {
        title: "ログイン",
        caption: "フルアクセスを取得するにはパスワードを入力してください。",
        placeholder: "パスワード"
      },
      new:{
        title: "ニューディレクトリを作成する",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがあります。",
        placeholder: "ニューディレクトリ名"
      },
      rename: {
        title: "リネームする",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがあります。また、拡張子はできる限り変更しないようにしてください。",
        placeholder: "ニューファイル名"
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
        deleteTask: "タスク {0} をデリートしようとしています。"
      },
      caption: {
        enableTerminal: "「進む」をクリックすると、リモート PTY の利用に伴うリスクを理解したものとみなされ、それによって生じる一切の結果についてご自身で責任を負うことになります。"
      }
    }
  },
  setting: {
    general: {
      language: "ランゲージ"
    }
  },
  console: {
    dependencies: "不足している依存関係："
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
        "title": "フィーチャーが無効",
        "caption": "このフィーチャーをアクセスするには、セッティングで有効にしてください。"
      }
    }
  }
}

export default ja;
