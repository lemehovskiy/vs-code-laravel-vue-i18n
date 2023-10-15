# laravel-vue-i18n README

This Visual Studio Code extension is inspired by the [laravel-vue-i18n](https://github.com/xiCO2k/laravel-vue-i18n) package and allows you to simplify the process of populating translation rows in your Laravel Vue projects.

## Features

1. Command "Add Laravel Vue 18n template method": This command replaces selected text with `{{$t('{fileName}.{selected text}')}}`. If the selected text contains tags, it will be replaced with the component `<WTrans tag="{fileName}.{selected text}"/>`.

    This command requires you to implement the `WTrans` component, which can look like this:

    ```js
    <template>
      <span v-html="value" />
    </template>

    <script setup>
    import { wTrans } from "laravel-vue-i18n";

    const props = defineProps({
      tag: { type: String, required: true },
    });

    const value = wTrans(props.tag);
    </script>
    ```

    ![feature X](https://github.com/lemehovskiy/vs-code-laravel-vue-i18n/blob/main/images/template.gif?raw=true)

2. **Command Add Laravel Vue i18n template method with custom key**: This command is similar to the previous one but allows you to enter a custom key instead of using the selected text as a key.

3. **Command Add Laravel Vue 18n wTrans method**: This command replaces selected text with wTrans('app.{selected text}'), stripping quotes around the text. Here's a demo:

    ![feature X](https://github.com/lemehovskiy/vs-code-laravel-vue-i18n/blob/main/images/wTrans.gif?raw=true)

4. **Command Add Laravel Vue i18n wTrans method with custom key**: Similar to the previous command, this option lets you enter a custom key instead of using the selected text as a key.

## How to Use

To use these commands in Visual Studio Code, follow these steps:

1. Select Text: Highlight the text you want to replace with the Laravel Vue i18n method.

2. Open the Command Palette: You can do this by pressing Ctrl+Shift+P on Windows/Linux or Cmd+Shift+P on macOS.

3. Search for the Command: Type the name of the command you want to use. For example, type "Add Laravel Vue 18n template method" or "Add Laravel Vue 18n wTrans method."

4. Select the Command: From the list of commands that appear, select the one you want to use.

5. Customize (if applicable): If the command allows customization (e.g., adding a custom key), follow the on-screen prompts to provide the necessary information.

## Extension Configuration

This extension provides the following settings:

* `laravel-vue-i18n.translationFileName`: Set the translation file name (default is 'app').
* `laravel-vue-i18n.translationFolderPaths`: Define translation folder paths (default is ["/lang/en", "/lang/uk"]).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/lemehovskiy/vs-code-laravel-vue-i18n/blob/main/LICENSE) file for details.
