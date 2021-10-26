onmouse(data){
    data := data.data
    x := data.deltas.x
    y := data.deltas.y
    btn := data.btn
    
    if(x != 0 or y != 0){
        MouseMove x, y, 0, R
    }
    
    if(btn == 1 || btn == "1"){
        MouseClick left
    }
    if(btn == 2 || btn == "2"){
        MouseClick right
    }
}
NodeJS.addEventListener("mouse", "onmouse")