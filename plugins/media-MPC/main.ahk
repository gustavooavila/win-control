class media_plugin_MCP extends media_plugin{
    play_pause(){       
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        
        SendMessage, 0x111, 889,,, ahk_class MediaPlayerClassicW
        return true
    }
    
    previous(){
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        
        SendMessage, 0x111, 921,,, ahk_class MediaPlayerClassicW
        return true
    }
    
    next(){
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        
        SendMessage, 0x111, 922,,, ahk_class MediaPlayerClassicW
        return true
    }
    
    stop(){
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        
        SendMessage, 0x111, 890,,, ahk_class MediaPlayerClassicW
        return true
    }
    
    vol_up(){
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        
        SendMessage, 0x111, 907,,, ahk_class MediaPlayerClassicW
        return true
    }
    
    vol_set(data){ 
        vol := data.vol ; 0-100
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        SendMessage, 0x422, 1, % vol, msctls_trackbar321, ahk_class MediaPlayerClassicW ;TBM_SETPOSNOTIFY := 0x422
        return true
    }
    
    vol_down(){
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        
        SendMessage, 0x111, 908,,, ahk_class MediaPlayerClassicW
        return true
    }
    
    vol_mute(){
        if !WinExist("ahk_class MediaPlayerClassicW"){
            return false
        }
        
        PostMessage, 0x111, 909,,, ahk_class MediaPlayerClassicW ;WM_COMMAND := 0x111 ;Mute (toggle mute)
        return true
    }
    
    seek_to(data){
        ;skip to point (if seek bar visible)
        ControlGet, hCtl, Hwnd,, #327704, ahk_class MediaPlayerClassicW
        ControlGetPos, vCtlX, vCtlY, vCtlW, vCtlH,, % "ahk_id " hCtl
        vPosY := 5
        vRatioX := 5 / 10
        vCtlPos := Format("X{} Y{}", Round(vCtlW*vRatioX), vPosY)
        ControlClick, % vCtlPos, % "ahk_id " hCtl    
    }
    
    get_playstate(){
        ControlGetText, vTime, Static2, ahk_class MediaPlayerClassicW
        vPos := InStr(vTime, "/")
        vElapsed := SubStr(vTime, 1, vPos-2)
        vDuration := SubStr(vTime, vPos+2)
    }
}

new media_plugin_MCP()