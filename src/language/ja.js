const ja = {
  header: {
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
        new: "{0} が作成されました。",
        upload: "{0} が {1} にアップロードされました。",
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
      }
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
      }
    }
  }
}

export default ja;
