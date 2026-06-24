const zhHans = {
  header: {
    config: {
      title: "设置",
      general: {
        title: "通用",
        language: "显示语言",
        reset: "重置为默认值",
        resetButton: "重置",
        upload: "导入设置",
        uploadButton: "导入",
        download: "导出设置",
        downloadButton: "导出",
        width: 80
      },
      account: {
        title: "账号",
        token: "令牌有效期限",
        tokenTip: "每次发起请求都将更新令牌有效期限（终端 WebSocket 传输除外）",
        tokenOption: {
          15: "15 分钟",
          60: "1 小时",
          720: "12 小时",
          1440: "1 天",
          2880: "2 天"
        },
        password: "更换登录密码"
      },
      welcome: {
        title: "主页",
        enable: "启用仪表盘",
        enableTip: "CPU 温度与磁盘 I/O 数据可能由于平台或机种差异而无法获取",
        enableTemp: "在仪表盘显示 CPU 温度统计",
        enableDisk: "在仪表盘显示磁盘 I/O 统计",
        interval: "请求间隔",
        intervalTip: "客户端同步实时数据的频率；更大的请求间隔将减少服务器处理压力，同时将削弱数据时效性",
        intervalOption: {
          1: "1 秒",
          2: "2 秒",
          3: "3 秒",
          4: "4 秒",
          5: "5 秒",
          10: "10 秒",
          15: "15 秒",
          30: "30 秒",
          45: "45 秒",
          60: "60 秒"
        },
        window: "历史窗口大小",
        windowCpu: "CPU",
        windowTemp: "温度",
        windowMemory: "内存",
        windowStorage: "外存",
        windowDisk: "磁盘 I/O",
        windowNet: "网络 Rx/Tx",
        process: "进程列表",
        processHint: "下次请求生效",
        processSort: "排序方式",
        processSortBy: {
          cpu: "CPU",
          mem: "内存",
          priority: "优先级"
        },
        processCount: "进程数"
      },
      file: {
        title: "文件",
        sort: "默认排序",
        sortBy: {
          name: "文件名",
          size: "大小",
          type: "类型",
          time: "创建时间"
        },
        sortOrder: "顺序",
        sortOrderOption: {
          asc: "升序",
          desc: "降序"
        },
        salt: "盐",
        saltTip: "解密盐不会随密码变换；一旦丢失，在此之前加密的所有文件都将无法恢复。",
        saltUnexist: "(未设置)",
        cipher: "更换解密密码"
      },
      crepe: {
        title: "编辑",
        save: "自动保存延迟",
        saveOption: {
          1: "1 秒",
          2: "2 秒",
          3: "3 秒",
          4: "4 秒",
          5: "5 秒",
          0: "禁用"
        },
        show: "对访客显示",
        showTip: "即使选择不显示，未登录用户仍可通过 URL 访问编辑器。",
        edit: "默认编辑模式",
        editOption: {
          true: "始终可编辑",
          false: "始终只读",
          auto: "仅当内容非空时可编辑"
        },
        feature: "功能",
        featureBlockEdit: "启用块编辑",
        featureToolbar: "启用工具栏",
        featureStat: "启用字数统计",
        featureSpellCheck: "启用拼写检查",
        code: "Code Mirror",
        codeLineNumber: "显示行号",
        codeLineGutter: "高亮当前行边栏",
        shortcut: "编辑器快捷键",
        shortcutNull: "(无)",
        shortcutList: {
          save: "保存文件",
          edit: "只读 / 可编辑",
          download: "下载文件",
          blockText: "段落",
          blockH1: "一级标题",
          blockH2: "二级标题",
          blockH3: "三级标题",
          blockH4: "四级标题",
          blockH5: "五级标题",
          blockH6: "六级标题",
          blockQuote: "引用",
          blockDivider: "分隔线",
          blockBullet: "无序列表",
          blockOrdered: "有序列表",
          blockTask: "任务列表",
          blockImage: "图像块",
          blockCode: "代码块",
          blockTable: "表格",
          blockLatex: "公式块",
          inlineBold: "加粗",
          inlineItalic: "斜体",
          inlineStrike: "删除线",
          inlineImage: "行内图像",
          inlineCode: "行内代码",
          inlineLatex: "行内公式",
          inlineLink: "链接"
        }
      },
      terminal: {
        title: "终端",
        enable: "启用终端",
        shell: "Shell",
        shellLinux: "Linux 的 Shell 路径",
        shellWin32: "Windows 的 Shell 路径",
        lifecycle: "生命周期",
        lifecycleTimeout: "超时时间",
        lifecycleTimeoutOption: {
          15: "15 分钟",
          30: "30 分钟",
          60: "1 小时",
          120: "2 小时",
          240: "4 小时",
          360: "6 小时"
        },
        lifecyclePing: "Ping 间隔",
        lifecyclePingOption: {
          0: "从不",
          15: "15 秒",
          30: "30 秒",
          45: "45 秒",
          60: "1 分钟",
          120: "2 分钟",
          180: "3 分钟",
          240: "4 分钟",
          300: "5 分钟"
        },
        cursor: "光标",
        cursorBlink: "光标闪烁",
        reflowCursorLine: "重排包含光标的行",
        cursorStyle: "活动光标样式",
        activeStyleOption: {
          block: "实心",
          bar: "条状",
          underline: "下划线"
        },
        cursorInactiveStyle: "非活动光标样式",
        inactiveStyleOption: {
          outline: "轮廓",
          block: "实心",
          bar: "条状",
          underline: "下划线",
          none: "无"
        },
        font: "字体",
        fontSize: "字号",
        fontFamily: "终端字体",
        fontWeight: "普通文本字重",
        fontWeightBold: "粗体文本字重",
        text: "文本",
        letterSpacing: "字间距",
        lineHeight: "行高",
        contrastRatio: "最小对比度",
        wordSeparator: "单词分隔符",
        scroll: "滚动",
        scrollback: "历史行数",
        scrollNormal: "普通滚动灵敏度",
        scrollFast: "快速滚动灵敏度",
        theme: "主题",
        themeTransparency: "允许透明背景",
        themeOption: {
          selectionBackground: "选区背景色",
          background: "背景颜色",
          foreground: "前景颜色",
          cursor: "光标颜色",
          cursorAccent: "光标强调色",
          black: "黑色",
          blue: "蓝色",
          cyan: "青色",
          green: "绿色",
          magenta: "洋红色",
          red: "红色",
          white: "白色",
          yellow: "黄色",
          brightBlack: "亮黑色",
          brightBlue: "亮蓝色",
          brightCyan: "亮青色",
          brightGreen: "亮绿色",
          brightMagenta: "亮洋红色",
          brightRed: "亮红色",
          brightWhite: "亮白色",
          brightYellow: "亮黄色"
        },
        control: "控制字符"
      },
      todo: {
        title: "待办",
        deleteTime: "删除延迟",
        deleteTimeHint: "任务完成后",
        deleteTimeOption: {
          0: "立即",
          60: "1 分钟",
          3600: "1 小时",
          86400: "1 天",
          never: "从不"
        }
      },
      extension: {
        title: "扩展",
        python: "Python",
        pythonLinux: "Linux 的 Python 路径",
        pythonWin32: "Windows 的 Python 路径",
        pandoc: "Pandoc",
        pandocLinux: "Linux 的 Pandoc 路径",
        pandocWin32: "Windows 的 Pandoc 路径"
      },
      epub: {
        title: "EPUB 转换",
        enable: "启用转换",
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
        outTip: "输出的 HTML 样式固定不可变动",
        outHTML: "将 Markdown 转换为 HTML",
        outVert: "将 HTML 版式设为竖排",
        outKeep: "保留转换前的 Markdown 文件"
      },
      placeholder: {
        password: "输入后请保存"
      },
      appendix: {
        reload: "（需要重新加载）"
      },
      fallback: {
        seconds: "{0} 秒",
        minutes: "{0} 分钟"
      }
    }
  },
  nav: {
    title: "SERAPH",
    public: "公有",
    private: "私有",
    utility: {
      title: "实用",
      subscription: "订阅",
      milkdown: "编辑",
      terminal: "终端",
      todo: "待办"
    }
  },
  main: {
    welcome: {
      kpiCards: {
        cpu: "CPU 占用",
        cores: "核",
        memory: "内存占用",
        storage: "外存占用",
        available: "可用",
        uptime: "正常运行时间"
      },
      trend: {
        cpu: "CPU 统计",
        temp: "温度统计",
        memory: "内存统计",
        storage: "外存统计",
        rxDisk: "读取统计",
        wxDisk: "写入统计",
        rxNet: "RX 统计",
        txNet: "TX 统计",
        min: "最小：",
        max: "最大：",
        avg: "平均："
      },
      info: {
        systemInfo: "系统信息",
        manufacturer: "生产商",
        model: "设备型号",
        serial: "序列号",
        virtual: "虚拟机",
        virtualNull: "N/A",
        biosVersion: "Bios 版本",
        platform: "操作系统",
        kernel: "内核版本",
        cpuModel: "CPU 型号",
        cpuCache: "缓存",
        mac: "MAC 地址",
        network: "网络接口",
        process: "进程列表",
        name: "名称",
        pid: "PID",
        cpu: "CPU %",
        mem: "内存 %",
        priority: "优先级"
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
      items: "{0} 项",
      rowMenu: {
        open: "打开",
        download: "下载",
        rename: "重命名",
        relink: "修改 URL",
        copy: "复制",
        cut: "剪切",
        encrypt: "加密",
        decrypt: "解密",
        compress: "压缩",
        extract: "解压",
        epub: "转换",
        copyImage: "复制元素",
        delete: "删除"
      },
      viewRegulate: {
        all: "所有类型",
        unknown: "未知",
        link: "URL 链接",
        encrypt: "加密文件",
        directory: "目录",
        search: "按名称搜索",
        filter: "按类型过滤",
        add: "添加"
      },
      addMenu: {
        newFolder: "新目录",
        newLink: "新 URL 链接",
        newMarkdown: "新 Markdown",
        newFile: "上传文件",
        paste: "粘贴"
      }
    },
    crepe: {
      placeholder: "在此输入文本",
      sync: {
        saving: "保存中",
        saved: "已保存"
      },
      image: {
        upload: "上传",
        link: "或输入链接",
        caption: "在此输入标题",
      },
      code: {
        search: "搜索语言",
        noResult: "无结果",
        copy: "复制",
        hide: "隐藏",
        edit: "编辑",
        preview: "预览"
      },
      stat: {
        title: "字数统计",
        lines: "行",
        words: "词",
        chars: "字符"
      },
      popup: {
        url: "URL",
        slash: {
          text: {
            title: "文本",
            text: "文本",
            h1: "一级标题",
            h2: "二级标题",
            h3: "三级标题",
            h4: "四级标题",
            h5: "五级标题",
            h6: "六级标题",
            quote: "引用",
            divider: "分隔线"
          },
          list: {
            title: "列表",
            bulletList: "无序列表",
            orderedList: "有序列表",
            taskList: "任务列表"
          },
          advanced: {
            title: "高级",
            image: "图像",
            codeBlock: "代码",
            table: "表格",
            math: "公式"
          }
        }
      }
    },
    terminal: {
      send: "发送控制字符"
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
        uploading: "文件正在上传，请稍等。",
        updateSetting: "最新设置已同步。"
      },
      success: {
        init: "登录密码设置成功，感谢使用 SERAPH。",
        logout: "退出成功。",
        setting: "设置已保存。",
        salt: "已复制盐到剪贴板。",
        code: "已复制代码到剪贴板。",
        image: "已复制图片的 Markdown 元素到剪贴板。",
        import: "设置已保存；总计 {1} 条有效项目中更新了 {0} 条。",
        new: "{0} 已创建。",
        upload: "{0} 已上传至 {1}。",
        files: "所有文件",
        paste: "{0} 已粘贴至 {1}.",
        rename: "{0} 已更名为 {1}。",
        relink: "URL 已修改。",
        copy: "{0} 已复制到剪贴板。",
        cut: "{0} 已剪切到剪贴板。",
        encrypt: "{0} 已加密到当前目录。",
        decrypt: "{0} 已解密到当前目录。",
        compress: "{0} 已压缩到当前目录。",
        extract: "{0} 已解压到当前目录。",
        epub: "{0} 已转换到当前目录。",
        delete: "{0} 已被删除。",
        saveText: "文件已保存。",
        modTask: "任务已被修改。",
        modTime: "任务删除时间已更新。",
        tick: "任务将在 {0} 秒后被删除，可通过在倒计时结束前重新勾选复选框来取消该任务。",
        tickSync: "任务将在截止时间后被删除。",
        tickDel: "任务完成并被删除。",
        tickOnly: "任务已完成。",
        untick: "变更已回滚。"
      },
      warning: {
        invalidToken: "令牌无效或已过期，页面将在若干秒内自动刷新。",
        saltMissing: "服务器检测到盐被更改或删除，这会导致既有的加密文件无法恢复。您可以在下述路径找到服务器保存的所有本机备份： {0}",
        autoSaveFailed: "同步失败；在切换到其他文件或重启编辑器前自动保存功能将暂时关闭。",
        illegalRename: "文件名预检查不通过。",
        invalidConfig: "备份文件预检查不通过。"
      },
      exception: {
        incorrectPassword: "密码错误。",
        resourcesUnexist: "请求的资源不存在。",
        typeCheckFailed: "类型检查不通过。",
        identifierConflict: "命名标识符冲突；请先重命名或移除文件 {0}。",
        fileUnderRoot: "根目录下只允许创建或粘贴文件夹。",
        linkNotFound: "由于目标文件未检出 URL 链接，修改失败。",
        fileModuleError: "文件操作模块产生异常。",
        passwordUnexist: "解密密码尚未设置。",
        invalidEncrypt: "无效的 .srph 文件格式。",
        invalidDecrypt: "由于密码错误或文件被篡改，解密失败。",
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
      caption: "首次使用请设置登录密码。",
      password: {
        label: "登录密码",
        placeholder: "无限制"
      }
    },
    form: {
      login: {
        title: "登录",
        caption: "请输入登录密码以获得完全访问权限。",
        placeholder: "登录密码"
      },
      new:{
        title: "创建新目录",
        caption: "命名限制取决于服务器所在平台。",
        placeholder: "新目录名"
      },
      newLink: {
        title: "创建新 URL 链接",
        caption: "命名限制与文件格式取决于服务器所在平台。",
        filename: "名称",
        url: "URL"
      },
      newMarkdown: {
        title: "创建新 Markdown",
        caption: "命名限制取决于服务器所在平台。",
        placeholder: "新 Markdown 文件名"
      },
      rename: {
        title: "重命名",
        caption: "命名限制取决于服务器所在平台，尽量不要修改扩展名。",
        placeholder: "新文件名"
      },
      relink: {
        title: "修改 URL",
        caption: "仅检测到的第一个 URL 会被修改。",
        placeholder: "新 URL"
      },
      decrypt: {
        title: "解密",
        caption: "请输入加密此文件时设置的解密密码。",
        placeholder: "解密密码"
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
        deleteTask: "正在删除任务 {0}。",
        resetConfig: "正在恢复默认设置。"
      },
      caption: {
        discardDraft: "即将离开 Crepe，点击「继续」以丢弃未保存更改。",
        overwrite: "检测到源文件已被修改，点击「继续」以强制覆盖文本。",
        changeCipher: "请注意，即使修改了解密密码，在此之前加密的文件仍需要使用原密码解密。",
        enableTerminal: "点击「继续」表示您已知悉使用远程 PTY 的风险，并自行为一切可能造成的后果负责。"
      }
    },
    tree: {
      title: "选择保存文件",
      placeholder: "文件名",
      untitled: "未命名"
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
      },
      disabled: {
        title: "功能已禁用",
        caption: "请在设置中启用"
      }
    }
  }
}

export default zhHans;
