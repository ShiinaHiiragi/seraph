const en = {
  header: {
  },
  nav: {
    title: "Seraph",
    public: "Public",
    private: "Private",
    utility: {
      title: "Utility",
      archive: "Archive",
      links: "Links",
      subscription: "Subscription",
      milkdown: "Milkdown",
      todo: "TODO"
    }
  },
  main: {
    error: {
      title: "404",
      caption: "The requested page does not exist."
    },
    folder: {
      tableColumn: {
        name: "Name",
        size: "Size",
        type: "MIME Type",
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
        move: "Move to",
        delete: "Delete"
      },
      viewRegulate: {
        unknown: "Unknown"
      }
    }
  },
  modal: {
    toast: {
      success: {
        init: "Password is set successfully. Thanks for using Seraph.",
        login: "Welcome back to Seraph.",
        logout: "Logged out successfully."
      },
      warning: {
        illegalRename: "Filename pre-check failed."
      },
      exception: {
        invalidToken: "Token is invalid or expired. The page will be refreshed automatically in seconds.",
        incorrectPassword: "Incorrect password.",
        resourcesUnexist: "Resources requested do not exist."
      },
      error: {
        unparseableResponse: "Unparseable Response: Request failed with error code {0}.",
        serverError: "Server Error: Request failed with status code {0}."
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
      rename: {
        title: "Renaming",
        caption: "Naming restrictions depend on platform on which server locates and try not to modify the extension name as much as possible.",
        placeholder: "New Filename"
      }
    },
    reconfirm: {
      title: "Reconfirmation",
      captionSecondHalf: "Click 'Continue' to apply changes.",
      captionFirstHalf: {
        logout: "You are logging out Seraph. "
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
