class node:
    def __init__(self,data):
        self.data=data
        self.prev=None
        self.next=None
class circularlinked:
    def __init__(self):
        self.head=None
    def add(self,data):
        n=node(data)
        if self.head==None:
            self.head=n
            n.next=self.head
            n.prev=self.head
        else:
            self.head.next=n
            n.prev=self.head
            self.head.prev=n
        return self.head
    def display(self):
        temp=self.head
        head=temp
        while head.next != temp:
            print(temp.data)
            head=head.next
cd=circularlinked()
cd.add(0)
cd.add(1)
cd.display()
print(cd.head.data)
