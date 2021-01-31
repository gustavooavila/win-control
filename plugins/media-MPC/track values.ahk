SendMessage, 0x0401, 0, 0, msctls_trackbar321, ahk_class MediaPlayerClassicW ; TBM_GETRANGEMIN
RangeMin := ErrorLevel

SendMessage, 0x0402, 0, 0, msctls_trackbar321, ahk_class MediaPlayerClassicW ; TBM_GETRANGEMAX
RangeMax := ErrorLevel

MsgBox, 0, Range, %RangeMin% - %RangeMax%