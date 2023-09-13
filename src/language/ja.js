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
      caption: "要求されたページが存在ありません。"
    }
  },
  modal: {
    toast: {
      success: {
        init: "パスワードが設定されました、セラフのご利用ありがとうございます。",
        login: "セラフへようこそ。",
        logout: "ログアウトしました。"
      },
      exception: {
        incorrectPassword: "パスワードが間違っています。",
      },
      error: {
        unparseableResponse: "解析不能のレスポンス：リクエストは失敗しましてエラーコードが {0} です。",
        serverError: "サーバーエラー：リクエストは失敗しましてステータスコードが {0} です。"
      }
    },
    init: {
      title: "イニシャライズ",
      caption: "初回利用時にパスワードを設定してください。",
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
      captionSecondHalf: "「続く」を押すと変更を適用できる。",
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
    button: {
      submit: "サブミット",
      continue: "続く",
      cancel: "キャンセル"
    },
    deny: {
      title: "許可が拒否され",
      caption: "フルアクセスを取得するにはログインしてください。"
    },
    placeholder: {
      title: "イン ディベロップメント",
      caption: "必要であればギットハブで新たなイシューを提出してください。"
    }
  }
}

export default ja;
