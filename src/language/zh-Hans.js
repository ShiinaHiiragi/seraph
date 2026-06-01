const zhHans = {
  header: {
    config: {
      title: "设置",
      general: {
        title: "通用",
        language: "显示语言",
        token: "令牌有效期限",
        tokenHint: "自最后访问",
        tokenOption: {
          15: "15 分钟",
          60: "1 小时",
          720: "12 小时",
          1440: "1 天",
          2880: "2 天"
        }
      },
      todo: {
        title: "待办",
        deleteTime: "删除延迟",
        deleteTimeHint: "任务完成后",
        deleteTimeOption: {
          0: "立即",
          60: "1 分钟",
          3600: "1 小时",
          86400: "1 天"
        }
      },
      epub: {
        title: "EPUB 转换",
        page: "分页",
        pageSplit: "按章节分页",
        pageFront: "包含正文前页面",
        nav: "导航",
        navLink: "在末尾显示链接",
        navPrev: "上一页链接文本",
        navNext: "下一页链接文本",
        fade: "淡化",
        fadeNull: "不淡化所有段落",
        fadeTrue: "淡化包含假名的段落",
        fadeFalse: "淡化不包含假名的段落",
        fadeOpaque: "淡化文本的不透明度",
        fadeSize: "淡化文本的字体大小",
        fadeTop: "淡化文本的顶部偏移",
        image: "图片",
        imageSpec: "自动识别行内图片",
        imageShow: "显示块级图片",
        imageAltInline: "显示行内图片的替代文本",
        imageAltBlock: "显示块级图片的替代文本",
        imageWidth: "块级图片宽度（留空表示不设置）",
        text: "文本",
        textClearLine: "清除空行",
        textShowRuby: "显示 Ruby",
        textBreakLine: "替换 <br> 的文本（支持转义）",
        out: "输出",
        outHTML: "将 Markdown 转换为 HTML",
        outVert: "将 HTML 版式设为竖排",
        outKeep: "保留转换前的 Markdown 文件"
      }
    }
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
        platform: "内核与平台",
        kernelVersion: "操作系统版本",
        memoryAvailable: "可用内存",
        storageAvailable: "可用外存",
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
        compress: "压缩",
        extract: "解压",
        epub: "转换",
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
        createTime: "创建时间",
        name: "任务名",
        description: "描述",
        type: "类型",
        dueTime: "截止时间"
      },
      form: {
        sort: "排序",
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
        setting: "设置已保存。",
        new: "{0} 已创建。",
        upload: "{0} 已上传至 {1}。",
        files: "所有文件",
        paste: "{0} 已粘贴至 {1}.",
        rename: "{0} 已更名为 {1}。",
        copy: "{0} 已复制到剪贴板。",
        cut: "{0} 已剪切到剪贴板。",
        compress: "{0} 已压缩到当前目录。",
        extract: "{0} 已解压到当前目录。",
        epub: "{0} 已转换到当前目录。",
        delete: "{0} 已被删除。",
        modTask: "任务已被修改。",
        modTime: "任务删除时间已更新。",
        tick: "该任务将在 {0} 秒后被删除，可通过在倒计时结束前重新勾选复选框来取消该任务。",
        tickSync: "该任务将在截止时间后被删除",
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
        environmentMissing: "拓展模块环境事前检查不通过：请查阅控制台获得更多细节。",
        extensionError: "拓展模块内部错误：请查阅控制台获得更多细节。",
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
        helperFirstHalf: "截止时间早于现在时间{0}。",
        helperSecondHalf: "，但该任务仍能被创建或编辑"
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
  console: {
    dependencies: "缺失的依赖项："
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
