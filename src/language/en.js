const en = {
  header: {
    config: {
      title: "Setting",
      general: {
        title: "General",
        language: "Display Language",
        token: "Token Expiry",
        tokenHint: "since last access",
        tokenOption: {
          15: "15 minutes",
          60: "1 hour",
          720: "12 hours",
          1440: "1 day",
          2880: "2 day"
        },
        password: "Change Password",
        reset: "Reset to Default",
        resetButton: "Reset"
      },
      terminal: {
        title: "Terminal",
        enable: "Enable Terminal",
        shell: "Shell",
        shellLinux: "Shell path on Linux",
        shellWin32: "Shell path on Windows",
        lifecycle: "Lifecycle",
        lifecycleTimeout: "Connection Timeout",
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
        title: "TODO",
        deleteTime: "Delete Delay",
        deleteTimeHint: "of completed tasks",
        deleteTimeOption: {
          0: "Immediately",
          60: "1 minute",
          3600: "1 hour",
          86400: "1 day"
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
        outHTML: "Convert markdown to HTML",
        outVert: "Make HTML text vertical",
        outKeep: "Keep intermediate markdown files"
      },
      appendix: {
        reload: " (reload required)"
      }
    }
  },
  nav: {
    title: "Seraph",
    public: "Public",
    private: "Private",
    utility: {
      title: "Utility",
      links: "Links",
      subscription: "Subscription",
      milkdown: "Milkdown",
      terminal: "Terminal",
      todo: "TODO"
    }
  },
  main: {
    welcome: {
      osInfo: {
        userAtHostname: "Username@Hostname",
        platform: "Kernel and Platform",
        kernelVersion: "OS Version",
        memoryAvailable: "Memory Available",
        storageAvailable: "Storage Available",
        uptime: "Uptime"
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
        rename: "Rename",
        copy: "Copy",
        cut: "Cut",
        compress: "Compress",
        extract: "Extract",
        epub: "Convert",
        delete: "Delete"
      },
      viewRegulate: {
        all: "All Type",
        unknown: "Unknown",
        directory: "Directory",
        search: "Search by Name",
        filter: "Filter by Type",
        add: "Add"
      },
      addMenu: {
        newFolder: "New Directory",
        newFile: "Upload File",
        paste: "Paste"
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
        uploading: "The file is being uploaded. Please wait for a second."
      },
      success: {
        init: "Password is set successfully. Thanks for using Seraph.",
        logout: "Logged out successfully.",
        setting: "New setting has been saved.",
        new: "{0} has been created.",
        upload: "{0} has been uploaded to {1}.",
        files: "All files",
        paste: "{0} has been pasted to {1}.",
        rename: "{0} has been renamed to {1}.",
        copy: "{0} has been copied in clipboard.",
        cut: "{0} has been cut to clipboard.",
        compress: "{0} has been compressed to current directory.",
        extract: "{0} has been extracted to current directory.",
        epub: "{0} has been converted to current directory.",
        delete: "{0} has been deleted.",
        modTask: "The task has been modified.",
        modTime: "Delete time of the task has been updated.",
        tick: "The task will be deleted in {0} seconds, which can be cancelled by re-ticking the checkbox before the end of its countdown.",
        tickSync: "The task will be deleted after due time.",
        tickDel: "The task is completed and deleted immediately.",
        untick: "Changing has been rolled back."
      },
      warning: {
        invalidToken: "Token is invalid or expired. The page will be refreshed automatically in seconds.",
        illegalRename: "Filename pre-check failed."
      },
      exception: {
        incorrectPassword: "Incorrect password.",
        resourcesUnexist: "Resources requested do not exist.",
        identifierConflict: "Naming identifiers conflicts.",
        fileModuleError: "Exception occurred in file operation module.",
        environmentMissing: "Pre-check for extension module environment failed. Please check console for more details.",
        extensionError: "Exception occurred in inner extension module. Please check console for more details.",
        duplicateRequest: "Duplicate Request: Please decrease operation frequency."
      },
      error: {
        unparseableResponse: "Unparseable Response: Request failed with error code {0}.",
        serverError: "Server Error: Request failed with status code {0}.",
        browserError: "Browser Error: Received {0} ({1})."
      }
    },
    init: {
      title: "Initialization",
      caption: "Please set up password on first usage.",
      password: {
        label: "Password",
        placeholder: "No Restriction"
      }
    },
    form: {
      login: {
        title: "Login",
        caption: "Please enter password to acquire full access.",
        placeholder: "Password"
      },
      new:{
        title: "Create New Directory",
        caption: "Naming restrictions depend on platform on which server locates.",
        placeholder: "New Directory Name"
      },
      rename: {
        title: "Renaming",
        caption: "Naming restrictions depend on platform on which server locates and try not to modify the extension name as much as possible.",
        placeholder: "New Filename"
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
        deleteTask: "You are deleting task {0}. "
      },
      caption: {
        enableTerminal: "By clicking 'Continue', you acknowledge the risks of using remote PTY and accept full responsibility for any consequences that may result."
      }
    }
  },
  setting: {
    general: {
      language: "Language"
    }
  },
  console: {
    dependencies: "Missing dependencies:"
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
