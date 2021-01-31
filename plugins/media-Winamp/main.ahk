; http://forums.winamp.com/showthread.php?threadid=180297

class media_plugin_winamp extends media_plugin{
    play_pause(){       
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        
        ControlSend, ahk_parent, c 
        return true
    }
    
    previous(){
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        
        ControlSend, ahk_parent, z 
        return true
    }
    
    next(){
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        
        ControlSend, ahk_parent, b
        return true
    }
    
    stop(){
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        
        ControlSend, ahk_parent, +v
        return true
    }
    
    vol_up(){
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        
        ControlSend, ahk_parent, {up} 
        return true
    }
    
    vol_get(){
        SendMessage, 0x400, -666, 122, ,ahk_class Winamp v1.x
        return errorlevel
    }
    
    vol_set(data){ 
        vol := data.vol * 2.55 ; 0-255
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        
        SendMessage, 1024, vol, 122,, ahk_class Winamp v1.x
        return true
    }
    
    vol_down(){
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        
        ControlSend, ahk_parent, {down}
        return true
    }
    
    vol_mute() {
        this.volume := vol_get()
        if(!this.muted) {
            return this.vol_set({"vol" : 0})
        }else {
            return this.vol_set({"vol" : this.volume})
        }
    }
    
    goto_song(data){
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        songNum := data.songNum
        
        SendMessage, 1024, songNum, 121,, ahk_class Winamp v1.x
        return true
    }
    
    seek_to(data){
        if !WinExist("ahk_class Winamp v1.x"){
            return false
        }
        songSeek := data.songSeek
        
        SendMessage, 1024, songSeek, 106,, ahk_class Winamp v1.x
        return true
    }
    
    get_playlist(){
        global NodeJS
        playlistLocation := A_AppData "\Winamp\Winamp.m3u"
        
        if !WinExist("ahk_class Winamp v1.x"){
            SendMessage, 1024, 0, 120,, ahk_class Winamp v1.x
            if (ErrorLevel != "FAIL") {
                currTrack := ErrorLevel
                data := {}
                if(FileExist(playlistLocation)){
                    playlistFile := FileOpen(playlistLocation, "r")
                    playlist := playlistFile.Read()
                    
                    data["action"] := "playlist"
                    data["playlist"] := playlist
                    data["current"] := currTrack
                    data["format"] := "m3u"
                    
                    NodeJS.dispatchEvent("media", data)
                    return true
                }
            }
        }
        
        data := {}
        data["action"] := "playlist_error"
        NodeJS.dispatchEvent("media", data)
        return false
    }
    
    get_play_state(){
        global NodeJS
        if WinExist("ahk_class Winamp v1.x"){
            SendMessage, 1024, 0, 104,, ahk_class Winamp v1.x
            MsgBox % ErrorLevel
            if (ErrorLevel != "FAIL") {
                playState := ErrorLevel
                SendMessage, 1024, 0, 105,, ahk_class Winamp v1.x
                MsgBox % ErrorLevel
                if (ErrorLevel != "FAIL" and ErrorLevel != -1) {
                    playTime := ErrorLevel
                    SendMessage, 1024, 1, 105,, ahk_class Winamp v1.x
                    MsgBox % ErrorLevel
                    if (ErrorLevel != "FAIL" and ErrorLevel != -1) {
                        playLenght := ErrorLevel
                        
                        data := {}
                        if(playState == 1){
                        playState := "playing"
                        }else {
                            if(playState == 3){
                            playState := "paused"
                            }else {
                                playState := "stopped"
                            }
                        }
                        
                        data["action"] := "play_state"
                        data["play_time"] := playTime
                        data["play_state"] := playState
                        data["play_lenght"] := playLenght
                        
                        NodeJS.dispatchEvent("media", data)
                        return true
                    }
                }
            }
        }
        
        data := {}
        data["action"] := "play_state_error"
        NodeJS.dispatchEvent("media", data)
        return false
    }
}

new media_plugin_winamp()