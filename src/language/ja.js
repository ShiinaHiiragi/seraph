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
    button: {
      submit: "送信する",
      continue: "進む",
      cancel: "キャンセル"
    },
    deny: {
      title: "許可が拒否され",
      caption: "フルアクセスを取得するにはログインしてください。"
    },
    placeholder: {
      title: "イン・ディベロップメント",
      caption: "必要であればギットハブで新たなイシューを提出してください。"
    }
  }
}

export default ja;
