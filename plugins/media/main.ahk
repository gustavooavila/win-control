#Include media/Plugin.ahk

onMedia(data, rawdata){
    action := data.action
    plugin_found := false
    for _, plugin in media_plugin.plugins{
        if(ObjBindMethod(plugin, action).Call(data)){
            plugin_found := true
            break
        }
    }
    if(!plugin_found){
        ObjBindMethod(default_media_plugin, action).Call(data)
    }
}


NodeJS.addEventListener("media", "onMedia")