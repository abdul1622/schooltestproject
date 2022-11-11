

def printStudent(idx):
 print(students[idx])

def subjectTotal(sub):
        sum=0
        avg=0
    
        for i in range (0, len(students)):
            sum+=students[i][sub]
        avg=sum//len(students)
        #print(sum,avg)
        subtotal.append(sum)
        subavg.append(avg)

def studentTotal(idx):
    sum=0
    avg=0
    passorfail="pass"
    total=0
    for i in range(2,len(students[idx])):
        sum+=students[idx][i]
        if students[idx][i]<40:
            passorfail='fail'
    avg=sum//5
    students[idx].append(sum)
    students[idx].append(avg)
    students[idx].append(getClass(avg,passorfail))
   


def getClass(avg,pf):
    
    if(pf=='fail'):
        return 'fail' 
 
    if (avg >= 60 ):
        return 'first'
    elif (avg >= 50):
        return 'second'
    else:
        return 'third'

students =[
           ["001","name1",50,60,70,70,82],
           ["002","name2",86,72,84,96,97],
           ["003","name3",92,80,88,99,93],
           ["004","name4",63,77,55,56,47],
           ["005","name5",93,90,95,100,99],
           ["006","name6",35,40,42,49,38],

           ]
subtotal=['','subtotal',]
subavg=['','subavg',]


for i in range(0,len(students)):
    studentTotal(i)

for i in range(2,7):
    subjectTotal(i)

students.append(subtotal)
students.append(subavg)

for i in range(0,len(students)):
    printStudent(i)