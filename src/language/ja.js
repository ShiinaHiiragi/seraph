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
        platform: "プラットホーム",
        kernelVersion: "カーネルのバージョン",
        memoryAvailable: "メモリ空き",
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
        modifiedTime: "{0} に最後更新"
      },
      rowMenu: {
        open: "開ける",
        rename: "リネーム",
        copy: "コピー",
        cut: "カット",
        delete: "デリート"
      },
      viewRegulate: {
        all: "全種類",
        unknown: "不明",
        directory: "ディレクトリ",
        search: "ファイル名で検索",
        filter: "フィルタ",
        add: "追加"
      },
      addMenu: {
        newFolder: "新たなディレクトリ",
        newFile: "ファイルのアップロード",
        paste: "ペースト"
      }
    },
    todo: {
      regulate: {
        name: "タスクネーム",
        description: "ディスクリプション",
        type: "タイプ",
        dueTime: "締め切り"
      },
      form: {
        search: "タスクの検索",
        filter: "タイプでフィルタ",
        add: "追加",
        edit: "エディット",
        delete: "デリート"
      },
      type: {
        all: "全種類",
        permanant: "常設",
        async: "非同期",
        sync: "同期"
      }
    }
  },
  modal: {
    toast: {
      plain: {
        login: "セラフへようこそ。",
        generalReconfirm: "オペレーション中でしばらくお待ちください。",
        uploading: "アップロード中でしばらくお待ちください。"
      },
      success: {
        init: "パスワードがセットされました。セラフのご利用いただき、ありがとうございます。",
        logout: "ログアウトしました。",
        new: "{0} が作成されました。",
        upload: "{0} が {1} にアップロードされました。",
        paste: "{0} が {1} にペーストされました。",
        rename: "{0} が {1} にリネームされました。",
        copy: "{0} がクリップボードにコピーされました。",
        cut: "{0} がクリップボードにカットされました。",
        delete: "{0} がデリートされました。"
      },
      warning: {
        invalidToken: "トークンが無効又は期限切れになれ、ページは数秒内にリフレッシュされることになっています。",
        illegalRename: "ファイル名の事前チェックは失敗。"
      },
      exception: {
        incorrectPassword: "パスワードが間違っています。",
        resourcesUnexist: "リクエストされたリソースは存在しません。",
        identifierConflict: "ネーミング識別子競合。",
        fileModuleError: "ファイルオペレーションモジュールでエクセプションが発生しました。"
      },
      error: {
        unparseableResponse: "解析不能のレスポンス：リクエストは失敗しましてエラーコードが {0} です。",
        serverError: "サーバーエラー：リクエストは失敗しましてステータスコードが {0} です。",
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
        title: "新たなディレクトリを作成する",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがある。",
        placeholder: "新たなディレクトリ名"
      },
      rename: {
        title: "リネームする",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがある。そして拡張子はできる限り変更しないようにしてください。",
        placeholder: "新たなファイル名"
      },
      todo: {
        new: "新たなタスクを作成する",
        edit: "タスクをエディットする",
        caption: "「常設」のタスクには締め切りが指定されていません。非同期または同期のタスクには締め切りが設定されており、前者は事前にティクすることができて、後者はその予定時間そのものに成し遂げる必要があります。"
      }
    },
    reconfirm: {
      title: "再確認",
      captionSecondHalf: "「進む」を押すと変更を適用できる。",
      captionFirstHalf: {
        logout: "セラフからログアウトしようとしています。",
        delete: "ファイル {0} をデリートしようとしています。"
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
      timeFormat: "hh:mm:ss"
    },
    button: {
      submit: "送信する",
      continue: "進む",
      cancel: "キャンセル"
    },
    placeholder: {
      deny: {
        title: "許可が拒否され",
        caption: "フルアクセスを取得するにはログインしてください。"
      },
      unexist: {
        title: "リソースがない",
        caption: "URL にタイプミスのある可能性がありますので、入力を再確認してリトライしてください。"
      },
      inDevelopment: {
        title: "イン ・ ディベロップメント",
        caption: "必要であればギットハブで新たなイシューを提出してください。"
      }
    }
  }
}

export default ja;
