const zhHans = {
  header: {
  },
  nav: {
    title: "SERAPH",
    public: "公有",
    private: "私有",
    utility: {
      title: "实用",
      links: "链接",
      subscription: "订阅",
      milkdown: "Milkdown",
      terminal: "终端",
      todo: "待办"
    }
  },
  main: {
    error: {
      title: "404",
      caption: "请求的页面不存在。"
    },
    folder: {
      tableColumn: {
        name: "文件名",
        size: "大小",
        type: "MIME 类型",
        time: "创建时间",
        operation: "操作"
      },
      listHint: {
        createTime: "创建于 {0}",
        modifiedTime: "最后修改于 {0}"
      },
      rowMenu: {
        open: "打开",
        rename: "重命名",
        move: "移动到",
        copy: "复制到",
        delete: "删除"
      },
      viewRegulate: {
        unknown: "未知"
      }
    }
  },
  modal: {
    toast: {
      success: {
        init: "密码设置成功，感谢使用 SERAPH。",
        login: "欢迎回到 SERAPH。",
        logout: "退出成功。",
        rename: "{0} 已更名为 {1}。",
        copy: "{0} 已复制到 {1}。",
        move: "{0} 已移动到 {1}。",
        delete: "{0} 已被删除。"
      },
      warning: {
        invalidToken: "令牌无效或已过期，页面将在若干秒内自动刷新。",
        illegalRename: "文件名预检查不通过。"
      },
      exception: {
        incorrectPassword: "密码错误。",
        resourcesUnexist: "请求的资源不存在。",
        identifierConflict: "命名标识符冲突。",
        fileModuleError: "文件操作模块产生异常。"
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
    form: {
      login: {
        title: "登录",
        caption: "请输入密码以获得完全访问权限。",
        placeholder: "密码"
      },
      rename: {
        title: "重命名",
        caption: "命名限制取决于服务器所在平台，尽量不要修改扩展名。",
        placeholder: "新文件名"
      },
      move: "移动到……",
      copy: "复制到……"
    },
    reconfirm: {
      title: "二次确认",
      captionSecondHalf: "点击「继续」以应用更改。",
      captionFirstHalf: {
        logout: "即将退出 SERAPH。",
        delete: "正在删除文件 {0}。"
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
