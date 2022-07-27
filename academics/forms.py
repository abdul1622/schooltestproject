from django import forms
from.models import *

class Questionform(forms.ModelForm):
    class Meta:
        model = Question
        fields ="__all__"

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.fields['subject'].queryset = Subject.objects.none()
    #     self.fields['chapter'].queryset = Chapter.objects.none()

class Answerform(forms.ModelForm):
    class Meta:
        model = Answers
        fields ="__all__"
        exclude = ['question']

class Chapterform(forms.ModelForm):
    class Meta:
        model = Chapter
        fields ="__all__"
        exclude = ['subject']

class Subjectform(forms.ModelForm):
    class Meta:
        model = Subject
        fields ="__all__"
        exclude = ['grade']
        
class Loginform(forms.Form):    
    email = forms.EmailField(widget=forms.TextInput(
    attrs={"class": "form-control", "placeholder": "Email"}))
    phone = forms.CharField(widget=forms.TextInput(
    attrs={"class": "form-control", "placeholder": "Phone"}))
    
class grade_form(forms.ModelForm):
    
    class Meta:
        model = Grade
        fields = '__all__'

class subject_form(forms.ModelForm):
    
    class Meta:
        model = Subject
        fields = '__all__'

class chapter_form(forms.ModelForm):
    class Meta:
        model = Chapter
        fields = '__all__'
        
class chapterlist_form(forms.Form):
    grade= forms.CharField(max_length=14)
    subject= forms.CharField(max_length=20)
        
class subjectlist_form(forms.Form):
    grade= forms.CharField(max_length=14)
    
      
class questionlist_form(forms.Form):
    grade= forms.CharField(max_length=14)
    subject= forms.CharField(max_length=20)
    no_of_questions= forms.CharField(max_length=20)

    
     
class question_form(forms.ModelForm):
    class Meta:
        model = Question
        fields = '__all__'
      
    
 
    
class answer_form(forms.ModelForm):
    ans=question_form
    class Meta:
        model = Answers
        fields = '__all__'
        exclude=['question']
class TestForm(forms.ModelForm):
    class Meta:
        model = Test
        fields = ['duration','marks','remarks','description']
