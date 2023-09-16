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
    error: {
      title: "404",
      caption: "リクエストされたページが存在しません。"
    },
    folder: {
      tableColumn: {
        name: "ファイル名",
        size: "サイズ",
        type: "MIME タイプ",
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
        move: "移動",
        copy: "コピー",
        delete: "デリート"
      },
      viewRegulate: {
        unknown: "不明",
        search: "ファイル名で検索",
        filter: "フィルタ",
        upload: "アップロード",
        all: "全種類"
      }
    }
  },
  modal: {
    toast: {
      plain: {
        login: "セラフへようこそ。",
        uploading: "アップロード中でしばらくお待ちください。"
      },
      success: {
        init: "パスワードがセットされました。セラフのご利用いただき、ありがとうございます。",
        logout: "ログアウトしました。",
        upload: "{0} が {1} にアップロードされました。",
        rename: "{0} が {1} にリネームされました。",
        copy: "{0} が {1} にコピーされました。",
        move: "{0} が {1} に移動されました。",
        delete: "{0} がデリートされました。"
      },
      warning: {
        generalPromise: "オペレーションが失敗しました。",
        invalidToken: "トークンが無効又は期限切れになれ、ページは数秒内にリフレッシュされることになっています。",
        illegalRename: "新たなファイル名の事前チェックは失敗。"
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
      rename: {
        title: "リネームする",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがある。そして拡張子はできる限り変更しないようにしてください。",
        placeholder: "新たなファイル名"
      },
      move: "どちらに移動したい",
      copy: "どちらにコピーしたい"
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
