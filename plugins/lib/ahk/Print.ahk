#Persistent
Print(obj, quote:=False, end:="`n")
{
    static _ := DllCall("AllocConsole"), cout := FileOpen("CONOUT$", "w")
    , escapes := [["``", "``" "``"], ["""", """"""], ["`b", "``b"]
    , ["`f", "``f"], ["`r", "``r"], ["`n", "``n"], ["`t", "``t"]]
    if IsObject(obj) {
        for k in obj
            is_array := k == A_Index
        until !is_array
        cout.Write(is_array ? "[" : "{")
        for k, v in obj {
            cout.Write(A_Index > 1 ? ", " : "")
            is_array ? _ : Print(k, 1, "") cout.Write(": ")
            Print(v, 1, "")
        } return cout.Write(( is_array ? "]" : "}") end), end ? cout.__Handle : _
    } if (!quote || ObjGetCapacity([obj], 1) == "")
        return cout.Write(obj . end), end ? cout.__Handle : _
    for k, v in escapes
        obj := StrReplace(obj, v[1], v[2])
    while RegExMatch(obj, "O)[^\x20-\x7e]", m)
        obj := StrReplace(obj, m[0], Format(""" Chr({:04d}) """, Ord(m[0])))
    return cout.Write("""" obj """" . end), end ? cout.__Handle : _
}