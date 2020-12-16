stdin    := FileOpen("*", "r `n")
stdout   := FileOpen("*", "w `n")
latest   := ""

NodeJS_Attach() {
    FileAppend,AUTOHOTKEY_NODEJS_ATTACH`n,*
    sleep, 50
}

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
            if (data = "NODEJS_AUTOHOTKEY_ATTACH") {
                NodeJS_Attach()
            } else {
                NodeJS_OnMessage(data)
            }
        }
	}
	
	latest = %data%
}