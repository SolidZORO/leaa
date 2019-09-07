#! /bin/sh

cd "$(dirname "$0")" || exit

#if [ $# != 1 ] ; then
#    echo "usage: $0 iconfont.svg(your svg file name)"
#    exit
#fi

#OutputFile path,you can customize your path
InputFileName="iconfont.svg"
# shellcheck disable=SC2116
# shellcheck disable=SC2006
OutputFileName=`echo iconfont.json`

# shellcheck disable=SC2006
mapper=`
awk '{
  if($0 ~ /glyph-name/) print $0;
  if($0 ~ /unicode/) print $0" |split|"
}' ${InputFileName} |
tr '[:upper:]' '[:lower:]' |
awk '{print $0}'  RS='\=' |
tr "\n\"&#;" " " |
awk '{
if ($1!="split"&&$1!=""){
  printf ("\""$3"\":");
  printf ($5",");
  print "\r " }
}' RS="|split|"
`

rm "$OutputFileName"

# shellcheck disable=SC2129
echo "{" >> "$OutputFileName"
echo "$mapper" >> "$OutputFileName"
echo "}" >> "$OutputFileName"

#usage:
# ./iconfont_mapper.sh svg_file_path
