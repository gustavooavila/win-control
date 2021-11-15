async function load_plugins(){
    const response = await fetch("api/plugins")
    contentType = response.headers.get("content-type");
    if(contentType && contentType.indexOf("application/json") !== -1){
        return await response.json()
    }
}
