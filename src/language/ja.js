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
      fileAttribute: {
        name: "ファイル名",
        size: "サイズ",
        type: "タイプ",
        time: "作成日時",
        operation: "オペレーション"
      },
      tableView: {
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
    login: {
      title: "ログイン",
      caption: "フルアクセスを取得するにはパスワードを入力してください。",
      password: "パスワード"
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
