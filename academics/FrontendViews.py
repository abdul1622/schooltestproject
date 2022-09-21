from multiprocessing import reduction
from urllib import response
from . forms import *
from django.shortcuts import render,redirect
from .models import *
import requests
import json



def gradeview(request): 
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff':
        gradeform = grade_form
        subjectform = Subjectform
        chapterform = Chapterform
        return render(request,'academics/grade-subject-chapter.html',{'gradeform':gradeform,'subjectform':subjectform,'chapterform':chapterform})
    return render(request,'404.html')
def questioncreationview(request): 
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff':
        form=question_form()
        form1=answer_form()  
        return render(request,'academics/question.html',{'form':form,'form1':form1})
    return render(request,'404.html')

 
def chapterlistview(request):
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff':
        form= form_for_chapterlist()
        form2 = Chapterform()
        return render(request,'academics/chapterlist.html',{'form':form,'form2':form2})
    return render(request,'404.html')

def questionlistview(request):  
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff':
        form=questionlist_form()
        return render(request,'academics/questionlist.html',{'form':form})
    return render(request,'404.html')

def chaptercrud(request):  
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff':
        form= chapter_form()
        return render(request,'academics/chapters.html',{'form':form})
    return render(request,'404.html')
def subjectcrud(request):  
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff': 
        form= subject_form()
        return render(request,'academics/subjectcreate.html',{'form':form})
    return render('404.html')

def questionview(request):
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff': 
        form = form_for_chapterlist(auto_id='get_%s')
        questionform = Questionform()
        answerform = Answerform()
        return render(request,'academics/questionandanswers.html',{'form':form,'answerform':answerform,'questionform':questionform})
    return render(request,'404.html')
def question_paperview2(request):
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff': 
        form=questionlist_form()
        test_form = TestForm()
        list_form = chapterlist_form()
        custom_form=questionCustomForm()
        form1=customizeForm()
        return render(request,'academics/question_paper_custom.html',{'form':form,'list_form':list_form,'custom_form':custom_form,'form1':form1,'test_form':test_form})
    return render(request,'404.html')
def question_paperview(request):
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff': 
        form=questionlist_form()
        test_form = TestForm()
        list_form = chapterlist_form()
        custom_form=questionCustomForm()
        form1=customizeForm()
        return render(request,'academics/question_paper_customize.html',{'form':form,'list_form':list_form,'custom_form':custom_form,'form1':form1,'test_form':test_form})
    return render(request,'404.html')

def questioncreate(request):
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff': 
        questionform = Questionform()
        answerform = Answerform()
        return render(request,'academics/question-by-grade.html',{'answerform':answerform,'questionform':questionform})
    return render(request,'404.html')

def test_create(request):
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff': 
        form = form_for_chapterlist(auto_id='get_%s')
        test_form = TestForm()
        return render(request,'academics/test-create.html',{'form':form,'test_form':test_form})
    return render(request,'404.html')
def test_list(request):
    if request.user.user_type =='is_student': 
        return render(request,'academics/student-test-list-page.html')
    return render(request,'404.html')
def testhistory(request):
    if request.user.user_type =='is_student': 
        return render(request,'academics/test-history.html')   
    return render(request,'404.html')
def take_test(request,pk):
    if request.user.user_type =='is_student': 
        return render(request,'academics/take-test.html')
    return render(request,'404.html')
def instruct(request):
    if request.user.user_type =='is_student': 
        form = instruction_form()
        return render(request,'academics/instruction.html',{'form':form})
    return render(request,'404.html')
def questionbank(request):
    if request.user.user_type =='is_student': 
        return render(request,'academics/question-bank.html')
    return render(request,'404.html')
def student_test_history(request):
    if request.user.user_type =='is_admin' or request.user.user_type=='is_staff': 
        form = form_for_chapterlist()
        return render(request,'academics/student-test-history-details.html',{'form':form})
    return render(request,'404.html')