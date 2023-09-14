const ja = {
  header: {
  },
  nav: {
    title: "セラフ",
    public: "パブリック",
    private: "プライベート",
    utility: {
      title: "ユーティリティ",
      archive: "アーカイブ",
      links: "リンク",
      subscription: "サブスクリプション",
      milkdown: "ミルクダウン",
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
        rename: "名前を変更",
        move: "移動",
        delete: "削除"
      },
      viewRegulate: {
        unknown: "未知"
      }
    }
  },
  modal: {
    toast: {
      success: {
        init: "パスワードがセットされました。セラフのご利用いただき、ありがとうございます。",
        login: "セラフへようこそ。",
        logout: "ログアウトしました。"
      },
      warning: {
        invalidToken: "トークンが無効又は期限切れになれ、ページは数秒内にリフレッシュされることになっています。",
        illegalRename: "新たなファイル名の事前チェックはフェイル。"
      },
      exception: {
        incorrectPassword: "パスワードが間違っています。",
        resourcesUnexist: "リクエストされたリソースは存在しません。"
      },
      error: {
        unparseableResponse: "解析不能のレスポンス：リクエストはフェイルしましてエラーコードが {0} です。",
        serverError: "サーバーエラー：リクエストはフェイルしましてステータスコードが {0} です。"
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
        title: "名前を変更する",
        caption: "ネーミング制限はサーバーが配置されているプラットフォームによって違いがある。そして拡張子はできる限りチェンジしないようにしてください。",
        placeholder: "新たなファイル名"
      }
    },
    reconfirm: {
      title: "再確認",
      captionSecondHalf: "「進む」を押すと変更を適用できる。",
      captionFirstHalf: {
        logout: "セラフからログアウトしようとしています。"
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
        title: "イン・ディベロップメント",
        caption: "必要であればギットハブで新たなイシューを提出してください。"
      }
    }
  }
}

export default ja;
