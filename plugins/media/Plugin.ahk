class media_plugin{
    static plugins := {}
    __new(){
        media_plugin.plugins[this.__Class] := this
    }

    __Get(key){
        return false
    }

    get_playlist(){
        data:={}
        data["action"] := "playlist_undefined"
        NodeJS.dispatchEvent("media", data)
    }

    get_play_state(){
        data := {}
        data["action"] := "play_state_error"
        NodeJS.dispatchEvent("media", data)
    }
}

class default_media_plugin extends media_plugin{
    __new(){
        
    }
    play_pause(){
        Send {Media_Play_Pause}
        return true
    }
    previous(){
        Send {Media_Prev} 
        return true
    }
    next(){
        Send {Media_Next}
        return true
    }
    stop(){
        Send {Media_Stop}
        return true
    }
    vol_up(){
        Send {Volume_Up}
        return true
    }
    vol_down(){
        Send {Volume_Down}
        return true
    }
    vol_mute(){
        Send {Volume_Mute}
        return true
    }
}