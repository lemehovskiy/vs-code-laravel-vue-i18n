import * as vscode from "vscode";
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import path = require("path");
import parsePHPFile from "./parsePHPFile";
import sanitizeInputText from "./sanitizeInputText";

enum SelectionReplaceType {
  wTransMethod = "W_TRANS_METHOD",
  wTransComponent = "W_TRANS_COMPONENT",
  templateMethod = "TEMPLATE_METHOD",
}
const parseFile = (filePath: string): { [index: string]: any } => {
  const data = readFileSync(filePath, { encoding: "utf8" });
  return parsePHPFile(data);
};

const getPHPOutput = (obj: { [index: string]: string }) => {
  let output = `
<?php
	
return [\n`;
  Object.entries(obj).forEach(([value, key]) => {
    output += `	'${value}' => '${key}',\n`;
  });

  output += "];";
  return output;
};

function udateLang(relativePath: string, enKey: string, newField: string) {
  if (!vscode.workspace?.workspaceFolders) {
    return;
  }

  const wsPath = vscode.workspace.workspaceFolders[0].uri.fsPath; // gets the path of the first workspace folder
  const fullPath = wsPath + relativePath;

  let parsedData = {} as { [index: string]: string };
  const dirname = path.dirname(fullPath);
  if (existsSync(fullPath)) {
    parsedData = parseFile(fullPath);
  } else {
    mkdirSync(dirname, { recursive: true });
  }

  if (!(enKey in parsedData)) {
    parsedData[enKey] = newField;
  }

  const phpOutput = getPHPOutput(parsedData);
  writeFileSync(fullPath, phpOutput);
}

const getHighlightedSelection = () => {
  let editor = vscode.window.activeTextEditor;
  let selection = editor?.selection;
  if (selection && !selection.isEmpty) {
    const range = new vscode.Range(
      selection.start.line,
      selection.start.character,
      selection.end.line,
      selection.end.character
    );
    const text = editor?.document.getText(range) || "";
    return { text, range };
  } else {
    return false;
  }
};

const getSelectionReplaceType = (fullKey: string) => {
  if (/(<(\w*)>.*?<\/\2>)|<br\s+\/>/.test(fullKey)) {
    return SelectionReplaceType.wTransComponent;
  } else {
    return SelectionReplaceType.templateMethod;
  }
};

const getReplaceString = (
  fullKey: string,
  selectionReplaceType: SelectionReplaceType
) => {
  if (selectionReplaceType === SelectionReplaceType.wTransMethod) {
    return `wTrans('${fullKey}')`;
  } else if (selectionReplaceType === SelectionReplaceType.wTransComponent) {
    return `<WTrans tag="${fullKey}"/>`;
  } else {
    return `{{ $t("${fullKey}") }}`;
  }
};

const replaceSelection = (
  fullKey: string,
  range: vscode.Range,
  selectionType: SelectionReplaceType
) => {
  let editor = vscode.window.activeTextEditor;

  editor?.edit((editorBuilder) => {
    editorBuilder.replace(range, getReplaceString(fullKey, selectionType));
  });
};

const updateFiles = (key: string, text: string) => {
  const paths = vscode.workspace
    .getConfiguration()
    .get("laravel-vue-i18n.translationFolderPaths") as Array<string>;
  const fileName = vscode.workspace
    .getConfiguration()
    .get("laravel-vue-i18n.translationFileName");

  paths.forEach((path) => {
    udateLang(`${path}/${fileName}.php`, key, text);
  });
};

const addLang = async ({
  customKey = false,
  forceSelectionReplaceType = undefined,
}: {
  forceSelectionReplaceType?: SelectionReplaceType | undefined;
  customKey?: boolean;
} = {}) => {
  const highlightedSelection = getHighlightedSelection();
  if (!highlightedSelection) {
    vscode.window.showInformationMessage("Laravel Vue i18n - Nothing is selected");
    return;
  }
  const sanitizedHighlightedSelectionText = sanitizeInputText(
    highlightedSelection.text,
    forceSelectionReplaceType === SelectionReplaceType.wTransMethod
  );

  const key = customKey
    ? await vscode.window.showInputBox({
        placeHolder: "Please enter the key",
        validateInput: (text) => {
          return text !== "" ? null : "Empty string is not allowed";
        },
      })
    : sanitizedHighlightedSelectionText;

  if (!key) {
    return;
  }

  const fileName = vscode.workspace
    .getConfiguration()
    .get("laravel-vue-i18n.translationFileName");
  const fullKey = `${fileName}.${key}`;

  try {
    updateFiles(key, sanitizedHighlightedSelectionText);
    const selectionType = forceSelectionReplaceType
      ? forceSelectionReplaceType
      : getSelectionReplaceType(key);
    replaceSelection(fullKey, highlightedSelection.range, selectionType);
    vscode.window.showInformationMessage(
      "Added - " + sanitizedHighlightedSelectionText
    );
  } catch (error) {
    vscode.window.showErrorMessage((error as Error).message);
    console.log(error);
  }
};

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "addlang" is now active!');

  let addTemplateMethod = vscode.commands.registerCommand(
    "laravel-vue-i18n.addTemplateMethod",
    async () => {
      addLang();
    }
  );

  let addWTransMethod = vscode.commands.registerCommand(
    "laravel-vue-i18n.addWTransMethod",
    async () => {
      addLang({ forceSelectionReplaceType: SelectionReplaceType.wTransMethod });
    }
  );

  let addTemplateMethodWithCustomKey = vscode.commands.registerCommand(
    "laravel-vue-i18n.addTemplateMethodWithCustomKey",
    async () => {
      addLang({ customKey: true });
    }
  );

  let addWTransMethodWithCustomKey = vscode.commands.registerCommand(
    "laravel-vue-i18n.addWTransMethodWithCustomKey",
    async () => {
      addLang({ customKey: true, forceSelectionReplaceType: SelectionReplaceType.wTransMethod});
    }
  );

  context.subscriptions.push(addTemplateMethod);
  context.subscriptions.push(addTemplateMethodWithCustomKey);
  context.subscriptions.push(addWTransMethod);
  context.subscriptions.push(addWTransMethodWithCustomKey);
}

export function deactivate() {}
