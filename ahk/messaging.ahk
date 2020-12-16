stdin    := FileOpen("*", "r `n")
stdout   := FileOpen("*", "w `n")
latest   := ""

NodeJS_Write(string) {
    FileAppend, %string%`n,*
}

Loop {
	Sleep, 10
    
	data := RTrim(stdin.ReadLine(), "`n")
	stdin.Read(0)
    
	if (latest = data) {
        latest = %latest%
	} else {
        FuncExist := IsFunc("NodeJS_OnMessage") 
        If FuncExist {
            NodeJS_OnMessage(data)
        }
    }
	
	latest = %data%
}