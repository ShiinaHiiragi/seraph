const en = {
  header: {
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
        platform: "Platform",
        kernelVersion: "Kernel Version",
        memoryAvailable: "Memory Available",
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
      rowMenu: {
        open: "Open",
        rename: "Rename",
        copy: "Copy",
        cut: "Cut",
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
    todo: {
      regulate: {
        name: "Task Name",
        description: "Description",
        type: "Type",
        dueTime: "Due Time"
      },
      form: {
        search: "Search Task",
        filter: "Filter by Type",
        add: "Add",
        edit: "Edit",
        delete: "Delete"
      },
      type: {
        all: "All Type",
        permanant: "Permanant",
        async: "Async",
        sync: "Sync"
      }
    }
  },
  modal: {
    toast: {
      plain: {
        login: "Welcome back to Seraph.",
        generalReconfirm: "Operation is in progress, please wait for a second.",
        uploading: "The file is being uploaded, please wait for a second."
      },
      success: {
        init: "Password is set successfully. Thanks for using Seraph.",
        logout: "Logged out successfully.",
        new: "{0} has been created.",
        upload: "{0} has been uploaded to {1}.",
        paste: "{0} has been pasted to {1}.",
        rename: "{0} has been renamed to {1}.",
        copy: "{0} has been copied in clipboard.",
        cut: "{0} has been cut to clipboard.",
        delete: "{0} has been deleted."
      },
      warning: {
        invalidToken: "Token is invalid or expired. The page will be refreshed automatically in seconds.",
        illegalRename: "Filename pre-check failed."
      },
      exception: {
        incorrectPassword: "Incorrect password.",
        resourcesUnexist: "Resources requested do not exist.",
        identifierConflict: "Naming identifiers conflicts.",
        fileModuleError: "Exception occurred in file operation module."
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
        caption: "Eu ex sit ea occaecat ipsum eu velit commodo sit amet ullamco eu."
      }
    },
    reconfirm: {
      title: "Reconfirmation",
      captionSecondHalf: "Click 'Continue' to apply changes.",
      captionFirstHalf: {
        logout: "You are logging out Seraph. ",
        delete: "You are deleting file {0}. "
      }
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
      timeFormat: "hh:mm:ss"
    },
    button: {
      submit: "Submit",
      continue: "Continue",
      cancel: "Cancel"
    },
    placeholder: {
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
    }
  }
}

export default en;
