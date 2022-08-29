n=[43,56,78,45,1]
max=0
minimum=[]
lent=0
for i in n:
    lent+=1
def mini(n):
    v=n[0]
    for i in n:
        if i < v:
            v=i
    minimum.append(v)
    n.pop(v)
def min(n):
    v=n[0]
    for i in n:
        if i > v:
            v=i
    max.append(v)
    n.pop(v)
print(len(n))
while lent-2 <= len(n):
     mini(n)
while lent-2 <= len(n):
     max(n)
