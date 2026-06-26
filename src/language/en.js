const en = {
  header: {
    config: {
      title: "Setting",
      general: {
        title: "General",
        language: "Display Language",
        reset: "Reset to Default",
        resetButton: "Reset",
        upload: "Import Setting",
        uploadButton: "Import",
        download: "Export Setting",
        downloadButton: "Export",
        width: 100
      },
      account: {
        title: "Account",
        token: "Token Expiry",
        tokenTip: "Each request extends the token expiration time (excluding terminal WebSocket connections).",
        tokenOption: {
          15: "15 minutes",
          60: "1 hour",
          720: "12 hours",
          1440: "1 day",
          2880: "2 day"
        },
        password: "Change Login Password"
      },
      welcome: {
        title: "Dashboard",
        enable: "Enable Dashboard",
        enableTip: "CPU temperature and disk I/O data may not be available due to differences of platforms or machine models.",
        enableTemp: "Show CPU temperature status on dashboard",
        enableDisk: "Show Disk I/O status on dashboard",
        interval: "Request Interval",
        intervalTip: "How often the client synchronizes real-time data. Longer intervals reduce server load but may decrease data freshness.",
        intervalOption: {
          1: "1 second",
          2: "2 seconds",
          3: "3 seconds",
          4: "4 seconds",
          5: "5 seconds",
          10: "10 seconds",
          15: "15 seconds",
          30: "30 seconds",
          45: "45 seconds",
          60: "60 seconds"
        },
        window: "History Window Size",
        windowCpu: "CPU",
        windowTemp: "Temperature",
        windowMemory: "Memory",
        windowStorage: "Storage",
        windowDisk: "Disk I/O",
        windowNet: "Network Rx/Tx",
        process: "Processes List",
        processHint: "applied on next request",
        processSort: "Sort by",
        processSortBy: {
          cpu: "CPU",
          mem: "Memory",
          priority: "Priority"
        },
        processCount: "Number of Processes"
      },
      file: {
        title: "Files",
        sort: "Default Sorting",
        sortBy: {
          name: "Name",
          size: "Size",
          type: "Type",
          time: "Time"
        },
        sortOrder: "Order",
        sortOrderOption: {
          asc: "Ascending",
          desc: "Descending"
        },
        salt: "Decryption Salt",
        saltTip: "Decryption salt does not change when password changes. All files encrypted before can no longer be recovered once the salt is lost.",
        saltUnexist: "(Not set)",
        cipher: "Change Decryption Password"
      },
      crepe: {
        title: "Editor",
        save: "Auto Save Delay",
        saveOption: {
          1: "1 second",
          2: "2 seconds",
          3: "3 seconds",
          4: "4 seconds",
          5: "5 seconds",
          0: "Disabled"
        },
        show: "Display for Guests",
        showTip: "Unlogged users can still access Crepe via URL even if you choose not to display it.",
        edit: "Default Editing Mode",
        editOption: {
          true: "Always editable",
          false: "Always read-only",
          auto: "Editable only if content is not empty"
        },
        feature: "Features",
        featureBlockEdit: "Enable block edit",
        featureToolbar: "Enable toolbar",
        featureStat: "Enable word count",
        featureSpellCheck: "Enable spell check",
        code: "Code Mirror",
        codeLineNumber: "Show line numbers",
        codeLineGutter: "Highlight active line gutter",
        shortcut: "Editor Shortcuts",
        shortcutNull: "(None)",
        shortcutList: {
          save: "Save File",
          edit: "Readonly / Editable",
          download: "Download File",
          blockText: "Paragraph",
          blockH1: "Heading 1",
          blockH2: "Heading 2",
          blockH3: "Heading 3",
          blockH4: "Heading 4",
          blockH5: "Heading 5",
          blockH6: "Heading 6",
          blockQuote: "Quote",
          blockDivider: "Divider",
          blockBullet: "Unordered list",
          blockOrdered: "Ordered list",
          blockTask: "Task list",
          blockImage: "Image Block",
          blockCode: "Code Block",
          blockTable: "Table",
          blockLatex: "Block math",
          inlineBold: "Bold text",
          inlineItalic: "Italic text",
          inlineStrike: "Strike through",
          inlineImage: "Inline image",
          inlineCode: "Inline code",
          inlineLatex: "Inline math",
          inlineLink: "Link"
        }
      },
      terminal: {
        title: "Terminal",
        enable: "Enable Terminal",
        shell: "Shell",
        shellLinux: "Shell path on Linux",
        shellWin32: "Shell path on Windows",
        lifecycle: "Lifecycle",
        lifecycleTimeout: "Connection timeout",
        lifecycleTimeoutOption: {
          15: "15 minutes",
          30: "30 minutes",
          60: "1 hour",
          120: "2 hours",
          240: "4 hours",
          360: "6 hours"
        },
        lifecyclePing: "Ping interval",
        lifecyclePingOption: {
          0: "Never",
          15: "15 seconds",
          30: "30 seconds",
          45: "45 seconds",
          60: "1 minute",
          120: "2 minutes",
          180: "3 minutes",
          240: "4 minutes",
          300: "5 minutes"
        },
        cursor: "Cursor",
        cursorBlink: "Cursor blinks",
        reflowCursorLine: "Reflow the line containing cursor",
        cursorStyle: "Style of active curcor",
        activeStyleOption: {
          block: "Block",
          bar: "Bar",
          underline: "Underline"
        },
        cursorInactiveStyle: "Style of inactive curcor",
        inactiveStyleOption: {
          outline: "Outline",
          block: "Block",
          bar: "Bar",
          underline: "Underline",
          none: "None"
        },
        font: "Font",
        fontSize: "Font size",
        fontFamily: "Terminal Font",
        fontWeight: "Font weight of normal text",
        fontWeightBold: "Font weight of bold text",
        text: "Text",
        letterSpacing: "Letter spacing",
        lineHeight: "Line height",
        contrastRatio: "Minimum contrast ratio",
        wordSeparator: "Word separators",
        scroll: "Scrolling",
        scrollback: "Amount of scrollback",
        scrollNormal: "Normal scrolling sensitivity",
        scrollFast: "Fast scrolling sensitivity",
        theme: "Theme",
        themeTransparency: "Allow transparent background",
        themeOption: {
          selectionBackground: "Background selection color",
          background: "Background color",
          foreground: "Foreground color",
          cursor: "Cursor color",
          cursorAccent: "Cursor accent color",
          black: "Black color",
          blue: "Blue color",
          cyan: "Cyan color",
          green: "Green color",
          magenta: "Magenta color",
          red: "Red color",
          white: "White color",
          yellow: "Yellow color",
          brightBlack: "Bright black color",
          brightBlue: "Bright blue color",
          brightCyan: "Bright cyan color",
          brightGreen: "Bright green color",
          brightMagenta: "Bright magenta color",
          brightRed: "Bright red color",
          brightWhite: "Bright white color",
          brightYellow: "Bright yellow color"
        },
        control: "Control Characters"
      },
      todo: {
        title: "Task",
        deleteTime: "Delete Delay",
        deleteTimeHint: "of completed tasks",
        deleteTimeOption: {
          0: "Immediately",
          60: "1 minute",
          3600: "1 hour",
          86400: "1 day",
          never: "Never"
        }
      },
      extension: {
        title: "Extensions",
        python: "Python",
        pythonLinux: "Python path on Linux",
        pythonWin32: "Python path on Windows",
        pandoc: "Pandoc",
        pandocLinux: "Pandoc path on Linux",
        pandocWin32: "Pandoc path on Windows"
      },
      epub: {
        title: "Epub Converter",
        enable: "Enable Converter",
        page: "Pages",
        pageSplit: "Split pages by chapters",
        pageFront: "Include front pages",
        nav: "Navigation",
        navLink: "Show navigation links at the end",
        navPrev: "Link text for previous page",
        navNext: "Link text for next page",
        fade: "Fading",
        fadeNull: "Do not perform fading",
        fadeTrue: "Fade paragraphs containing kana",
        fadeFalse: "Fade paragraphs not containing kana",
        fadeOpaque: "Opacity level of faded text",
        fadeSize: "Font size of faded text",
        fadeTop: "Top offset of faded text",
        image: "Image",
        imageSpec: "Identify inline images heuristically",
        imageShow: "Display block level images",
        imageAltInline: "Show alt text for inline images",
        imageAltBlock: "Show alt text for block images",
        imageWidth: "Width of block images (empty for null)",
        text: "Text",
        textClearLine: "Clear empty lines",
        textShowRuby: "Show ruby if exists",
        textBreakLine: "Text to replace <br> (escapes supported)",
        out: "Output",
        outTip: "The output HTML styles are fixed and cannot be changed.",
        outHTML: "Convert markdown to HTML",
        outVert: "Make HTML text vertical",
        outKeep: "Keep intermediate markdown files"
      },
      placeholder: {
        password: "Please save after input"
      },
      appendix: {
        reload: " (reload required)"
      },
      fallback: {
        seconds: "{0} seconds",
        minutes: "{0} minutes"
      }
    }
  },
  nav: {
    title: "Seraph",
    public: "Public",
    private: "Private",
    utility: {
      title: "Utility",
      subscription: "Subscription",
      milkdown: "Crepe",
      terminal: "Terminal",
      todo: "Task"
    }
  },
  main: {
    welcome: {
      kpiCards: {
        cpu: "CPU",
        cores: "Cores",
        memory: "Memory",
        storage: "Storage",
        available: "available",
        uptime: "Uptime"
      },
      trend: {
        cpu: "CPU Status",
        temp: "Temperature",
        memory: "Memory Status",
        storage: "Storage Status",
        rxDisk: "Read Status",
        wxDisk: "Write Status",
        rxNet: "RX Status",
        txNet: "TX Status",
        min: "Min: ",
        max: "Max: ",
        avg: "Avg: "
      },
      info: {
        systemInfo: "System Information",
        manufacturer: "Manufacturer",
        model: "Device Model",
        serial: "Serial",
        virtual: "Virtual Machine",
        virtualNull: "N/A",
        biosVersion: "BIOS Version",
        platform: "Operating System",
        kernel: "Kernel Version",
        cpuModel: "CPU Model",
        cpuCache: "Cache",
        mac: "MAC Address",
        network: "Network Interfaces",
        process: "Processes List",
        name: "Name",
        pid: "PID",
        cpu: "CPU %",
        mem: "MEM %",
        priority: "PRIO"
      }
    },
    error: {
      title: "404",
      caption: "The requested page does not exist."
    },
    folder: {
      tableColumn: {
        name: "Name",
        size: "Size",
        type: "Type",
        time: "Created Time",
        operation: "Operations"
      },
      listHint: {
        createTime: "Created at {0}",
        modifiedTime: "Last modified at {0}"
      },
      items: "{0} Items",
      rowMenu: {
        open: "Open",
        download: "Download",
        rename: "Rename",
        relink: "Modify URL",
        copy: "Copy",
        cut: "Cut",
        encrypt: "Encrypt",
        decrypt: "Decrypt",
        compress: "Compress",
        extract: "Extract",
        epub: "Convert",
        copyImage: "Copy Element",
        delete: "Delete"
      },
      viewRegulate: {
        all: "All Type",
        unknown: "Unknown",
        link: "URL Link",
        encrypt: "Encrypted File",
        directory: "Directory",
        search: "Search by Name",
        filter: "Filter by Type",
        add: "Add"
      },
      addMenu: {
        newFolder: "New Directory",
        newLink: "New URL Link",
        newMarkdown: "New Markdown",
        newFile: "Upload File",
        paste: "Paste"
      }
    },
    crepe: {
      placeholder: "Enter text here",
      sync: {
        saving: "Saving",
        saved: "Saved"
      },
      image: {
        upload: "Upload",
        link: "or input link instead",
        caption: "Input caption here",
      },
      code: {
        search: "Search for language",
        noResult: "No result",
        copy: "Copy",
        hide: "Hide",
        edit: "Edit",
        preview: "Preview"
      },
      stat: {
        title: "Word Count",
        lines: "Lines",
        words: "Words",
        chars: "Characters"
      },
      popup: {
        url: "URL",
        slash: {
          text: {
            title: "Text",
            text: "Text",
            h1: "Heading 1",
            h2: "Heading 1",
            h3: "Heading 1",
            h4: "Heading 1",
            h5: "Heading 1",
            h6: "Heading 1",
            quote: "Quote",
            divider: "Divider"
          },
          list: {
            title: "List",
            bulletList: "Unordered List",
            orderedList: "Ordered List",
            taskList: "Task List"
          },
          advanced: {
            title: "Advanced",
            image: "Image",
            codeBlock: "Code",
            table: "Table",
            math: "Math"
          }
        }
      }
    },
    terminal: {
      send: "Send Control Characters"
    },
    todo: {
      regulate: {
        createTime: "Time Created",
        name: "Task Name",
        description: "Description",
        type: "Type",
        dueTime: "Due Time"
      },
      form: {
        sort: "Sort by",
        filter: "Filter by Type",
        add: "Add",
        edit: "Edit",
        delete: "Delete"
      },
      type: {
        all: "All Type",
        permanent: "Permanent",
        async: "Async",
        sync: "Sync"
      }
    }
  },
  modal: {
    toast: {
      plain: {
        login: "Welcome back to Seraph.",
        generalReconfirm: "Operation is in progress. Please wait for a second.",
        uploading: "The file is being uploaded. Please wait for a second.",
        updateSetting: "Latest setting has been synchronized."
      },
      success: {
        init: "Login password is set successfully. Thanks for using Seraph.",
        logout: "Logged out successfully.",
        setting: "New setting has been saved.",
        salt: "Salt has been copied to clipboard.",
        code: "Code has been copied to clipboard.",
        image: "Markdown element of the image has been copied to clipboard.",
        import: "New setting has been saved, and {0} out of {1} valid entries has been updated.",
        new: "{0} has been created.",
        upload: "{0} has been uploaded to {1}.",
        files: "All files",
        paste: "{0} has been pasted to {1}.",
        rename: "{0} has been renamed to {1}.",
        relink: "The link has been modified.",
        copy: "{0} has been copied to clipboard.",
        cut: "{0} has been cut to clipboard.",
        encrypt: "{0} has been encrypted to current directory.",
        decrypt: "{0} has been decrypt to current directory.",
        compress: "{0} has been compressed to current directory.",
        extract: "{0} has been extracted to current directory.",
        epub: "{0} has been converted to current directory.",
        delete: "{0} has been deleted.",
        saveText: "The file has been saved.",
        modTask: "The task has been modified.",
        modTime: "Delete time of the task has been updated.",
        tick: "The task will be deleted in {0} seconds, which can be cancelled by re-ticking the checkbox before the end of its countdown.",
        tickSync: "The task will be deleted after due time.",
        tickDel: "The task is completed and deleted immediately.",
        tickOnly: "The task is completed.",
        untick: "Changing has been rolled back."
      },
      warning: {
        invalidToken: "Token is invalid or expired. The page will be refreshed automatically in seconds.",
        saltMissing: "The server has detected that the decryption salt was changed or deleted, which may make previously encrypted files unrecoverable. You can find all local salt backups saved under \n{0}.",
        autoSaveFailed: "Synchronization failed. The auto-save feature will be temporarily disabled before switching to another file or restarting the editor.",
        uploadFolder: "Uploading folders is not supported.",
        illegalRename: "Filename pre-check failed.",
        invalidConfig: "Backup file pre-check failed."
      },
      exception: {
        incorrectPassword: "Incorrect password.",
        resourcesUnexist: "Resources requested do not exist.",
        typeCheckFailed: "Type check failed.",
        identifierConflict: "Naming identifiers conflicts; please rename or remove {0} first.",
        fileUnderRoot: "Only folders are allowed to be created or pasted under root path.",
        linkNotFound: "Modification failed due to non-existence of URL link detected in the target file.",
        fileModuleError: "Exception occurred in file operation module.",
        passwordUnexist: "The decryption password has not been set.",
        invalidEncrypt: "Invalid .srph file format.",
        invalidDecrypt: "Decryption failed due to invalid password or file tampering.",
        environmentMissing: "Pre-check for extension module environment failed due to following missing dependencies: \n{0}",
        extensionError: "Exception occurred in inner extension module. Please check console for more details.",
        duplicateRequest: "Duplicate Request: Please decrease operation frequency."
      },
      error: {
        unparseableResponse: "Unparseable Response: Request failed with error code {0}.",
        serverError: "Server Error: Request failed with status code {0}.",
        browserError: "Browser Error: Received {0}\n{1}."
      }
    },
    init: {
      title: "Initialization",
      caption: "Please set up login password on first usage.",
      password: {
        label: "Login Password",
        placeholder: "No Restriction"
      }
    },
    form: {
      login: {
        title: "Login",
        caption: "Please enter login password to acquire full access.",
        placeholder: "Login Password"
      },
      new:{
        title: "Create New Directory",
        caption: "Naming restrictions depend on platform on which server locates.",
        placeholder: "New Directory Name"
      },
      newLink: {
        title: "Create New URL Link",
        caption: "Naming restrictions and file format depend on platform on which server locates.",
        filename: "Name",
        url: "URL"
      },
      newMarkdown: {
        title: "Create New Markdown",
        caption: "Naming restrictions and file format depend on platform on which server locates.",
        placeholder: "New Markdown Filename"
      },
      rename: {
        title: "Renaming",
        caption: "Naming restrictions depend on platform on which server locates and try not to modify the extension name as much as possible.",
        placeholder: "New Filename"
      },
      relink: {
        title: "Modify URL",
        caption: "Only the first URL detected will be modified.",
        placeholder: "New URL"
      },
      decrypt: {
        title: "Decrypting",
        caption: "Please enter the decryption password set when encrypting this file.",
        placeholder: "Decryption Password"
      },
      todo: {
        new: "Create New Task",
        edit: "Edit Task",
        caption: "Tasks of permanent type have no due time specified. Due time is attached to tasks of async or sync type, and the former can be completed in advance, while the latter must be completed at that very time exactly.",
        helperFirstHalf: "The due time is earlier than now{0}.",
        helperSecondHalf: ", but the task can still be created or edited"
      }
    },
    reconfirm: {
      title: "Reconfirmation",
      captionSecondHalf: "Click 'Continue' to apply changes.",
      captionFirstHalf: {
        logout: "You are logging out Seraph. ",
        deleteFile: "You are deleting file {0}. ",
        deleteTask: "You are deleting task {0}. ",
        resetConfig: "You are resetting configs. "
      },
      caption: {
        discardDraft: "You are leaving Crepe without saving. Click 'Continue' to discard unsaved changes.",
        overwrite: "The source file has been modified. Click 'Continue' to overwrite text forcibly.",
        changeCipher: "Please note that even if you change the decryption password, files encrypted before the change must still be decrypted using the original password.",
        enableTerminal: "By clicking 'Continue', you acknowledge the risks of using remote PTY and accept full responsibility for any consequences that may result."
      }
    },
    tree: {
      title: "Select Directory to Save",
      placeholder: "Filename",
      untitled: "Untitled"
    }
  },
  setting: {
    general: {
      language: "Language"
    }
  },
  universal: {
    time: {
      dateFormat: "MM/dd/yyyy",
      timeFormat: "hh:mm:ss",
      taskModalFormat: "MM/DD/YYYY HH:mm",
      taskListFormat: "MM/dd/yyyy hh:mm"
    },
    button: {
      submit: "Submit",
      continue: "Continue",
      cancel: "Cancel"
    },
    placeholder: {
      instruction: {
        required: "Required",
        optional: "Optional"
      },
      deny: {
        title: "Permission Denied",
        caption: "Log in to acquire full access."
      },
      unexist: {
        title: "Resources Unavailable",
        caption: "A typo may be made in URL. Re-check your input and try again."
      },
      inDevelopment: {
        title: "In Development",
        caption: "Please submit a new issue on GitHub if you are in need of it."
      },
      disabled: {
        title: "Feature Disabled",
        caption: "Enable it in setting to access the feature."
      }
    }
  }
}

export default en;
