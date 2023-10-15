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
    welcome: {
      osInfo: {
        userAtHostname: "用户名@主机名",
        platform: "平台",
        kernelVersion: "内核版本",
        memoryAvailable: "可用内存",
        uptime: "正常运行时间"
      }
    },
    error: {
      title: "404",
      caption: "请求的页面不存在。"
    },
    folder: {
      tableColumn: {
        name: "文件名",
        size: "大小",
        type: "类型",
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
        copy: "复制",
        cut: "剪切",
        delete: "删除"
      },
      viewRegulate: {
        all: "所有类型",
        unknown: "未知",
        directory: "目录",
        search: "按名称搜索",
        filter: "按类型过滤",
        add: "添加"
      },
      addMenu: {
        newFolder: "新目录",
        newFile: "上传文件",
        paste: "粘贴"
      }
    },
    todo: {
      regulate: {
        name: "任务名",
        description: "描述",
        type: "类型",
        dueTime: "截止时间"
      },
      form: {
        search: "搜索任务",
        filter: "按类型过滤",
        add: "添加",
        edit: "编辑",
        delete: "删除"
      },
      type: {
        all: "所有类型",
        permanent: "常驻",
        async: "异步",
        sync: "同步"
      }
    }
  },
  modal: {
    toast: {
      plain: {
        login: "欢迎回到 SERAPH。",
        generalReconfirm: "操作正在进行，请稍等。",
        uploading: "文件正在上传，请稍等。"
      },
      success: {
        init: "密码设置成功，感谢使用 SERAPH。",
        logout: "退出成功。",
        new: "{0} 已创建。",
        upload: "{0} 已上传至 {1}。",
        paste: "{0} 已粘贴至 {1}.",
        rename: "{0} 已更名为 {1}。",
        copy: "{0} 已复制到剪贴板。",
        cut: "{0} 已剪切到剪贴板。",
        delete: "{0} 已被删除。",
        modTask: "任务已被修改。",
        tick: "该任务将在 {0} 秒后被删除，可通过在倒计时结束前重新勾选复选框来取消该任务。",
        untick: "变更已回滚。"
      },
      warning: {
        invalidToken: "令牌无效或已过期，页面将在若干秒内自动刷新。",
        illegalRename: "文件名预检查不通过。"
      },
      exception: {
        incorrectPassword: "密码错误。",
        resourcesUnexist: "请求的资源不存在。",
        identifierConflict: "命名标识符冲突。",
        fileModuleError: "文件操作模块产生异常。",
        duplicateRequest: "重复请求：请降低操作频率。"
      },
      error: {
        unparseableResponse: "响应无法解析：请求失败，错误代码 {0}。",
        serverError: "服务器错误：请求失败，状态码 {0}。",
        browserError: "浏览器错误：收到 {0}（{1}）。"
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
      new:{
        title: "创建新目录",
        caption: "命名限制取决于服务器所在平台。",
        placeholder: "新目录名"
      },
      rename: {
        title: "重命名",
        caption: "命名限制取决于服务器所在平台，尽量不要修改扩展名。",
        placeholder: "新文件名"
      },
      todo: {
        new: "创建新任务",
        edit: "编辑任务",
        caption: "「常驻」类型的任务没有截止时间；「异步」或「同步」类型的任务有截止时间且前者可以提前完成，后者必须在指定时间点完成任务。",
        helper: "截止时间早于现在时间，但该任务仍能被创建。"
      }
    },
    reconfirm: {
      title: "二次确认",
      captionSecondHalf: "点击「继续」以应用更改。",
      captionFirstHalf: {
        logout: "即将退出 SERAPH。",
        deleteFile: "正在删除文件 {0}。",
        deleteTask: "正在删除任务 {0}。"
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
      timeFormat: "hh:mm:ss",
      taskModalFormat: "YYYY 年 MM 月 DD 日 HH:mm",
      taskListFormat: "yyyy-MM-dd hh:mm"
    },
    button: {
      submit: "提交",
      continue: "继续",
      cancel: "取消"
    },
    placeholder: {
      instruction: {
        required: "必填",
        optional: "选填"
      },
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
