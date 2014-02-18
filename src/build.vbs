' Dependencies:
' 1) Java (set path below)
' 2) ShrinkSafe.jar (put both shrinksafe.jar and js.jar in directory

Option Explicit

Dim fileSO, folderSO, scriptFolderPath
Dim depFilePath, depFileAll, depLines, depLine
Dim destFilePath, destFile
Dim destMinFilePath
Dim javaExePath
Dim yuiCompressorFileName
Dim shrinkSafeFileName
Dim objShell
Dim javaExeString
Dim fileTxt, fileContents

' Paths
depFilePath = "dependencies-win.txt"
destFilePath = "sp.js"
destMinFilePath = "sp.min.js"
javaExePath = "C:\Program Files (x86)\Java\jre7\bin\java.exe"
yuiCompressorFileName = "yuicompressor-2.4.8.jar"
shrinkSafeFileName = "shrinksafe.jar"

Set fileSO = CreateObject("Scripting.FileSystemObject")

' Get script path so relative paths can be used
scriptFolderPath = fileSO.GetParentFolderName(WScript.ScriptFullName)
Set folderSO = fileSO.GetFolder(scriptFolderPath)

' Create destination file for combined JS
Set destFile = folderSO.CreateTextFile(destFilePath)

depFileAll = fileSO.OpenTextFile(depFilePath,1).ReadAll
depLines = Split(depFileAll, VbCrLf)

For Each depLine In depLines
    
    destFile.Write(VbCrLf + VbCrLf + "// ***** File: " + depLine + " *****" + VbCrLf + VbCrLf)

    Dim jsFileAll
	
	jsFileAll = fileSO.OpenTextFile(folderSO.Path + depLine,1).ReadAll
	destFile.Write(jsFileAll)

Next

destFile.Close

' Run file through obfuscator

'javaExeString = """" + javaExePath + """ -jar " + yuiCompressorFileName + " " + destFilePath + " -o " + destMinFilePath
javaExeString = "%comspec% /c """ + javaExePath + """ -jar " + shrinkSafeFileName + " " + destFilePath + " > " + destMinFilePath

'MsgBox(javaExeString)

Set objShell = WScript.CreateObject ("WScript.Shell")
objShell.Run javaExeString

' Remove newlines from resulting file
'MsgBox folderSO.Path + "\" + destMinFilePath
Set fileTxt = fileSO.OpenTextFile(folderSO.Path + "\" + destMinFilePath, 1)
fileContents = fileTxt.ReadAll
fileTxt.Close

fileContents = Replace(fileContents, vbCr, "")
fileContents = Replace(fileContents, vbLf, "")

Set fileTxt = fileSO.OpenTextFile(folderSO.Path + "\" + destMinFilePath, 2)
fileTxt.Write fileContents
fileTxt.Close
