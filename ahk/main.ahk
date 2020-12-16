#Singleinstance, force
#NoTrayIcon

NodeJS_OnMessage(data) {
    MsgBox % SubStr(data, 2, -1)
    NodeJS_Write(SubStr(data, 2, -1))
}

#Include, messaging.ahk

