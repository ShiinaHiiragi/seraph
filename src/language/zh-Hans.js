const zhHans = {
  header: {
  },
  nav: {
    title: "SERAPH",
    public: "公有",
    private: "私有",
    utility: {
      title: "实用",
      archive: "档案",
      links: "链接",
      subscription: "订阅",
      milkdown: "Milkdown",
      todo: "待办"
    }
  },
  main: {
    error: {
      title: "404",
      caption: "请求的页面不存在。"
    },
    folder: {
      fileAttribute: {
        name: "文件名",
        size: "大小",
        type: "类型",
        time: "创建时间",
        operation: "操作"
      },
      tableView: {
        unknown: "未知"
      }
    }
  },
  modal: {
    toast: {
      success: {
        init: "密码设置成功，感谢使用 SERAPH。",
        login: "欢迎回到 SERAPH。",
        logout: "退出成功。"
      },
      exception: {
        incorrectPassword: "密码错误。",
        resourcesUnexist: "请求的资源不存在。"
      },
      error: {
        unparseableResponse: "响应无法解析：请求失败，错误代码 {0}。",
        serverError: "服务器错误：请求失败，状态码 {0}。"
      }
    },
    init: {
      title: "初始化",
      caption: "首次使用请设置密码。",
      password: {
        label: "密码",
        placeholder: "无限制"
      }
    },
    login: {
      title: "登录",
      caption: "请输入密码以获得完全访问权限。",
      password: "密码"
    },
    reconfirm: {
      title: "二次确认",
      captionSecondHalf: "点击「继续」以应用更改。",
      captionFirstHalf: {
        logout: "即将退出 SERAPH。"
      }
    }
  },
  setting: {
    general: {
      language: "语言"
    }
  },
  universal: {
    time: {
      dateFormat: "yyyy-MM-dd",
      timeFormat: "hh:mm:ss"
    },
    button: {
      submit: "提交",
      continue: "继续",
      cancel: "取消"
    },
    placeholder: {
      deny: {
        title: "没有权限",
        caption: "登录以获得完全访问权限。"
      },
      unexist: {
        title: "资源不可用",
        caption: "URL 中可能存在拼写错误，请重新检查输入并重试。"
      },
      inDevelopment: {
        title: "开发中",
        caption: "如有需要，请在 GitHub 上提交新 Issue。"
      }
    }
  }
}

export default zhHans;
