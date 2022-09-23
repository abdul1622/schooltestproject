str='venzotech'
str2='en'
a=''
count=0
j=0
while j <= len(str2)-1:
    for i in str:
        if i==str2[j]:
            a+=str2[j]
            count+=1
    j+=1
if count:
    print('substring exist')
    print(a)
    

