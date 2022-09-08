# def wordsCount(sentence):
#     cnt=0
#     for i in range(0,len(sentence)):
#         if(sentence[i]==' '):
#          cnt+=1
#     return cnt

# jubleString='venzo3 t2o love4 workin5g a7nd Welco1me fu9n 6here havin8g '
# wCount=wordsCount(jubleString)
# print("Word Count",wCount)
# actualSentence=[]
# for i in range(0,wCount):
#     actualSentence.append("")

# tempStr=''
# for i in range(0,len(jubleString)):
#     if(jubleString[i]!=' '):
#         tempStr+=jubleString[i]
#     else:
#         print(tempStr)
#         tempStr1=''
#         wordPosStr=''
#         for j in range(0,len(tempStr)):
#             if(tempStr[j]>='0' and tempStr[j] <='9'):
#                 wordPosStr+=tempStr[j]
#             else:
#                 tempStr1+= tempStr[j]
#         wordPos=int(wordPosStr)  
#         print(tempStr1, wordPos)
#         actualSentence[wordPos-1]=tempStr1
#         tempStr=''
# print("actualSentence",actualSentence)



def strSubString(start,subLength):
    newsubString=''
    for i in range(start,start+subLength):
        newsubString+=newString[i]
    print(newsubString)
 
def reverseStrFun(temp):
 strLength=len(temp)-1
 temp1=''
 #global reverseString
 while(strLength>=0):
     temp1+=temp[strLength]
     strLength-=1
 return temp1




def concatString(newStr):
    i = 0
    global newString
    while (i<len(newStr)):
        newString += newStr[i]
        i+=1

stringValue="Venzo"
stringValue1="Technologies"
global newString
newString = ''

reverseString=reverseStrFun(stringValue)
concatString(stringValue)
concatString(" ")
concatString(stringValue1)
print(newString)
print(reverseString)
# malayalbm anna 
string1="malaYAlam"
i=0
j=len(string1)-1
while(i<j and string1[i]==string1[j]):
    i+=1
    j-=1
if(i<j):
    print(string1,"not a palindrome")
else:
    print(string1,"palindrome")

strSubString(4,8)
searchstring="ght"
if searchstring in newString:
    print("found")  
else:
    print("not found")  

