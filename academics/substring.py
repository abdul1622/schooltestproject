givenString = 'Venzo Technologies'
substring = 'no'
i=0
j=0
count=0
while(i< len(givenString)):
    # print("given:",givenString[i])
    while(j<len(substring)):
        # print("substr:",substring[j])
        if (givenString[i] == substring[j]):
            print("given:",givenString[i],"substr:",substring[j])

        
            i+=1
            j+=1
            # if 1 == j:
            #     count+=1
            #     print("count",count)       
        else:
            i+=1
    
if count == 1:
    print("substring is present" )
else:
    print("substring not is present" )


