onmouse(data, raw_data){
    global NodeJS
    
    x := data.deltas.x
    y := data.deltas.y
    btn := data.btn
    
    if(x != 0 or y != 0){
        MouseMove x, y, 0, R
    }
    
    if(data.btn == 1){
        MouseClick left
    }
    if(data.btn == 2){
        MouseClick right
    }
}
NodeJS.addEventListener("mouse", "onmouse")