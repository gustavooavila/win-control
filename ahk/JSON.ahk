class JSON
{
	Decode(jsonStr){
		
		; Create the COM object we'll use to decode the string
		SC := ComObjCreate("ScriptControl") 
		SC.Language := "JScript"
		ComObjError(false)
		
		; This next part is a JScript (similar to JavaScript), not AHK, just FYI
		; This does the actual parsing
		jsCode =
		(
		function arrangeForAhkTraversing(obj){
			if(obj instanceof Array){
				for(var i=0 ; i<obj.length ; ++i)
					obj[i] = arrangeForAhkTraversing(obj[i]) ;
				return ['array',obj] ;
			}else if(obj instanceof Object){
				var keys = [], values = [] ;
				for(var key in obj){
					keys.push(key) ;
					values.push(arrangeForAhkTraversing(obj[key])) ;
				}
				return ['object',[keys,values]] ;
			}else
				return [typeof obj,obj] ;
		}
		)
		
		; Decode the JSON into an array (call the JS function above) using the COM object, then return an AHK object
		SC.ExecuteStatement(jsCode "; obj=" jsonStr)
		return this.convertJScriptObjToAhks( SC.Eval("arrangeForAhkTraversing(obj)") )
	}
	
	convertJScriptObjToAhks(jsObj){
		if(jsObj[0]="object"){
			obj := {}, keys := jsObj[1][0], values := jsObj[1][1]
			loop % keys.length
				obj[keys[A_INDEX-1]] := this.convertJScriptObjToAhks( values[A_INDEX-1] )
			return obj
		}else if(jsObj[0]="array"){
			array := []
			loop % jsObj[1].length
				array.insert(this.convertJScriptObjToAhks( jsObj[1][A_INDEX-1] ))
			return array
		}else
			return jsObj[1]
	}
	
	Encode(obj){
		str := ""
		array := true
		for k in obj {
			if (k == A_Index)
				continue
			array := false
			break
		}
		for a, b in obj
			str .= (array ? "" : "'" a "': ") . (IsObject(b) ? this.Encode(b) : "'" b "'") . ", "	
		str := RTrim(str, " ,")
		return (array ? "[" str "]" : "{" str "}")
	}
}