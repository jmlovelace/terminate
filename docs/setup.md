# Setting Up the Application

This is a basic walkthrough to setting up the game on your own machine.


## 1: Clone the Repo

Download, clone, or otherwise obtain all the files from this repository and
place them in a directory on your local machine or server. While the name of the
containing directory doesn't particularly matter, it's important that everything
inside of it has the same structure. Look at this repo and/or
[the architecture documentation](./project-architecture.md) for quick reference.

The main HTML file will be located at **`./index.html`**, for reference.


## 2: Edit the config files

In the **`./config/`** directory exists a handful of configuration files. See
[this section](./project-architecture.md#config) for more information on setting
them up.


## 3: Host the directory

Now that you have all the game files, you need to make them accessible.

> Note: Due to the usage of [native JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules),
> the game **will not** function properly if you simply open the HTML file in
> your browser from the filesystem. You **must** host it with an HTTP server.

### Things to watch out for:
When viewing the hosted page in your browser, you may see an error in the
console:
`Loading module from "<host url>" was blocked because of a disallowed MIME type.`
This means that your server doesn't use the proper MIME type to serve files with
the `.mjs` extension. Ensure that it's configured to serve these files with the
MIME type of `text/javascript` or another JS-compatible type.


## 4: Test the page

Now, just navigate to the location that you're hosting the game from and ensure
everything works as expected. If so, you're good to go!