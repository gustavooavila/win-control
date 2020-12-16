#Singleinstance, force
#NoTrayIcon

NodeJS_Attach()
NodeJS_Write("{""protocol"":""teste"", ""hello"": ""world""}")
NodeJS_OnMessage(data) {
    MsgBox % data
}

#Include, messaging.ahk

