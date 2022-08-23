from pyexpat import model
from django import forms
from.models import *


class Questionform(forms.ModelForm):
    class Meta:
        model = Question
        fields = "__all__"

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.fields['subject'].queryset = Subject.objects.none()
    #     self.fields['chapter'].queryset = Chapter.objects.none()


class Answerform(forms.ModelForm):
    class Meta:
        model = Answers
        fields = "__all__"
        exclude = ['question']


class Chapterform(forms.ModelForm):
    class Meta:
        model = Chapter
        fields = "__all__"
        exclude = ['subject']


class Subjectform(forms.ModelForm):
    class Meta:
        model = Subject
        fields = "__all__"
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
    grade = forms.CharField(max_length=14)
    subject = forms.CharField(max_length=20)


class subjectlist_form(forms.Form):
    grade = forms.CharField(max_length=14)


class questionlist_form(forms.ModelForm):
    # grade_name = forms.CharField(max_length=14)
    no_of_questions = forms.CharField(max_length=20)
    class Meta:
        model = Question
        fields = ['grade', 'subject', 'chapter', 'no_of_questions']

class questionCustomForm(forms.Form):
    FromChapter = forms.ChoiceField()
    toChapter = forms.ChoiceField()
    AllChapter = forms.BooleanField()
    Timing = forms.CharField()
    Overallmarks = forms.CharField()
       
class question_form(forms.ModelForm):
    class Meta:
        model = Question
        fields = '__all__'

class form_for_chapterlist(forms.ModelForm):
    class Meta:
        model = Subject
        fields = ['grade',]

class answer_form(forms.ModelForm):
    ans = question_form

    class Meta:
        model = Answers
        fields = '__all__'
        exclude = ['question']


class TestForm(forms.ModelForm):
    class Meta:
        model = Test
        fields = [ 'remarks', 'description','pass_percentage']
 

class instruction_form(forms.Form):
    instruction = forms.EmailField(widget=forms.Textarea(

    attrs={"class": "form-control", "placeholder": "Instructions"}))
